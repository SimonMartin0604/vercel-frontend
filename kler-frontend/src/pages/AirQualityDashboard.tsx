import { useState, useEffect } from 'react';
import { Container, Title, Text, Button, Group, Stack, Tabs, SimpleGrid, Grid, Card, ThemeIcon, Skeleton, TypographyStylesProvider, Box, Badge, Table } from '@mantine/core';
import { BarChart } from '@mantine/charts';
import { IconWind, IconDroplet, IconTemperature, IconCloudRain, IconLeaf, IconRobot, IconChartBar, IconAdjustments, IconFileExport } from '@tabler/icons-react';
import { fetchLocations, getUsername } from '../services/api';
import type { LocationData } from '../types/types';
import HungaryMap from '../components/HungaryMap';
import { useTranslation } from 'react-i18next';

export default function AirQualityDashboard() {
    // Nemzetközi szövegtámogatás
    const { t } = useTranslation();

    // Felhasználónév lekérése a JWT-ből
    const username = getUsername();

    // Statek
    // Melyik helyszín van kiválasztva
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
    // Melyik eszköz van kiválasztva
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    // Betöltés alatt van-e az AI elemzés
    const [loading, setLoading] = useState(false);
    // Az AI elemzés eredménye
    const [analysis, setAnalysis] = useState<string | null>(null);
    // Az összes helyszín adatai
    const [locations, setLocations] = useState<LocationData[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchLocations();
            setLocations(data);
            if (data.length > 0 && selectedLocationId) {
                const foundLocation = data.find(l => l.id === selectedLocationId);
                if (foundLocation && foundLocation.devices && foundLocation.devices.length > 0 && !selectedDeviceId) {
                    // Itt ne állítsuk be automatikusan az eszközt, várjuk meg a felhasználót
                }
            }
        };
        loadData();
    }, []);

    // Kiválasztott helyszín adatai
    const selectedLocation = locations.find(l => l.id === selectedLocationId) || null;

    // Ha megváltozik a helyszín, lenullázzuk az eszközt (vagy csak ha nem érvényes már)
    useEffect(() => {
        if (selectedLocation && selectedLocation.devices && selectedLocation.devices.length > 0) {
            if (!selectedLocation.devices.find(d => d.id === selectedDeviceId)) {
                // Ha a kiválasztott eszköz nem ehhez a helyszínhez tartozik, nullázzuk
                setSelectedDeviceId(null);
            }
        } else {
            setSelectedDeviceId(null);
        }
    }, [selectedLocationId]);

    // Kiválasztott eszköz adatai
    const selectedDevice = selectedLocation?.devices?.find(d => d.id === selectedDeviceId) || null;
    const measurements = selectedDevice?.measurements || [];

    // Legfrissebb mérés a kiválasztott eszközről
    const latestMeasurement = measurements[0] || null;

    // Chart adatok a kiválasztott eszköz legfrissebb mérése alapján
    const chartData = latestMeasurement
        ? [
            { name: 'PM10', value: latestMeasurement.pm10, color: 'yellow.6' },
            { name: 'PM4', value: latestMeasurement.pm4, color: 'orange.6' },
            { name: 'PM2.5', value: latestMeasurement.pm2_5, color: 'red.6' },
            { name: 'PM1', value: latestMeasurement.pm1, color: 'grape.6' },
        ]
        : [];

    // AI elemzés indítása a Gemini API-val
    const handleAnalyze = async () => {
        if (!selectedLocation) return;
        setLoading(true);
        setAnalysis(null);

        // AI-nak átadandó adatok beállítása a locales fájlból
        const prompt = t('airQuality.aiPrompt', {
            name: selectedLocation.name,
            timestamp: new Date(latestMeasurement.timestamp).toLocaleString(),
            pm10: latestMeasurement.pm10,
            pm4: latestMeasurement.pm4,
            pm25: latestMeasurement.pm2_5,
            pm1: latestMeasurement.pm1,
            composition: latestMeasurement.composition || 'Nincs adat',
            temp: latestMeasurement.temp,
            humidity: latestMeasurement.humidity,
            wind_speed: latestMeasurement.wind_speed,
            wind_dir: latestMeasurement.wind_dir,
            dewpoint: latestMeasurement.dewpoint,
            rain: latestMeasurement.rain,
        });

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            // Hívás a Gemini API-hoz
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                }),
            });

            // Hiba kezelés
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || 'Ismeretlen hiba');
            }
            const data = await response.json();

            // A Gemini válaszának feldolgozása
            const aiText = data.candidates[0].content.parts[0].text;
            setAnalysis(aiText);
        } catch (error: any) {
            // Hibakezelés, ha az API hívás sikertelen
            console.error('API hiba:', error);
            // A hibaüzenet megjelenítése a felhasználónak
            setAnalysis(`Hiba történt: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    // Adatok exportálása pontosvesszővel elválasztott CSV formátumban az Excel kompatibilitásért
    const handleExport = () => {
        if (!selectedDevice || !measurements.length) return;

        // Fejléc pontosvesszővel
        const header = "Időpont;PM10;PM4;PM2.5;PM1;Hőmérséklet;Páratartalom;Harmatpont;Szél;Csapadék\n";

        // Adatsorokat fűzzük össze Windows (\r\n) sorvégekkel a jobb kompatibilitásért
        const rows = measurements.map(m => {
            // Tizedespont cseréje vesszőre a magyar Excel miatt
            const f = (val: number | undefined | null) =>
                val !== undefined && val !== null ? val.toString().replace('.', ',') : '0';

            return [
                new Date(m.timestamp).toLocaleString(),
                f(m.pm10),
                f(m.pm4),
                f(m.pm2_5),
                f(m.pm1),
                f(m.temp),
                f(m.humidity),
                f(m.dewpoint),
                `"${m.wind_speed} km/h (${m.wind_dir})"`, // Az idézőjel megvédi a szöveget
                f(m.rain)
            ].join(';');
        }).join('\r\n');

        const fullContent = header + rows;

        // Mentés BOM-mal az ékezetek garantált kezeléséért!
        const BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const blob = new Blob([BOM, fullContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `kler_export_${selectedLocation?.name}_${selectedDevice.name}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Fő komponensek
    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                {/* Header */}
                <Group justify="space-between" align="center">
                    <Stack gap={0}>
                        {/* Üdvözlő szöveg a felhasználónévvel */}
                        {username && (
                            <Text size="xl" fw={1000} c="teal.4" mb={8}>
                                Üdvözöljük, {username}!
                            </Text>
                        )}
                        {/* Cím és alcím a dashboard tetején */}
                        <Title order={2}>{t('airQuality.title')}</Title>
                        <Text c="dimmed">{t('airQuality.subtitle')}</Text>
                    </Stack>
                    <div style={{ width: 250 }}>
                        {/* Kiválasztott helyszín megjelenítése */}
                        <Text size="sm" c="dimmed">{t('airQuality.location')}: {selectedLocation ? selectedLocation.name : '—'}</Text>
                    </div>
                </Group>

                {/* Magyarország térkép a helyszínek kiválasztásához */}
                <Box my="md">
                    <HungaryMap locations={locations} selectedId={selectedLocationId} onSelect={setSelectedLocationId} />
                </Box>

                {selectedLocation && (
                    <Stack gap="md">
                        {/* Eszköz választó doboz */}
                        <Card withBorder radius="md" p="md">
                            <Stack gap="md">
                                <Group mb={0}>
                                    <ThemeIcon variant="light" color="indigo" size="lg">
                                        <IconAdjustments size={20} />
                                    </ThemeIcon>
                                    <Title order={3} size="h4">{t('airQuality.devicesAtLocation')}</Title>
                                </Group>

                                <Text size="sm" c="dimmed">{t('airQuality.selectDevicePrompt')}</Text>

                                {selectedLocation.devices && selectedLocation.devices.length > 0 ? (
                                    <Tabs value={selectedDeviceId} onChange={setSelectedDeviceId} variant="pills" radius="md">
                                        <Tabs.List>
                                            {selectedLocation.devices.map((device) => (
                                                <Tabs.Tab key={device.id} value={device.id} fw={600}>
                                                    {device.name}
                                                </Tabs.Tab>
                                            ))}
                                        </Tabs.List>
                                    </Tabs>
                                ) : (
                                    <Text c="dimmed" fs="italic">{t('airQuality.noDevices')}</Text>
                                )}
                            </Stack>
                        </Card>

                        {selectedDevice && latestMeasurement && (
                            <>
                                {/* Main Tabs: Charts and Weather */}
                                <Tabs defaultValue="charts" variant="outline" radius="md">
                                    <Tabs.List>
                                        <Tabs.Tab value="charts" leftSection={<IconChartBar size={16} />}>
                                            {t('airQuality.tabCharts')}
                                        </Tabs.Tab>
                                        <Tabs.Tab value="weather" leftSection={<IconCloudRain size={16} />}>
                                            {t('airQuality.tabWeather')}
                                        </Tabs.Tab>
                                    </Tabs.List>

                                    <Tabs.Panel value="charts" pt="sm">
                                        <Grid gutter="lg">
                                            <Grid.Col span={{ base: 12, md: 8 }}>
                                                <Card withBorder radius="md" p="md" style={{ minHeight: 360 }}>
                                                    <Title order={4} mb="lg">{t('airQuality.chartTitle')}</Title>
                                                    <BarChart
                                                        h={300}
                                                        data={chartData}
                                                        dataKey="name"
                                                        series={[{ name: 'value', color: 'blue.6', label: t('airQuality.concentration') }]}
                                                        tickLine="y"
                                                        gridAxis="y"
                                                        tooltipAnimationDuration={200}
                                                    />
                                                    <Text size="sm" c="dimmed" mt="md" ta="center">
                                                        {t('airQuality.chartSubtitle')}
                                                    </Text>
                                                </Card>
                                            </Grid.Col>

                                            <Grid.Col span={{ base: 12, md: 4 }}>
                                                <Card withBorder radius="md" p="md">
                                                    <Stack justify="space-between">
                                                        <Box>
                                                            <Group mb="md">
                                                                <ThemeIcon variant="light" color="teal" size="lg">
                                                                    <IconLeaf size={20} />
                                                                </ThemeIcon>
                                                                <Title order={4}>{t('airQuality.compositionTitle')}</Title>
                                                            </Group>
                                                            <Text size="md" style={{ lineHeight: 1.6 }}>
                                                                {latestMeasurement.composition || t('airQuality.noData')}
                                                            </Text>
                                                        </Box>

                                                        <Box mt="xl">
                                                            <Title order={5} mb="xs">{t('airQuality.aiAnalysisTitle')}</Title>
                                                            <Button
                                                                leftSection={<IconRobot size={16} />}
                                                                variant="gradient"
                                                                gradient={{ from: 'indigo', to: 'cyan' }}
                                                                onClick={handleAnalyze}
                                                                loading={loading}
                                                                fullWidth
                                                            >
                                                                {t('airQuality.analyzeBtn')}
                                                            </Button>
                                                        </Box>
                                                    </Stack>
                                                </Card>
                                            </Grid.Col>

                                            {(loading || analysis) && (
                                                <Grid.Col span={12}>
                                                    <Card withBorder radius="md" p="lg" bg="var(--mantine-color-body)">
                                                        <Title order={4} mb="md" c="indigo">{t('airQuality.detailAnalysis')}</Title>
                                                        <Skeleton visible={loading} height={loading ? 200 : 'auto'}>
                                                            {analysis && (
                                                                <TypographyStylesProvider>
                                                                    <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br/>') }} />
                                                                </TypographyStylesProvider>
                                                            )}
                                                        </Skeleton>
                                                    </Card>
                                                </Grid.Col>
                                            )}
                                        </Grid>
                                    </Tabs.Panel>

                                    <Tabs.Panel value="weather" pt="sm">
                                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                                            <WeatherCard
                                                title={t('airQuality.weatherTemp')}
                                                value={`${latestMeasurement.temp}°C`}
                                                icon={IconTemperature}
                                                color="orange"
                                            />
                                            <WeatherCard
                                                title={t('airQuality.weatherHumidity')}
                                                value={`${latestMeasurement.humidity}%`}
                                                icon={IconDroplet}
                                                color="blue"
                                            />
                                            <WeatherCard
                                                title={t('airQuality.weatherWind')}
                                                value={`${latestMeasurement.wind_speed} km/h`}
                                                subValue={latestMeasurement.wind_dir}
                                                icon={IconWind}
                                                color="cyan"
                                            />
                                            <WeatherCard
                                                title={t('airQuality.weatherDewpoint')}
                                                value={`${latestMeasurement.dewpoint}°C`}
                                                icon={IconTemperature}
                                                color="grape"
                                            />
                                            <WeatherCard
                                                title={t('airQuality.weatherRain')}
                                                value={`${latestMeasurement.rain} mm`}
                                                icon={IconCloudRain}
                                                color="indigo"
                                            />
                                        </SimpleGrid>
                                    </Tabs.Panel>
                                </Tabs>

                                {/* Historical Measurements Table */}
                                <Card withBorder radius="md" p="md">
                                    <Stack gap="md">
                                        <Group justify="space-between" mb="xs">
                                            <Text fw={700} size="lg">{t('airQuality.selectedDevice')}: {selectedDevice.name}</Text>
                                            <Badge color={selectedDevice.status === 'active' ? 'teal' : 'orange'} variant="light">
                                                {selectedDevice.status}
                                            </Badge>
                                        </Group>

                                        <Group justify="space-between" mb="xs">
                                            <Title order={4} size="h5">{t('airQuality.measurements')}</Title>
                                            <Button
                                                variant="light"
                                                color="teal"
                                                size="xs"
                                                leftSection={<IconFileExport size={16} />}
                                                onClick={handleExport}
                                                disabled={!measurements.length}
                                            >
                                                {t('airQuality.exportBtn')}
                                            </Button>
                                        </Group>
                                        <Box style={{ overflowX: 'auto' }}>
                                            <Table verticalSpacing="xs" highlightOnHover withTableBorder withColumnBorders>
                                                <Table.Thead>
                                                    <Table.Tr>
                                                        <Table.Th>{t('airQuality.timestamp')}</Table.Th>
                                                        <Table.Th>PM10</Table.Th>
                                                        <Table.Th>PM4</Table.Th>
                                                        <Table.Th>PM2.5</Table.Th>
                                                        <Table.Th>PM1</Table.Th>
                                                        <Table.Th>{t('airQuality.weatherTemp')}</Table.Th>
                                                        <Table.Th>{t('airQuality.weatherHumidity')}</Table.Th>
                                                        <Table.Th>{t('airQuality.weatherDewpoint')}</Table.Th>
                                                        <Table.Th>{t('airQuality.weatherWind')}</Table.Th>
                                                        <Table.Th>{t('airQuality.weatherRain')}</Table.Th>
                                                    </Table.Tr>
                                                </Table.Thead>
                                                <Table.Tbody>
                                                    {measurements.map((m) => (
                                                        <Table.Tr key={m.id}>
                                                            <Table.Td style={{ whiteSpace: 'nowrap' }}>
                                                                {new Date(m.timestamp).toLocaleString()}
                                                            </Table.Td>
                                                            <Table.Td>{m.pm10} µg/m³</Table.Td>
                                                            <Table.Td>{m.pm4 || 0} µg/m³</Table.Td>
                                                            <Table.Td>{m.pm2_5} µg/m³</Table.Td>
                                                            <Table.Td>{m.pm1 || 0} µg/m³</Table.Td>
                                                            <Table.Td>{m.temp} °C</Table.Td>
                                                            <Table.Td>{m.humidity} %</Table.Td>
                                                            <Table.Td>{m.dewpoint || 0} °C</Table.Td>
                                                            <Table.Td>
                                                                {m.wind_speed} km/h ({m.wind_dir})
                                                            </Table.Td>
                                                            <Table.Td>{m.rain || 0} mm</Table.Td>
                                                        </Table.Tr>
                                                    ))}
                                                </Table.Tbody>
                                            </Table>
                                        </Box>
                                    </Stack>
                                </Card>
                            </>
                        )}
                    </Stack>
                )}
            </Stack>
        </Container>
    );
}

// Segédkomponens az időjárási adatok megjelenítéséhez
function WeatherCard({ title, value, subValue, icon: Icon, color }: any) {
    return (
        <Card withBorder radius="md" p="md">
            <Group justify="space-between">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                    {title}
                </Text>
                <Icon size={20} stroke={1.5} color={`var(--mantine-color-${color}-6)`} />
            </Group>

            <Group align="flex-end" gap="xs" mt={25}>
                <Text fw={700} size="xl">{value}</Text>
                {subValue && (
                    <Text c="dimmed" size="sm" fw={700}>
                        {subValue}
                    </Text>
                )}
            </Group>
        </Card>
    );
}
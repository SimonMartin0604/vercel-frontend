import { Paper, Group, Text, ThemeIcon } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface StatCardProps {
    title: string; // Pl. "Összes Felhasználó"
    value: string; // Pl. "10"
    unit: string; // Pl. "fő"
    diff?: number; // Pl. 20 (20%-os növekedés)
    icon: any; // Pl. IconUsers
    color?: string; // Pl. "indigo", "teal"
    status?: 'good' | 'warning' | 'danger'; // pl. "good" (zöld), "warning" (narancs), "danger" (piros) - alapértelmezett "good"
}

// Komponens a statcardhoz, icon és különbséghez
export function StatCard({ title, value, unit, diff, icon: Icon, color, status = 'good' }: StatCardProps) {
    const { t } = useTranslation();
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'danger': return 'red';
            case 'warning': return 'orange';
            default: return 'teal';
        }
    };

    // Ha szín nincs megadva, akkor a státusz alapján választunk színty
    const statusColor = color || getStatusColor(status);
    const DiffIcon = diff && diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    // Különbség megjelenítése csak akkor, ha diff érték van megadva
    return (

        <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
                {/* Szöveg */}
                <div>
                    <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
                        {title}
                    </Text>
                    <Text fw={700} fz="xl">
                        {value} <Text span fz="sm" fw={500}>{unit}</Text>
                    </Text>
                </div>
                <ThemeIcon color={statusColor} variant="light" size={38} radius="md">
                    <Icon size={24} stroke={1.5} />
                </ThemeIcon>
            </Group>

            {/* Különbség */}
            {typeof diff !== 'undefined' && (
                <Group align="flex-end" gap="xs" mt={25}>
                    <Text c={diff > 0 ? 'teal' : 'red'} fw={700} className="diff">
                        <span>{diff}%</span>
                        <DiffIcon size={16} stroke={1.5} />
                    </Text>
                    <Text c="dimmed" fz="xs">{t('admin.diff')}</Text>
                </Group>
            )}
        </Paper>
    );
}
import { Container, Title, SimpleGrid, Paper, Table, Badge, Button, Group, Text, ActionIcon, Modal, TextInput, Select, Stack, Progress, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconUsers, IconDeviceAnalytics, IconSettings, IconTrash, IconEdit } from '@tabler/icons-react';
import { StatCard } from '../components/StatCard';
import { fetchDevicesData, fetchAdminStats, fetchLocations, fetchUsers, updateUserRole, deleteUser, createSite, createDevice, updateSite, deleteSite, updateDevice, deleteDevice } from '../services/api';
import type { Device, LocationData } from '../types/types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Adminisztrációs oldal
export default function AdminDashboard() {
    const { t } = useTranslation();
    const [devices, setDevices] = useState<Device[]>([]);
    const [locations, setLocations] = useState<LocationData[]>([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalDevices: 0, activeDevices: 0 });
    const [users, setUsers] = useState<any[]>([]);

    // Modals
    const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
    const [usersOpened, { open: openUsers, close: closeUsers }] = useDisclosure(false);
    const [addSiteOpened, { open: openAddSite, close: closeAddSite }] = useDisclosure(false);
    const [editSiteOpened, { open: openEditSite, close: closeEditSite }] = useDisclosure(false);
    const [manageLocationsOpened, { open: openManageLocations, close: closeManageLocations }] = useDisclosure(false);

    const [editingDevice, setEditingDevice] = useState<Device | null>(null);
    const [editingSite, setEditingSite] = useState<LocationData | null>(null);

    const handleManageUsers = async () => {
        openUsers();
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleRoleChange = async (userId: number, currentRole: string) => {
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
        try {
            await updateUserRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));

            // Ha netán saját magát fokozta le, jelezhetnénk is, de ezt a backend guardok úgyis kezelik
        } catch (e) {
            console.error('Hiba történt a jogosultság állítása közben', e);
            alert(t('admin.authError', 'Hitelesítési hiba, vagy nincs jogod ehhez a módosításhoz.'));
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!window.confirm(t('admin.confirmDeleteUser', 'Biztosan törölni szeretnéd a felhasználót?'))) return;
        try {
            await deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            // Frissíthetjük a statisztikát is lokálisan hogy rögtön látszódjon
            setStats(prev => ({ ...prev, totalUsers: Math.max(0, prev.totalUsers - 1) }));
        } catch (e) {
            console.error('Hiba a törlés során', e);
            alert('Hiba történt a fájl törlése során.');
        }
    };

    // Eszköz hozzáadása form
    const addForm = useForm({
        initialValues: {
            name: '',
            site_id: '',
            status: 'active',
            measure_interval: 300,
            computer_type: 'Raspberry Pi',
        },
        validate: {
            name: (value) => (value.length < 2 ? t('admin.nameError', 'Név túl rövid') : null),
            site_id: (value) => (!value ? t('admin.siteError', 'Válassz helyszínt') : null),
        },
    });

    // Site hozzáadása form
    const addSiteForm = useForm({
        initialValues: {
            name: '',
            lat: '',
            lon: '',
        },
        validate: {
            name: (value) => (value.length < 2 ? t('admin.nameError', 'Név túl rövid') : null),
        },
    });

    const editForm = useForm({
        initialValues: {
            name: '',
            status: 'active',
        },
        validate: {
            name: (value) => (value.length < 2 ? t('admin.nameError', 'Név túl rövid') : null),
        },
    });

    const editSiteForm = useForm({
        initialValues: {
            name: '',
            lat: '',
            lon: '',
        },
        validate: {
            name: (value) => (value.length < 2 ? t('admin.nameError', 'Név túl rövid') : null),
        },
    });

    // Adatok betöltése
    const handleAddSite = async (values: typeof addSiteForm.values) => {
        try {
            await createSite(values);
            closeAddSite();
            addSiteForm.reset();
            loadData(); // Újratöltjük az adatokat, hogy azonnal látsszon
        } catch (e) {
            console.error('Hiba helyszín hozzáadásakor', e);
            alert(t('admin.addSiteError', 'Nem sikerült hozzáadni a helyszínt.'));
        }
    };

    const handleAddDevice = async (values: typeof addForm.values) => {
        try {
            await createDevice({
                ...values,
                site_id: parseInt(values.site_id)
            });
            closeAdd();
            addForm.reset();
            loadData();
        } catch (e) {
            console.error('Hiba eszköz hozzáadásakor', e);
            alert(t('admin.addDeviceError', 'Nem sikerült hozzáadni az eszközt.'));
        }
    };

    const handleEditDevice = (device: Device) => {
        setEditingDevice(device);
        editForm.setValues({
            name: device.name,
            status: device.status,
        });
        openEdit();
    };

    const handleUpdateDevice = async (values: typeof editForm.values) => {
        if (!editingDevice) return;
        try {
            await updateDevice(parseInt(editingDevice.id), values);
            closeEdit();
            loadData();
        } catch (e) {
            console.error('Hiba eszköz frissítésekor', e);
            alert('Sikertelen frissítés.');
        }
    };

    const handleDeleteDevice = async (id: string) => {
        if (!window.confirm(t('admin.confirmDeleteDevice', 'Biztosan törölni szeretnéd ezt az eszközt? FIGYELEM: Az eszközhöz tartozó összes korábbi mérési adat véglegesen elvész!'))) return;
        try {
            await deleteDevice(parseInt(id));
            loadData();
        } catch (e) {
            console.error('Hiba eszköz törlésekor', e);
            alert('Nem sikerült törölni az eszközt.');
        }
    };

    const handleEditSite = (site: LocationData) => {
        setEditingSite(site);
        editSiteForm.setValues({
            name: site.name,
            lat: site.lat?.toString() || '',
            lon: site.lon?.toString() || '',
        });
        openEditSite();
    };

    const handleUpdateSite = async (values: typeof editSiteForm.values) => {
        if (!editingSite) return;
        try {
            await updateSite(parseInt(editingSite.id), values);
            closeEditSite();
            loadData();
        } catch (e) {
            console.error('Hiba helyszín frissítésekor', e);
            alert('Sikertelen frissítés.');
        }
    };

    const handleDeleteSite = async (id: string) => {
        if (!window.confirm(t('admin.confirmDeleteSite', 'Biztosan törölni szeretnéd ezt a helyszínt? FIGYELEM: A helyszín törlésével az összes oda tartozó ESZKÖZ és azok MÉRÉSI ADATAI is véglegesen törlődnek!'))) return;
        try {
            await deleteSite(parseInt(id));
            loadData();
        } catch (e) {
            console.error('Hiba helyszín törlésekor', e);
            alert('Nem sikerült törölni a helyszínt. Ellenőrizd, hogy nincsenek-e hozzárendelt eszközök!');
        }
    };

    const loadData = async () => {
        try {
            const [dData, sData, lData] = await Promise.all([
                fetchDevicesData(),
                fetchAdminStats(),
                fetchLocations()
            ]);
            setDevices(dData);
            setStats(sData);
            setLocations(lData);
        } catch (error) {
            console.error("Error loading admin data", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);


    const locationOptions = locations.map(l => ({ value: l.id.toString(), label: l.name }));

    const rows = devices.map((device) => (
        <Table.Tr key={device.id}>
            <Table.Td>
                <Text fz="sm" fw={500}>{device.name}</Text>
                <Text fz="xs" c="dimmed">ID: {device.id}</Text>
            </Table.Td>
            <Table.Td>{device.location}</Table.Td>
            <Table.Td>
                <Badge
                    color={device.status === 'active' ? 'teal' : device.status === 'maintenance' ? 'orange' : 'red'}
                    variant="light">
                    {device.status === 'active' ? t('admin.activeStatus') : device.status === 'maintenance' ? t('admin.maintenanceStatus') : t('admin.inactiveStatus')}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Text fz="sm">{device.lastSeen}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap={0} justify="flex-end">
                    <ActionIcon variant="subtle" color="gray" onClick={() => handleEditDevice(device)}>
                        <IconEdit size={16} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteDevice(device.id)}>
                        <IconTrash size={16} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    //Terheltség kiszámítása (50 aktív eszköz = 100%)
    const loadPercent = (stats.activeDevices / 50) * 100;
    const systemLoadFormatted = loadPercent.toFixed(1);
    const isOverloaded = loadPercent >= 100;

    return (
        <Container size="xl" py="md">
            <Group justify="space-between" mb="lg">
                <Title order={2}>{t('admin.title')}</Title>
                <Group>
                    <Button leftSection={<IconUsers size={20} />} variant="light" onClick={handleManageUsers}>
                        {t('admin.manageUsersTitle', 'Felhasználók kezelése')}
                    </Button>
                    <Button leftSection={<IconDeviceAnalytics size={20} />} variant="light" onClick={openManageLocations}>
                        {t('admin.manageLocationsBtn', 'Helyszínek kezelése')}
                    </Button>
                </Group>
            </Group>

            {/* Admin Stats */}
            <SimpleGrid cols={{ base: 1, sm: 3 }} mb="xl">
                <StatCard
                    title={t('admin.totalUsers', 'Felhasználók')}
                    value={stats.totalUsers.toString()}
                    unit={t('admin.users', 'fő')}
                    icon={IconUsers}
                    color="indigo"
                    diff={0}
                />
                <StatCard
                    title={t('admin.totalDevices', 'Összes Eszköz')}
                    value={stats.totalDevices.toString()}
                    unit={t('admin.devices', 'db')}
                    icon={IconDeviceAnalytics}
                    color="teal"
                    diff={0}
                />
                <Paper withBorder radius="md" p="md">
                    <Group justify="space-between">
                        <div>
                            <Text c="dimmed" tt="uppercase" fw={700} fz="xs">{t('admin.systemLoad', 'Rendszerterheltség')}</Text>
                            <Text fw={700} fz="xl" c={isOverloaded ? 'red' : 'white'}>
                                {systemLoadFormatted} <Text span fz="sm" fw={500}>%</Text>
                            </Text>
                        </div>
                        <ThemeIcon color={isOverloaded ? "red" : "grape"} variant="light" size={38} radius="md">
                            <IconSettings size={24} stroke={1.5} />
                        </ThemeIcon>
                    </Group>
                    <Group align="flex-end" gap="xs" mt={25} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                        <Group justify="space-between" w="100%" m={0}>
                            <Text c="dimmed" fz="xs">{t('admin.activeDevices', 'Aktív eszközök')} ({stats.activeDevices} / 50)</Text>
                            <Text c={isOverloaded ? "red" : "dimmed"} fz="xs" fw={isOverloaded ? 700 : 500}>{isOverloaded ? '!' : ''}</Text>
                        </Group>
                        <Progress value={Math.min(loadPercent, 100)} color={isOverloaded ? "red" : "grape"} size="sm" radius="md" />
                    </Group>
                </Paper>
            </SimpleGrid>

            {/* Eszközök kezelése táblázat */}
            <Paper withBorder p="md" radius="md">
                <Group justify="space-between" mb="md">
                    <Text size="lg" fw={700}>{t('admin.manageDevices')}</Text>
                    <Group gap="sm">
                        <Button variant="outline" size="xs" onClick={openAddSite}>{t('admin.addSiteBtn', 'Új Helyszín')}</Button>
                        <Button variant="light" size="xs" onClick={openAdd}>{t('admin.addDeviceBtn', 'Új Eszköz')}</Button>
                    </Group>
                </Group>
                <Table verticalSpacing="sm" highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t('admin.deviceNameLabel')}</Table.Th>
                            <Table.Th>{t('admin.locationLabel')}</Table.Th>
                            <Table.Th>{t('admin.statusLabel')}</Table.Th>
                            <Table.Th>{t('admin.lastSeenLabel')}</Table.Th>
                            <Table.Th />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Paper>

            {/* Eszköz hozzáadása */}
            <Modal opened={addOpened} onClose={closeAdd} title={t('admin.addDeviceTitle', 'Új mérőállomás hozzáadása')} yOffset="10vh">
                <form onSubmit={addForm.onSubmit(handleAddDevice)}>
                    <Stack>
                        <TextInput
                            label={t('admin.deviceNameLabel', 'Eszköz neve')}
                            placeholder="Pl. Belvárosi 1"
                            {...addForm.getInputProps('name')}
                        />
                        <Select
                            label={t('admin.locationLabel', 'Helyszín')}
                            placeholder={t('admin.selectLocation', 'Válassz helyszínt')}
                            data={locationOptions}
                            {...addForm.getInputProps('site_id')}
                        />
                        <Select
                            label={t('admin.statusLabel', 'Státusz')}
                            data={[
                                { value: 'active', label: t('admin.activeStatus', 'Aktív') },
                                { value: 'inactive', label: t('admin.inactiveStatus', 'Inaktív') },
                                { value: 'maintenance', label: t('admin.maintenanceStatus', 'Karbantartás') },
                            ]}
                            {...addForm.getInputProps('status')}
                        />
                        <Group justify="flex-end" mt="md">
                            <Button variant="default" onClick={closeAdd}>{t('common.cancel', 'Mégse')}</Button>
                            <Button type="submit">{t('common.save', 'Mentés')}</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

            {/* Eszköz szerkesztése */}
            <Modal opened={editOpened} onClose={closeEdit} title={t('admin.editDeviceTitle', 'Mérőállomás szerkesztése')} yOffset="10vh">
                <form onSubmit={editForm.onSubmit(handleUpdateDevice)}>
                    <Stack>
                        <TextInput
                            label={t('admin.deviceNameLabel', 'Eszköz neve')}
                            {...editForm.getInputProps('name')}
                        />
                        <Select
                            label={t('admin.statusLabel', 'Státusz')}
                            data={[
                                { value: 'active', label: t('admin.activeStatus', 'Aktív') },
                                { value: 'inactive', label: t('admin.inactiveStatus', 'Inaktív') },
                                { value: 'maintenance', label: t('admin.maintenanceStatus', 'Karbantartás') },
                            ]}
                            {...editForm.getInputProps('status')}
                        />
                        <Group justify="flex-end" mt="md">
                            <Button variant="default" onClick={closeEdit}>{t('common.cancel', 'Mégse')}</Button>
                            <Button type="submit">{t('common.save', 'Mentés')}</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

            {/* Új helyszín hozzáadása modell */}
            <Modal opened={addSiteOpened} onClose={closeAddSite} title={t('admin.addSiteTitle', 'Új mérőállomás helyszín hozzáadása')} yOffset="10vh">
                <form onSubmit={addSiteForm.onSubmit(handleAddSite)}>
                    <Stack>
                        <TextInput
                            label={t('admin.siteNameFieldLabel', 'Helyszín neve')}
                            placeholder="Pl. Belvárosi 2"
                            {...addSiteForm.getInputProps('name')}
                        />
                        <TextInput
                            label={t('admin.siteLatFieldLabel', 'Földrajzi szélesség (opcionális)')}
                            placeholder="47.4979"
                            {...addSiteForm.getInputProps('lat')}
                        />
                        <TextInput
                            label={t('admin.siteLonFieldLabel', 'Földrajzi hosszúság (opcionális)')}
                            placeholder="19.0402"
                            {...addSiteForm.getInputProps('lon')}
                        />
                        <Group justify="flex-end" mt="md">
                            <Button variant="default" onClick={closeAddSite}>{t('common.cancel', 'Mégse')}</Button>
                            <Button type="submit">{t('common.save', 'Mentés')}</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

            {/* Felhasználók kezelése Modal */}
            <Modal opened={usersOpened} onClose={closeUsers} title={t('admin.manageUsersTitle', 'Felhasználók kezelése')} size="lg" yOffset="10vh">
                <Table highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>ID</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>{t('admin.roleLabel', 'Szerepkör')}</Table.Th>
                            <Table.Th></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {users.length > 0 ? users.map(u => (
                            <Table.Tr key={u.id}>
                                <Table.Td>{u.id}</Table.Td>
                                <Table.Td><Text fw={500}>{u.email}</Text></Table.Td>
                                <Table.Td>
                                    <Badge
                                        color={u.role === 'ADMIN' ? 'red' : 'blue'}
                                        variant="filled"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleRoleChange(u.id, u.role)}
                                        title={t('admin.roleChangeTitle', 'Kattints a jogosultság megváltoztatásához!')}
                                    >
                                        {u.role}
                                    </Badge>
                                </Table.Td>
                                <Table.Td pr={0}>
                                    <ActionIcon color="red" variant="subtle" onClick={() => handleDeleteUser(u.id)} title={t('admin.deleteUserTitle', 'Felhasználó törlése')}>
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Table.Td>
                            </Table.Tr>
                        )) : (
                            <Table.Tr>
                                <Table.Td colSpan={4} ta="center">{t('admin.noUsers', 'Nincsenek elérhető felhasználók')}</Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Modal>

            {/* Helyszínek kezelése Modal */}
            <Modal opened={manageLocationsOpened} onClose={closeManageLocations} title={t('admin.manageLocationsTitle', 'Helyszínek kezelése')} size="lg" yOffset="10vh">
                <Table highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t('admin.siteNameFieldLabel', 'Helyszín neve')}</Table.Th>
                            <Table.Th>Lat / Lon</Table.Th>
                            <Table.Th></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {locations.map(loc => (
                            <Table.Tr key={loc.id}>
                                <Table.Td><Text fw={500}>{loc.name}</Text></Table.Td>
                                <Table.Td>{loc.lat} / {loc.lon}</Table.Td>
                                <Table.Td pr={0}>
                                    <Group gap={0} justify="flex-end">
                                        <ActionIcon variant="subtle" color="gray" onClick={() => handleEditSite(loc)}>
                                            <IconEdit size={16} />
                                        </ActionIcon>
                                        <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteSite(loc.id)}>
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Modal>

            {/* Helyszín szerkesztése Modal */}
            <Modal opened={editSiteOpened} onClose={closeEditSite} title={t('admin.editSiteTitle', 'Helyszín szerkesztése')} yOffset="10vh">
                <form onSubmit={editSiteForm.onSubmit(handleUpdateSite)}>
                    <Stack>
                        <TextInput
                            label={t('admin.siteNameFieldLabel')}
                            {...editSiteForm.getInputProps('name')}
                        />
                        <TextInput
                            label={t('admin.siteLatFieldLabel')}
                            {...editSiteForm.getInputProps('lat')}
                        />
                        <TextInput
                            label={t('admin.siteLonFieldLabel')}
                            {...editSiteForm.getInputProps('lon')}
                        />
                        <Group justify="flex-end" mt="md">
                            <Button variant="default" onClick={closeEditSite}>{t('common.cancel', 'Mégse')}</Button>
                            <Button type="submit">{t('common.save', 'Mentés')}</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </Container>
    );
}
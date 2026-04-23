import { AppShell, Burger, Group, Button, Title, ActionIcon, useMantineColorScheme, useComputedColorScheme, Image, Box, Divider, NavLink, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSun, IconMoon, IconPhone, IconShieldLock, IconCookie } from '@tabler/icons-react';
import LandingPage from './pages/LandingPage';
import { Footer } from './components/Footer';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import AirQualityDashboard from './pages/AirQualityDashboard';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from './components/LanguagePicker';

export default function App() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('dark', { 
    getInitialValueInEffect: true 
  });
 const isDashboard = window.location.pathname.startsWith('/air-quality') || window.location.pathname.startsWith('/admin-dashboard');


  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      {/* Navbár monitor */}
      <AppShell.Header style={{ position: 'sticky', top: 0, zIndex: 1200 }}>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap={5} wrap="nowrap" style={{ flexShrink: 1, minWidth: 0 }}>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
              <Group gap="xs" style={{ cursor: 'pointer', flexShrink: 1, minWidth: 0 }}
              onClick={() => {
              // Ha már a főoldalon vagyunk, a #Hero-hoz görget
              if (window.location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Ha másik oldalon vagyunk (pl. /auth), visszavisz a főoldalra
              } else {
              navigate('/');
            }}}> 
                <Image radius="md" src="/img/AtmoSense.png" h={30} w="auto" />
                <Title order={3} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>KLER</Title>
              </Group>
          </Group>

          <Group visibleFrom="sm">
              <Button variant="subtle" component="a" href="/#Hero">{t('nav.home')}</Button>
              <Button variant="subtle" component="a" href="/#Problems">{t('nav.problems')}</Button>
              <Button variant="subtle" component="a" href="/#HowItWorks">{t('nav.howItWorks')}</Button>
              <Button variant="subtle" component="a" href="/#Technology">{t('nav.technology')}</Button>
            {isDashboard ? (
              <Button onClick={() => navigate('/')} color="red" variant="light">{t('nav.logout')}</Button>
            ) : (
              <Button onClick={() => navigate('/auth')}>{t('nav.login')}</Button>
            )}
            <LanguagePicker />
            <ActionIcon
              onClick={() =>
                setColorScheme(
                  computedColorScheme === 'light' ? 'dark' : 'light'
                )
              }
              variant="default"
              size="lg"
              aria-label="Toggle color scheme"
            >
              {computedColorScheme === 'light' ? (
                <IconMoon size={18} />
              ) : (
                <IconSun size={18} />
              )}
            </ActionIcon>
          </Group>
          <Box hiddenFrom="sm">
            <Group gap={5} wrap="nowrap">
              <LanguagePicker />
              <ActionIcon
                onClick={() =>
                  setColorScheme(
                    computedColorScheme === 'light' ? 'dark' : 'light'
                  )
                }
                variant="default"
                size="lg"
                aria-label="Toggle color scheme"
              >
                {computedColorScheme === 'light' ? (
                  <IconMoon size={18} />
                ) : (
                  <IconSun size={18} />
                )}
              </ActionIcon>
            </Group>
          </Box>
        </Group>
      </AppShell.Header>

      {/* Navbár mobilos */}
      <AppShell.Navbar p="md">
        <Stack gap="xs">
          <Button variant="subtle" fullWidth component="a" href="/#Hero"
          onClick={toggle}>
            {t('nav.home')}
          </Button>
          <Button variant="subtle" fullWidth component="a" href="/#Problems"
          onClick={toggle}>
            {t('nav.problems')}
          </Button>
          <Button variant="subtle" fullWidth component="a" href="/#HowItWorks"
          onClick={toggle}>
            {t('nav.howItWorks')}
          </Button>
          <Button variant="subtle" fullWidth component="a" href="/#Technology"
          onClick={toggle}>
            {t('nav.technology')}
          </Button>
          
          {isDashboard ? (
                <Button onClick={() => navigate('/')} color="red" variant="light">{t('nav.logout')}</Button>
              ) : (
                <Button fullWidth mt="xs" onClick={() => { navigate('/auth'); toggle(); }}>{t('nav.login')}</Button>
              )}

          <Divider my="sm" label={t('dev.title') ? "Információk" : "Information"} labelPosition="center" />
          
          <Box px="xs">
            <NavLink
              label={t('footer.contact')}
              leftSection={<IconPhone size={20} stroke={1.5} />}
              onClick={() => { navigate('/contact'); toggle(); }}
              variant="light"
              color="teal"
              styles={{
                root: { borderRadius: '8px', marginBottom: '4px' },
                label: { fontWeight: 500 }
              }}
            />
            <NavLink
              label={t('footer.privacy')}
              leftSection={<IconShieldLock size={20} stroke={1.5} />}
              onClick={() => { navigate('/privacy'); toggle(); }}
              variant="light"
              color="blue"
              styles={{
                root: { borderRadius: '8px', marginBottom: '4px' },
                label: { fontWeight: 500 }
              }}
            />
            <NavLink
              label={t('footer.cookies')}
              leftSection={<IconCookie size={20} stroke={1.5} />}
              onClick={() => { navigate('/cookies'); toggle(); }}
              variant="light"
              color="orange"
              styles={{
                root: { borderRadius: '8px' },
                label: { fontWeight: 500 }
              }}
            />
          </Box>
        </Stack>
      </AppShell.Navbar>

      { /* Ablakok váltása */}
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/air-quality" element={<AirQualityDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
        </Routes>
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}

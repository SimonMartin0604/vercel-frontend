import { Container, Title, Text, Button, Group, Flex, SimpleGrid, Card, ThemeIcon, Box, Image, Progress, Grid } from '@mantine/core';
import { IconDeviceDesktopCode, IconAi, IconBrightnessAuto, IconCertificateOff, IconClockShield, IconDeviceTabletCode, IconHeartHandshake, IconMapPinOff, IconMicroscope, IconNetwork, IconPhotoSensor3, IconReportAnalytics, IconRotate3d, IconSchool, IconScreenShare, IconScreenShareOff, IconSettingsAi, IconAward } from '@tabler/icons-react';
import '../App.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      {/* HERO */}
      <Box py={{ base: 40, sm: 80 }}>
        <Container size="lg" id="Hero" style={{ scrollMarginTop: '220px' }}>
          <Flex gap="md" justify="space-between" align="center" direction={{ base: 'column', sm: 'row' }}>
            <div style={{ maxWidth: 520, textAlign: 'center' }}>
              <Title order={1} fz={{ base: 32, sm: 60 }} mb="md" style={{ lineHeight: 1.1 }}>
                {t('landing.heroTitle')} <Text span c="teal" inherit>{t('landing.heroHighlight')}</Text> {t('landing.heroSystem')}
              </Title>

              <Text c="dimmed" fz={{ base: 'md', md: 'lg' }} mb={30}>
                {t('landing.heroDesc')}
              </Text>

              <Group justify="center">
                <Button size="lg" onClick={() => navigate('/auth')}>{t('landing.heroAction1')}</Button>
                <Button
                  size="lg"
                  variant="outline"
                  component="a" href="/#Problems">
                  {t('landing.heroAction2')}

                </Button>
              </Group>
            </div>

            <Image
              src="/img/sensor.png"
              w={{ base: 250, sm: 300 }}
              h={{ base: 250, sm: 300 }}
              radius="lg"
              fit="cover"
              style={{ boxShadow: 'var(--mantine-shadow-xl)', border: '2px solid var(--mantine-color-teal-8)' }}
            />
          </Flex>
        </Container>
      </Box>

      {/* Problems */}
      <Container fluid px={{ base: 'md', md: 'xl', xl: 120 }} py={60} style={{ scrollMarginTop: '40px' }} id="Problems">
        <Title order={2} ta="center" mb="sm" fz={{ base: 32, md: 44 }} fw={800}>
          {t('landing.problemsTitle')}
        </Title>
        <Text c="dimmed" ta="center" size="lg" mb={50} maw={800} mx="auto">
          {t('landing.problemsSubtitle')}
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
          <FeatureCard
            icon={IconMapPinOff}
            title={t('landing.p1Title')}
            description={t('landing.p1Desc')}
          />
          <FeatureCard
            icon={IconCertificateOff}
            title={t('landing.p2Title')}
            description={t('landing.p2Desc')}
          />
          <FeatureCard
            icon={IconScreenShareOff}
            title={t('landing.p3Title')}
            description={t('landing.p3Desc')}
          />
        </SimpleGrid>
      </Container>

      {/* How It Works */}
      <Container fluid px={{ base: 'md', md: 'xl', xl: 120 }} py={60} style={{ scrollMarginTop: '40px' }} id="HowItWorks">
        <Title order={2} ta="center" mb="sm" fz={{ base: 32, md: 44 }} fw={800}>
          {t('landing.howItWorksTitle')}
        </Title>
        <Text c="dimmed" ta="center" size="lg" mb={50} maw={800} mx="auto">
          {t('landing.howItWorksSubtitle', 'Ide írhatsz egy kiegészítő mondatot a szekcióhoz.')}
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
          <FeatureCard
            icon={IconScreenShare}
            title={t('landing.s1Title')}
            description={t('landing.s1Desc')}
          />
          <FeatureCard
            icon={IconClockShield}
            title={t('landing.s2Title')}
            description={t('landing.s2Desc')}
          />
          <FeatureCard
            icon={IconAi}
            title={t('landing.s3Title')}
            description={t('landing.s3Desc')}
          />
          <FeatureCard
            icon={IconRotate3d}
            title={t('landing.s4Title')}
            description={t('landing.s4Desc')}
          />
        </SimpleGrid>
      </Container>

      {/* Technology */}
      <Container fluid px={{ base: 'md', md: 'xl', xl: 120 }} py={60} id="Technology">
        <Title order={2} ta="center" mb="sm" fz={{ base: 32, md: 44 }} fw={800}>
          {t('landing.techTitle')}
        </Title>
        <Text c="dimmed" ta="center" size="lg" mb={50} maw={800} mx="auto">
          {t('landing.techSubtitle', 'Ide írhatsz egy kiegészítő mondatot a szekcióhoz.')}
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
          <FeatureCard
            icon={IconReportAnalytics}
            title={t('landing.t1Title')}
            description={t('landing.t1Desc')}
          />
          <FeatureCard
            icon={IconPhotoSensor3}
            title={t('landing.t2Title')}
            description={t('landing.t2Desc')}
          />
          <FeatureCard
            icon={IconMicroscope}
            title={t('landing.t3Title')}
            description={t('landing.t3Desc')}
          />
          <FeatureCard
            icon={IconBrightnessAuto}
            title={t('landing.t4Title')}
            description={t('landing.t4Desc')}
          />
        </SimpleGrid>
      </Container>

      {/* Partners */}
      <Container fluid px={{ base: 'md', md: 'xl', xl: 120 }} py={60} style={{ scrollMarginTop: '40px' }} id="Partners">
        <Title order={2} ta="center" mb="sm" fz={{ base: 32, md: 44 }} fw={800}>
          {t('partners.title')}
        </Title>
        <Text c="dimmed" ta="center" size="lg" mb={50} maw={800} mx="auto">
          {t('partners.subtitle')}
        </Text>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <FeatureCard
              icon={IconSchool}
              title={t('partners.p1Title')}
              description={t('partners.p1Desc')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <FeatureCard
              icon={IconDeviceTabletCode}
              title={t('partners.p2Title')}
              description={t('partners.p2Desc')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <FeatureCard
              icon={IconSettingsAi}
              title={t('partners.p3Title')}
              description={t('partners.p3Desc')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <FeatureCard
              icon={IconReportAnalytics}
              title={t('partners.p4Title')}
              description={t('partners.p4Desc')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <FeatureCard
              icon={IconHeartHandshake}
              title={t('partners.p5Title')}
              description={t('partners.p5Desc')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <FeatureCard
              icon={IconNetwork}
              title={t('partners.p6Title')}
              description={t('partners.p6Desc')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }} offset={{ lg: 4 }}>
            <FeatureCard
              icon={IconDeviceDesktopCode}
              title={t('partners.p7Title')}
              description={t('partners.p7Desc')}
            />
          </Grid.Col>
        </Grid>
      </Container>

      {/* About Us */}
      <Container fluid px={{ base: 'md', md: 'xl', xl: 120 }} py={60} style={{ scrollMarginTop: '40px' }} id="About">
        <Title order={2} ta="center" mb="sm" fz={{ base: 32, md: 44 }} fw={800}>
          {t('about.title')}
        </Title>
        <Text c="dimmed" ta="center" size="lg" mb={50} maw={800} mx="auto">
          {t('about.subtitle')}
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
          <FeatureCard
            icon={IconAward}
            title={t('about.a1Title')}
            description={t('about.a1Desc')}
            href={t('about.a1Link')}
          />
          <FeatureCard
            icon={IconAward}
            title={t('about.a2Title')}
            description={t('about.a2Desc')}
            href={t('about.a2Link')}
          />
          <FeatureCard
            icon={IconAward}
            title={t('about.a3Title')}
            description={t('about.a3Desc')}
            href={t('about.a3Link')}
          />
        </SimpleGrid>
      </Container>

      {/* Development Status */}
      <Container fluid px={{ base: 'md', md: 'xl', xl: 120 }} py={60} style={{ scrollMarginTop: '40px' }} id="Development">
        <Title order={2} ta="center" mb="sm" fz={{ base: 32, md: 44 }} fw={800}>
          {t('dev.title')}
        </Title>
        <Text c="dimmed" ta="center" size="lg" mb={50} maw={800} mx="auto">
          {t('dev.desc')}
        </Text>

        <Box ta="center">
          <Text size="xl" fw={700} mb="md">{t('dev.trlLevel')}</Text>
          <Text c="dimmed" mb="lg">{t('dev.trlDesc')}</Text>
          <Progress value={67} color="teal" size="xl" radius="xl" mb="md" />
          <Text size="sm" c="dimmed">{t('dev.trlProgress')}</Text>
        </Box>
      </Container>
    </>
  );
}

// Segédkomponens a szolgáltatások bemutatásához
function FeatureCard({ icon: Icon, title, description, href }: { icon: any; title: string; description: string; href?: string }) {
  const cardContent = (
    <>
      <ThemeIcon size="xl" radius="md" variant="light" color="teal">
        <Icon size={28} stroke={1.5} />
      </ThemeIcon>
      <Text mt="md" fw={700} fz="lg">{title}</Text>
      <Text mt="sm" c="dimmed" lh={1.6}>{description}</Text>
    </>
  );

  if (href) {
    return (
      <Card
        padding="lg"
        radius="md"
        withBorder
        h="100%"
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="feature-card-link"
      >
        {cardContent}
      </Card>
    );
  }

  return (
    <Card padding="lg" radius="md" withBorder h="100%" className="feature-card">
      {cardContent}
    </Card>
  );
}
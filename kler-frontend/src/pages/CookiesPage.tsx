import { Container, Title, Text, Paper, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';

// Süti tájékoztató oldal
export default function CookiesPage() {
  const { t } = useTranslation();

  return (
    <Container size="md" py={0} style={{ minHeight: '80vh' }}>
      <Title order={1} mb="xl" ta="center">{t('cookies.title')}</Title>

      <Paper withBorder p={{ base: 'md', sm: 'xl' }} radius="md" shadow="sm">
        <Stack gap="xl">
          <div>
            <Title order={3} mb="xs">{t('cookies.p1Title')}</Title>
            <Text c="dimmed" lh={1.6}>{t('cookies.p1Desc')}</Text>
          </div>
          <div>
            <Title order={3} mb="xs">{t('cookies.p2Title')}</Title>
            <Text c="dimmed" lh={1.6}>{t('cookies.p2Desc')}</Text>
          </div>
          <div>
            <Title order={3} mb="xs">{t('cookies.p3Title')}</Title>
            <Text c="dimmed" lh={1.6}>{t('cookies.p3Desc')}</Text>
          </div>
        </Stack>
      </Paper>
    </Container>
  );
}

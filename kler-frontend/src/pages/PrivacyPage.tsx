import { Container, Title, Text, Paper, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';

// Adatvédelmi tájékoztató oldal
export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <Container size="md" py={0} style={{ minHeight: '80vh' }}>
      <Title order={1} mb="xl" ta="center">{t('privacy.title')}</Title>

      <Paper withBorder p={{ base: 'md', sm: 'xl' }} radius="md" shadow="sm">
        <Stack gap="xl">
          <div>
            <Title order={3} mb="xs">{t('privacy.p1Title')}</Title>
            <Text c="dimmed" lh={1.6}>{t('privacy.p1Desc')}</Text>
          </div>
          <div>
            <Title order={3} mb="xs">{t('privacy.p2Title')}</Title>
            <Text c="dimmed" lh={1.6}>{t('privacy.p2Desc')}</Text>
          </div>
          <div>
            <Title order={3} mb="xs">{t('privacy.p3Title')}</Title>
            <Text c="dimmed" lh={1.6}>{t('privacy.p3Desc')}</Text>
          </div>
          <div>
            <Title order={3} mb="xs">{t('privacy.p4Title')}</Title>
            <Text c="dimmed" lh={1.6}>{t('privacy.p4Desc')}</Text>
          </div>
        </Stack>
      </Paper>
    </Container>
  );
}

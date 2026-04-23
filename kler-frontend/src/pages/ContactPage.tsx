import { Container, Title, Text, Paper, Group, Stack, ThemeIcon, SimpleGrid, Card, Avatar } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconMail, IconMapPin } from '@tabler/icons-react';

//Kapcsolatok oldal
export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <Container size="md" py={0} style={{ minHeight: '80vh' }}>
      <Title order={1} mb="xl" ta="center">{t('contact.title')}</Title>
      <Text ta="center" size="lg" c="dimmed" mb={50} maw={600} mx="auto">
        {t('contact.description')}
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" mb={40}>
        {/* Első fejlesztő kártyája */}
        <Card withBorder padding="xl" radius="md">
          <Group wrap="nowrap" mb="lg">
            {/* Csongor Kép */}
            <Avatar src="/img/kertesicsongor.png" size={80} radius="md" color="teal" style={{ border: '2px solid var(--mantine-color-teal-8)' }} />
            <div>
              <Text fz="xl" fw={700}>{t('contact.f1Name')}</Text>
              <Text fz="sm" c="dimmed">{t('contact.f1Role')}</Text>
            </div>
          </Group>
          <Group wrap="nowrap" mt="md">
            <ThemeIcon size={34} radius="md" variant="light" color="teal">
              <IconMail size={18} />
            </ThemeIcon>
            <Text size="sm" fw={500}>{t('contact.f1Email')}</Text>
          </Group>
        </Card>

        {/* Második fejlesztő kártyája */}
        <Card withBorder padding="xl" radius="md">
          <Group wrap="nowrap" mb="lg">
            {/* Martin Kép */}
            <Avatar src="/img/simonmartin.png" size={80} radius="md" color="teal" style={{ border: '2px solid var(--mantine-color-teal-8)' }} />
            <div>
              <Text fz="xl" fw={700}>{t('contact.f2Name')}</Text>
              <Text fz="sm" c="dimmed">{t('contact.f2Role')}</Text>
            </div>
          </Group>
          <Group wrap="nowrap" mt="md">
            <ThemeIcon size={34} radius="md" variant="light" color="teal">
              <IconMail size={18} />
            </ThemeIcon>
            <Text size="sm" fw={500}>{t('contact.f2Email')}</Text>
          </Group>
        </Card>
      </SimpleGrid>

      <Paper withBorder p="xl" radius="md" shadow="sm">
        <Title order={3} mb="xl">{t('contact.infoTitle')}</Title>
        <Stack gap="lg" mb={20}>
          <Group wrap="nowrap">
            <ThemeIcon size={46} radius="md" variant="light" color="teal">
              <IconMapPin size={24} />
            </ThemeIcon>
            <div>
              <Text size="sm" c="dimmed">{t('contact.addressTitle', 'Székhely')}</Text>
              <Text size="lg" fw={500}>{t('contact.address')}</Text>
            </div>
          </Group>
        </Stack>
        <Text c="dimmed" size="sm" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }} pt="md">
          {t('contact.support')}
        </Text>
      </Paper>
    </Container>
  );
}

import { Container, Group, ActionIcon, Text, Box } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function Footer() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Box component="footer" py="xl" mt={100} style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
            <Container size="lg">
                <Group justify="space-between" align="center">
                    {/* Footer bal oldala */}
                    <Group gap={5}>
                        <Text fw={700} size="lg" c="teal">KLER</Text>
                        <Text size="xs" c="dimmed">{t('footer.rights')}</Text>
                    </Group>

                    {/* Footer közepe gombokkal */}
                    <Group gap="lg" visibleFrom="xs">
                        <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }} onClick={() => { navigate('/contact'); window.scrollTo(0, 0); }}>{t('footer.contact')}</Text>
                        <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }} onClick={() => { navigate('/privacy'); window.scrollTo(0, 0); }}>{t('footer.privacy')}</Text>
                        <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }} onClick={() => { navigate('/cookies'); window.scrollTo(0, 0); }}>{t('footer.cookies')}</Text>
                    </Group>

                    {/* Footer jobb oldala hivatkozásokkal */}
                    <Group gap="xs" justify="flex-end" wrap="nowrap">
                        <ActionIcon size="lg" variant="default" radius="xl" onClick={() => window.open('https://twitter.com/', '_blank')}>
                            <IconBrandTwitter size={18} stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon size="lg" variant="default" radius="xl" onClick={() => window.open('https://youtube.com/', '_blank')}>
                            <IconBrandYoutube size={18} stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon size="lg" variant="default" radius="xl" onClick={() => window.open('https://instagram.com/', '_blank')}>
                            <IconBrandInstagram size={18} stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Container>
        </Box>
    );
}
import { Container, Paper, Tabs, Title, Text, Divider, Box, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { AuthForm } from '../components/AuthForm';
import { login, register } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { AuthFormValues } from '../types/types';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function AuthPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string | null>('login');
    const [authError, setAuthError] = useState<string | null>(null);

    const handleTabChange = (val: string | null) => {
        setActiveTab(val);
        setAuthError(null);
    };

    // Ha admin akkor admin dashboardra, egyébként air quality dashboardra navigálunk
    const handleLogin = async (values: AuthFormValues) => {
        try {
            setAuthError(null);
            const res: any = await login({ email: values.email, password: values.password });
            if (res.access_token) {
                localStorage.setItem('token', res.access_token);
                try {
                    const decoded: any = jwtDecode(res.access_token);
                    if (decoded.role === 'ADMIN') {
                        navigate('/admin-dashboard');
                    } else {
                        navigate('/air-quality');
                    }
                } catch (e) {
                    navigate('/air-quality');
                }
            }
        } catch (error: any) {
            console.error('Login failed:', error);
            const message = t('auth.loginFailed');
            setAuthError(message);
            window.alert(message);
        }
    };

    // Regisztrációs logika
    const handleRegister = async (values: AuthFormValues) => {
        try {
            setAuthError(null);
            const res: any = await register(values);
            if (res.access_token) {
                localStorage.setItem('token', res.access_token);
                // Sikeres regisztráció után air-quality-ba navigálunk
                setTimeout(() => navigate('/air-quality'), 500);
            }
        } catch (error: any) {
            console.error('Registration failed:', error);
            const message = t('auth.registerFailed', 'Regisztráció sikertelen!');
            const fullMessage = message + ' ' + (error.message || '');
            setAuthError(fullMessage);
            window.alert(fullMessage);
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" fw={900}>
                {t('auth.welcome')}
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                {t('auth.loginToContinue')}
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                {authError && (
                    <Alert icon={<IconAlertCircle size={16} />} title={t('auth.error')} color="red" mb="md" variant="light">
                        {authError}
                    </Alert>
                )}

                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tabs.List grow>
                        <Tabs.Tab value="login">{t('auth.loginBtn')}</Tabs.Tab>
                        <Tabs.Tab value="register">{t('auth.registerBtn')}</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="login" pt="md">
                        <AuthForm key="login" type="login" onSubmit={handleLogin} />

                        <Divider label={t('auth.orContinueWith')} labelPosition="center" my="lg" />

                        <Box style={{ display: 'flex', justifyContent: 'center' }}>
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    if (credentialResponse.credential) {
                                        const decoded = jwtDecode(credentialResponse.credential);
                                        console.log('Google login sikeres:', decoded);
                                        setTimeout(() => navigate('/air-quality'), 500);
                                    }
                                }}
                                onError={() => {
                                    console.error('Hiba a Google bejelentkezés során');
                                    setAuthError('Hiba a Google bejelentkezés során');
                                }}
                            />
                        </Box>
                    </Tabs.Panel>

                    <Tabs.Panel value="register" pt="md">
                        <AuthForm key="register" type="register" onSubmit={handleRegister} />
                    </Tabs.Panel>
                </Tabs>
            </Paper>
        </Container>
    );
}

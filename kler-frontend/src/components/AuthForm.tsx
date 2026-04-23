import { TextInput, PasswordInput, Button, Group, Box, Stack, Checkbox, Alert } from '@mantine/core';
import { useState } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import type { AuthFormValues } from '../types/types';
import { useTranslation } from 'react-i18next';

// Interface a form hibák kezeléséhez
interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
}

// Email validáció regex függvény
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Regisztrációs űrlap validáció - hozzáadva a t: any paraméter
const validateRegister = (values: any, t: any): FormErrors => {
    const errors: FormErrors = {};

    // Felhasználónév validáció - Itt használjuk a t-t
    if (!values.username || values.username.length < 3) {
        errors.username = t('auth.nameError');
    }

    // Email validáció - marad az eredeti szöveged
    if (!values.email) {
        errors.email = t('auth.EmailRequired');
    } else if (!validateEmail(values.email)) {
        errors.email = t('auth.EmailInvalid');
    }

    // Jelszó validáció - marad az eredeti szöveged
    if (!values.password) {
        errors.password = t('auth.passwordRequired');
    } else if (values.password.length < 8) {
        errors.password = t('auth.passwordLength');
    } else if (!/[0-9]/.test(values.password)) {
        errors.password = t('auth.passwordNumber');
    }

    // Jelszó megerősítés validáció - marad az eredeti szöveged
    if (!values.confirmPassword) {
        errors.confirmPassword = t('auth.confirmPasswordRequired');
    } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = t('auth.passwordMismatch');
    }

    // Feltételek elfogadása validáció - marad az eredeti szöveged
    if (!values.terms) {
        errors.terms = t('auth.termsRequired');
    }

    return errors;
};

// Login vagy Regisztrációs űrlap komponens
interface AuthFormProps {
    type: 'login' | 'register';
    onSubmit: (values: AuthFormValues) => void;
}

export function AuthForm({ type, onSubmit }: AuthFormProps) {
    const { t } = useTranslation();
    const isRegister = type === 'register';
    const [values, setValues] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        terms: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (field: string, value: any) => {
        setValues(prev => ({ ...prev, [field]: value }));

        if (errors[field as keyof FormErrors]) {
            const newErrors = { ...errors };
            delete newErrors[field as keyof FormErrors];
            setErrors(newErrors);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isRegister) {
            const newErrors = validateRegister(values, t);
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
        } else {
            if (!values.email) {
                setErrors({ email: t('auth.loginEmailOrNameRequired') });
                return;
            }
            if (!values.password) {
                setErrors({ password: t('auth.passwordRequired') });
                return;
            }
        }

        onSubmit(values);
    };

    return (
        <Box maw={400} mx="auto">

            <form onSubmit={handleSubmit} noValidate>
                <Stack>
                    {isRegister && (
                        <TextInput
                            required
                            label= {t('auth.registerUsernameLabel')}
                            placeholder={t('auth.registerUsernamePlaceholder')}
                            error={errors.username}
                            value={values.username}
                            onChange={(e) => handleChange('username', e.currentTarget.value)}
                        />
                    )}

                    <TextInput
                        required
                        label={isRegister ? t('auth.registerEmailLabel') : t('auth.loginEmailLabel')}
                        placeholder={isRegister ? t('auth.registerEmailPlaceholder') : t('auth.loginEmailPlaceholder')}
                        error={errors.email}
                        value={values.email}
                        onChange={(e) => handleChange('email', e.currentTarget.value)}
                    />

                    <PasswordInput
                        required
                        label={isRegister ? t('auth.registerPasswordLabel1') : t('auth.loginPasswordLabel')}
                        placeholder={isRegister ? t('auth.registerPasswordPlaceholder1') : t('auth.loginPasswordPlaceholder')}
                        error={errors.password}
                        value={values.password}
                        onChange={(e) => handleChange('password', e.currentTarget.value)}
                    />

                    {isRegister && (
                        <PasswordInput
                            required
                            label={t('auth.registerPasswordLabel2')}
                            placeholder={t('auth.registerPasswordPlaceholder2')}

                            error={errors.confirmPassword}
                            value={values.confirmPassword}
                            onChange={(e) => handleChange('confirmPassword', e.currentTarget.value)}
                        />
                    )}

                    {isRegister && (
                        <Box>
                            <Checkbox
                                label={t('auth.registerAcceptTerms')}
                                checked={values.terms}
                                onChange={(e) => handleChange('terms', e.currentTarget.checked)}
                            />
                            {errors.terms && (
                                <Alert icon={<IconAlertCircle size={16} />} color="red" mt="xs">
                                    {errors.terms}
                                </Alert>
                            )}
                        </Box>
                    )}

                    <Group justify="flex-end" mt="md">
                        <Button type="submit" fullWidth>
                            {isRegister ? t('auth.registerBtn') : t('auth.loginBtn')}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Box>
    );
}
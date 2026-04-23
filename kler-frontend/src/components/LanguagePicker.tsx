import { Menu, Button, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconLanguage } from '@tabler/icons-react';

const languages = {
  //Magyar label
  hu: { label: 'Magyar' },
  //Angol label
  en: { label: 'English' },
  //Japán label
  ja: { label: '日本語' },
};

export function LanguagePicker() {
  const { i18n } = useTranslation();

  const langCode = i18n.language?.split('-')[0] || 'hu';
  const currentLang = Object.keys(languages).includes(langCode) ? langCode : 'hu';

  return (
    <Menu shadow="md" width={150}>
      <Menu.Target>
        <Button 
          variant="subtle" 
          leftSection={<IconLanguage size={18} />}
          px={{ base: 5, sm: 'md' }}
        >
          <Box visibleFrom="sm">
            {languages[currentLang as keyof typeof languages].label}
          </Box>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {Object.entries(languages).map(([code, { label }]) => (
          <Menu.Item
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            fw={langCode === code ? 700 : 400}
          >
            {label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

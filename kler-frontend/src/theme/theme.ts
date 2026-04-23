import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
    primaryColor: 'teal',
    shadows: {
        md: '1px 1px 3px rgba(0, 0, 0, .25)',
        xl: '5px 5px 3px rgba(0, 0, 0, .25)',
    },
    headings: {
        fontFamily: 'Inter, sans-serif',
    },
    spacing: {
        xs: rem(10),
        sm: rem(12),
        md: rem(16),
        lg: rem(20),
        xl: rem(32),
    },
    components: {
        Button: {
            defaultProps: {
                radius: 'md',
            },
        },
        Card: {
            defaultProps: {
                radius: 'md',
                padding: 'lg',
                withBorder: true,
            },
        },
    },
});

import { createTheme, ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#7C8D6B', // olive
            light: '#BBC6B4', // teal
            dark: '#5A664E', // darker olive
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#EFD7BB', // beige
            light: '#F7E8D6',
            dark: '#D9B990',
            contrastText: '#000000',
        },
        background: {
            default: '#FFFFFF',
            paper: '#F9F9F9',
        },
        text: {
            primary: '#000000',
            secondary: '#555555',
        },
        grey: {
            100: '#F5F5F5',
            200: '#EEEEEE',
            300: '#D9D9D9',
            500: '#9E9E9E',
            700: '#616161',
            900: '#212121',
        },
        error: {
            main: '#D32F2F',
        },
        warning: {
            main: '#FFA000',
        },
        info: {
            main: '#1976D2',
        },
        success: {
            main: '#388E3C',
        },
    },
    typography: {
        fontFamily: "'Inter', 'Ubuntu', sans-serif",
        h1: {
            fontFamily: "'Ubuntu', 'Inter', sans-serif",
            fontWeight: 700,
        },
        h2: {
            fontFamily: "'Ubuntu', 'Inter', sans-serif",
            fontWeight: 700,
        },
        h3: {
            fontFamily: "'Ubuntu', 'Inter', sans-serif",
            fontWeight: 600,
        },
        h4: {
            fontFamily: "'Ubuntu', 'Inter', sans-serif",
            fontWeight: 600,
        },
        h5: {
            fontFamily: "'Ubuntu', 'Inter', sans-serif",
            fontWeight: 500,
        },
        h6: {
            fontFamily: "'Ubuntu', 'Inter', sans-serif",
            fontWeight: 500,
        },
        button: {
            fontWeight: 500,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 16px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    },
                },
                containedPrimary: {
                    backgroundColor: '#7C8D6B',
                    '&:hover': {
                        backgroundColor: '#5A664E',
                    },
                },
                containedSecondary: {
                    backgroundColor: '#EFD7BB',
                    '&:hover': {
                        backgroundColor: '#D9B990',
                    },
                },
                outlined: {
                    borderWidth: '1.5px',
                    '&:hover': {
                        borderWidth: '1.5px',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                },
            },
        },
    },
});

export const ThemeProvider = ({ children }) => {
    return (
        <MUIThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MUIThemeProvider>
    );
};
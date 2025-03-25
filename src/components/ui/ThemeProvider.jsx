import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';

// Создаем контекст для переключения темы
const ColorModeContext = createContext({
    mode: 'light',
    toggleColorMode: () => {},
});

// Хук для использования цветовой темы
export const useColorMode = () => useContext(ColorModeContext);

// Компонент ThemeProvider
export const ThemeProvider = ({ children }) => {
    // Получаем сохраненное значение темы из localStorage или используем светлую тему по умолчанию
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('colorMode');
        return savedMode || 'light';
    });

    // Функция для переключения темы
    const toggleColorMode = () => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('colorMode', newMode);
            return newMode;
        });
    };

    // Создаем объект контекста
    const colorMode = useMemo(
        () => ({
            mode,
            toggleColorMode,
        }),
        [mode]
    );

    // Определяем темы для светлого и темного режимов
    const lightTheme = {
        palette: {
            mode: 'light',
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
            MuiPaginationItem: {
                styleOverrides: {
                    root: {
                        margin: '0 4px',
                    }
                }
            }
        },
    };

    const darkTheme = {
        palette: {
            mode: 'dark',
            primary: {
                main: '#8CA178', // lighter olive for dark mode
                light: '#A9B9A0', // lighter teal
                dark: '#717F62', // olive
                contrastText: '#FFFFFF',
            },
            secondary: {
                main: '#D9B990', // darker beige for contrast
                light: '#EFD7BB', // beige
                dark: '#C4A57E', // darker beige
                contrastText: '#000000',
            },
            background: {
                default: '#121212',
                paper: '#1E1E1E',
            },
            text: {
                primary: '#FFFFFF',
                secondary: '#AAAAAA',
            },
            grey: {
                100: '#292929',
                200: '#303030',
                300: '#404040',
                500: '#707070',
                700: '#B3B3B3',
                900: '#FAFAFA',
            },
            error: {
                main: '#F44336',
            },
            warning: {
                main: '#FFB74D',
            },
            info: {
                main: '#64B5F6',
            },
            success: {
                main: '#66BB6A',
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
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
                        },
                    },
                    containedPrimary: {
                        backgroundColor: '#8CA178',
                        '&:hover': {
                            backgroundColor: '#717F62',
                        },
                    },
                    containedSecondary: {
                        backgroundColor: '#D9B990',
                        '&:hover': {
                            backgroundColor: '#C4A57E',
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
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                },
            },
            // Исправленные стили для пагинации в темной теме
            MuiPagination: {
                styleOverrides: {
                    root: {
                        '& .MuiPaginationItem-root': {
                            color: '#FFFFFF',
                        },
                        '& .MuiPaginationItem-page.Mui-selected': {
                            backgroundColor: '#8CA178',
                            color: '#FFFFFF',
                        },
                    },
                },
            },
            MuiPaginationItem: {
                styleOverrides: {
                    root: {
                        margin: '0 4px',
                        '&.Mui-selected': {
                            backgroundColor: '#8CA178',
                            color: '#FFFFFF',
                        },
                        '&:hover': {
                            backgroundColor: 'rgba(140, 161, 120, 0.2)',
                        },
                        '&.MuiPaginationItem-ellipsis': {
                            color: '#AAAAAA',
                        },
                    }
                }
            }
        },
    };

    // Создаем тему на основе текущего режима
    const theme = useMemo(
        () => createTheme(mode === 'light' ? lightTheme : darkTheme),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ColorModeContext.Provider>
    );
};
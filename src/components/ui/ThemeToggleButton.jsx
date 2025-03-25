import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Иконка темной темы
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Иконка светлой темы
import { useColorMode } from './ThemeProvider';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const theme = useTheme();
    const colorMode = useColorMode();

    // Определяем, какую иконку показывать
    const isDarkMode = theme.palette.mode === 'dark';

    // Анимация для иконки
    const iconVariants = {
        initial: { rotate: 0, scale: 0.8 },
        animate: { rotate: isDarkMode ? 360 : 0, scale: 1 },
        exit: { rotate: 0, scale: 0.8 },
        transition: { duration: 0.5 }
    };

    return (
        <Tooltip title={isDarkMode ? "Переключиться на светлую тему" : "Переключиться на темную тему"}>
            <IconButton
                onClick={colorMode.toggleColorMode}
                color="inherit"
                aria-label="toggle theme"
                sx={{
                    borderRadius: '50%',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                        backgroundColor: isDarkMode
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.1)',
                    },
                }}
            >
                <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={iconVariants}
                >
                    {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </motion.div>
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggle;
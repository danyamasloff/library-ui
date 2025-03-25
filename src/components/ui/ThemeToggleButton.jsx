import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { motion } from 'framer-motion';
import { useColorMode } from './ThemeProvider';

const ThemeToggleButton = ({ sx = {} }) => {
    const theme = useTheme();
    const { mode, toggleColorMode } = useColorMode();

    return (
        <Tooltip title={mode === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}>
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95, rotate: 15 }}
            >
                <IconButton
                    onClick={toggleColorMode}
                    color="inherit"
                    aria-label="toggle theme"
                    sx={{
                        ...sx,
                        bgcolor: theme.palette.mode === 'light'
                            ? 'rgba(0, 0, 0, 0.04)'
                            : 'rgba(255, 255, 255, 0.08)',
                        '&:hover': {
                            bgcolor: theme.palette.mode === 'light'
                                ? 'rgba(0, 0, 0, 0.08)'
                                : 'rgba(255, 255, 255, 0.12)',
                        },
                    }}
                >
                    {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
            </motion.div>
        </Tooltip>
    );
};

export default ThemeToggleButton;
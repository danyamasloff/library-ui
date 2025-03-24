import React from 'react';
import { Box, Card, Paper } from '@mui/material';
import { motion } from 'framer-motion';

// Create animated versions of Material UI components
export const AnimatedBox = motion(Box);
export const AnimatedCard = motion(Card);
export const AnimatedPaper = motion(Paper);

// Animation variants
export const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

export const staggerItem = {
    hidden: {
        opacity: 0,
        y: 20
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        }
    },
};

export const pageTransition = {
    initial: {
        opacity: 0,
        x: -20
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: 'easeInOut',
        }
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: {
            duration: 0.3,
        }
    },
};
import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Paper, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useColorMode } from '../ui/ThemeProvider.jsx';

// Компонент для анимированного счетчика
const CountUp = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const increments = 50; // Количество шагов анимации
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };
    
    animationFrame = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return (
    <Typography variant="h3" fontWeight={700} color="primary.main">
      {prefix}{count.toLocaleString()}{suffix}
    </Typography>
  );
};

const LibraryStats = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Наблюдатель для запуска анимации при видимости элемента
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    
    const statsElement = document.getElementById('library-stats');
    if (statsElement) observer.observe(statsElement);
    
    return () => observer.disconnect();
  }, []);
  
  // Статистические данные
  const stats = [
    {
      icon: <LocalLibraryIcon fontSize="large" />,
      count: 25000,
      label: 'Книг в каталоге',
      delay: 0,
    },
    {
      icon: <PeopleAltIcon fontSize="large" />,
      count: 5800,
      label: 'Активных читателей',
      delay: 0.2,
    },
    {
      icon: <AutoStoriesIcon fontSize="large" />,
      count: 1200,
      label: 'Выдач в месяц',
      delay: 0.4,
    },
    {
      icon: <EmojiEventsIcon fontSize="large" />,
      count: 98,
      label: 'Процент удовлетворенности',
      suffix: '%',
      delay: 0.6,
    },
  ];
  
  return (
    <Box 
      id="library-stats"
      sx={{ 
        py: 8, 
        background: mode === 'light' 
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.secondary.light, 0.2)})`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)}, ${alpha(theme.palette.secondary.dark, 0.3)})`,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        my: 6
      }}
    >
      {/* Декоративные элементы */}
      <Box 
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: mode === 'light' 
            ? alpha(theme.palette.primary.main, 0.05)
            : alpha(theme.palette.primary.main, 0.03),
          zIndex: 0
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: mode === 'light' 
            ? alpha(theme.palette.secondary.main, 0.05)
            : alpha(theme.palette.secondary.main, 0.03),
          zIndex: 0
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          textAlign="center" 
          fontFamily="Ubuntu" 
          fontWeight={600}
          gutterBottom
          color="text.primary"
        >
          Наша библиотека в цифрах
        </Typography>
        <Typography 
          variant="subtitle1" 
          textAlign="center" 
          color="text.secondary" 
          sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}
        >
          Важная часть университетской жизни - доступ к актуальным знаниям и ресурсам для образования и исследований
        </Typography>
        
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: stat.delay, duration: 0.6 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    background: mode === 'light' 
                      ? 'rgba(255, 255, 255, 0.8)'
                      : alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(5px)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 70,
                      height: 70,
                      borderRadius: '50%',
                      bgcolor: mode === 'light' 
                        ? alpha(theme.palette.primary.main, 0.1)
                        : alpha(theme.palette.primary.main, 0.2),
                      color: 'primary.main',
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  
                  {isVisible && (
                    <CountUp 
                      end={stat.count} 
                      suffix={stat.suffix || ''} 
                      prefix={stat.prefix || ''} 
                    />
                  )}
                  
                  <Typography variant="h6" fontWeight={500} color="text.secondary" sx={{ mt: 1 }}>
                    {stat.label}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LibraryStats;
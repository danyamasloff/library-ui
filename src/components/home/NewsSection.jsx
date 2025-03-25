import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Chip,
  CardActions,
  useTheme,
  alpha,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import { useColorMode } from '../ui/ThemeProvider.jsx';

// Пример данных новостей
const sampleNews = [
  {
    id: 1,
    title: 'Новое поступление учебников по информационным технологиям',
    excerpt: 'В библиотеку поступила новая партия учебников по программированию, базам данных и компьютерным сетям от ведущих издательств',
    date: '20.03.2025',
    author: 'Администрация библиотеки',
    image: '/news/news1.jpg',
    category: 'Новые поступления'
  },
  {
    id: 2,
    title: 'Семинар по цифровым библиотечным ресурсам для студентов',
    excerpt: 'Приглашаем всех студентов на семинар, где будут представлены возможности использования электронных ресурсов библиотеки в учебе',
    date: '15.03.2025',
    author: 'Отдел образовательных программ',
    image: '/news/news2.jpg',
    category: 'События'
  },
  {
    id: 3,
    title: 'Изменение графика работы библиотеки в праздничные дни',
    excerpt: 'Обращаем ваше внимание на изменение графика работы библиотеки в связи с приближающимися праздниками',
    date: '10.03.2025',
    author: 'Администрация библиотеки',
    image: '/news/news3.jpg',
    category: 'Объявление'
  }
];

const NewsSection = ({ news = sampleNews }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useColorMode();
  
  // Варианты анимации для списка новостей
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const getCategoryColor = (category) => {
    const categories = {
      'Новые поступления': 'success',
      'События': 'primary',
      'Объявление': 'warning',
      'Исследования': 'info'
    };
    
    return categories[category] || 'default';
  };
  
  return (
    <Box 
      sx={{ 
        py: 6, 
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Декоративный фон */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: mode === 'light' 
            ? `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, rgba(255,255,255,0) 100%)`
            : `linear-gradient(180deg, ${alpha(theme.palette.primary.dark, 0.1)} 0%, rgba(0,0,0,0) 100%)`,
          zIndex: 0
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            fontFamily="Ubuntu" 
            fontWeight={600}
            gutterBottom
          >
            Новости и события
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            Актуальная информация о работе библиотеки, новых поступлениях и предстоящих мероприятиях
          </Typography>
        </Box>
        
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Grid container spacing={4}>
            {news.map((item, index) => (
              <Grid item xs={12} md={4} key={item.id}>
                <motion.div variants={item}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      boxShadow: mode === 'light' ? 2 : 1,
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 8
                      }
                    }}
                  >
                    {/* Заглушка для изображения */}
                    <Box
                      sx={{
                        height: 200,
                        backgroundColor: mode === 'light' 
                          ? alpha(theme.palette.primary.light, 0.1 + (index * 0.1))
                          : alpha(theme.palette.primary.dark, 0.2 + (index * 0.1)),
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}
                    >
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 700, 
                          opacity: 0.1, 
                          color: theme.palette.primary.main,
                          transform: 'rotate(-5deg)'
                        }}
                      >
                        ИУЦТ
                      </Typography>
                      
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          zIndex: 1
                        }}
                      >
                        <Chip 
                          label={item.category} 
                          color={getCategoryColor(item.category)}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.3,
                          minHeight: '2.6em'
                        }}
                      >
                        {item.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        paragraph
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '4.5em'
                        }}
                      >
                        {item.excerpt}
                      </Typography>
                      
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          mt: 2,
                          pt: 2,
                          borderTop: 1,
                          borderColor: mode === 'light' ? 'grey.200' : 'grey.800'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarTodayIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="caption" color="text.secondary">
                            {item.date}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: 120
                            }}
                          >
                            {item.author}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        fullWidth
                        onClick={() => navigate(`/news/${item.id}`)}
                      >
                        Читать далее
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/news')}
            sx={{ px: 4, py: 1 }}
          >
            Все новости
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NewsSection;
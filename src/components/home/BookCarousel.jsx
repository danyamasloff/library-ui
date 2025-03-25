import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  IconButton, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  CardActions, 
  Chip,
  useTheme,
  alpha,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useColorMode } from '../ui/ThemeProvider.jsx';

// Пример данных для карусели
const sampleBooks = [
  {
    id: 1,
    title: 'Техническое обеспечение информационных систем',
    author: 'Иванов А.В.',
    genre: 'Учебное пособие',
    available: true,
    coverImage: '/book-covers/book1.jpg',
    year: 2023,
    pages: 320,
  },
  {
    id: 2,
    title: 'Цифровизация транспортных систем',
    author: 'Петров С.Н.',
    genre: 'Монография',
    available: true,
    coverImage: '/book-covers/book2.jpg',
    year: 2022,
    pages: 280,
  },
  {
    id: 3,
    title: 'Управление проектами в IT',
    author: 'Сидоров И.И.',
    genre: 'Учебник',
    available: false,
    coverImage: '/book-covers/book3.jpg',
    year: 2021,
    pages: 350,
  },
  {
    id: 4,
    title: 'Анализ данных в информационных системах',
    author: 'Козлов Д.М.',
    genre: 'Практикум',
    available: true,
    coverImage: '/book-covers/book4.jpg',
    year: 2022,
    pages: 240,
  },
  {
    id: 5,
    title: 'Основы программирования на Python',
    author: 'Смирнова А.Д.',
    genre: 'Учебное пособие',
    available: true,
    coverImage: '/book-covers/book5.jpg',
    year: 2023,
    pages: 310,
  },
  {
    id: 6,
    title: 'Методы искусственного интеллекта',
    author: 'Федоров К.А.',
    genre: 'Монография',
    available: true,
    coverImage: '/book-covers/book6.jpg',
    year: 2022,
    pages: 420,
  },
];

const BookCarousel = ({ title, subtitle, books = sampleBooks }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useColorMode();
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);

  // Динамически определяем количество видимых элементов в зависимости от размера экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setVisibleItems(1);
      } else if (window.innerWidth < 960) {
        setVisibleItems(2);
      } else {
        setVisibleItems(3);
      }
    };

    handleResize(); // Инициализация при первой загрузке
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      prevIndex + visibleItems >= books.length ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, books.length - visibleItems) : prevIndex - 1
    );
  };

  // Выбираем книги для отображения в зависимости от активного индекса
  const displayedBooks = books.slice(activeIndex, activeIndex + visibleItems);
  // Если книг недостаточно, добавляем из начала массива
  if (displayedBooks.length < visibleItems) {
    displayedBooks.push(...books.slice(0, visibleItems - displayedBooks.length));
  }

  // Расчет индикаторов страниц
  const totalPages = Math.ceil(books.length / visibleItems);
  const currentPage = Math.floor(activeIndex / visibleItems) + 1;

  return (
    <Paper 
      elevation={0}
      sx={{ 
        position: 'relative',
        py: 4,
        px: { xs: 2, md: 3 },
        borderRadius: 3,
        backgroundColor: mode === 'light' 
          ? alpha(theme.palette.primary.light, 0.1)
          : alpha(theme.palette.primary.dark, 0.1),
        backdropFilter: 'blur(5px)',
        overflow: 'hidden',
        mb: 6
      }}
    >
      {/* Decorative elements */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: mode === 'light' 
            ? alpha(theme.palette.primary.light, 0.2)
            : alpha(theme.palette.primary.dark, 0.2),
          zIndex: 0
        }} 
      />
      <Box 
        sx={{ 
          position: 'absolute',
          bottom: -30,
          right: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: mode === 'light' 
            ? alpha(theme.palette.secondary.light, 0.2)
            : alpha(theme.palette.secondary.dark, 0.2),
          zIndex: 0
        }} 
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              fontFamily="Ubuntu" 
              fontWeight={600}
              color="text.primary"
            >
              {title || "Новые поступления"}
            </Typography>
            {subtitle && (
              <Typography variant="body1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              {currentPage} / {totalPages}
            </Typography>
            <IconButton 
              onClick={handlePrev} 
              sx={{ 
                bgcolor: mode === 'light' ? 'white' : 'background.paper',
                boxShadow: 1,
                mr: 1,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton 
              onClick={handleNext}
              sx={{ 
                bgcolor: mode === 'light' ? 'white' : 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        {/* Carousel */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 3,
            overflowX: 'hidden',
            py: 1,
            px: 0.5
          }}
        >
          {displayedBooks.map((book, index) => (
            <motion.div
              key={`${book.id}-${index}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ 
                flex: `0 0 calc(${100 / visibleItems}% - ${(visibleItems - 1) * 24 / visibleItems}px)`,
                maxWidth: `calc(${100 / visibleItems}% - ${(visibleItems - 1) * 24 / visibleItems}px)`
              }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  },
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    pt: '56.25%', // 16:9 aspect ratio
                    position: 'relative',
                    bgcolor: mode === 'light' ? 'grey.200' : 'grey.800',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      p: 1,
                      zIndex: 1
                    }}
                  >
                    <Chip
                      label={book.available ? "Доступна" : "Недоступна"}
                      color={book.available ? "success" : "error"}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>

                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center'
                    }}
                  >
                    <MenuBookIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.7 }} />
                  </Box>
                </CardMedia>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom 
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.3,
                      height: '2.6em'
                    }}
                  >
                    {book.title}
                  </Typography>
                  
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {book.author}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {book.year} г.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {book.pages} стр.
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="primary"
                    onClick={() => navigate(`/books/${book.id}`)}
                  >
                    Подробнее
                  </Button>
                  
                  {book.available && (
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      startIcon={<BookmarkIcon />}
                      onClick={() => alert(`Забронирована книга: ${book.title}`)}
                    >
                      Забронировать
                    </Button>
                  )}
                </CardActions>
              </Card>
            </motion.div>
          ))}
        </Box>
        
        {/* View all button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => navigate('/catalog')}
            sx={{ 
              px: 4,
              borderRadius: 20,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            Смотреть все книги
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default BookCarousel;
import React from 'react';
import { Grid, Typography, Box, Pagination, CircularProgress, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import BookCard from './BookCard';

const BookList = ({ books, loading, error, page, totalPages, onPageChange, onReserveBook }) => {
    // Анимация для контейнера книг
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    // Анимация для каждой книги
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 80,
                damping: 15,
            },
        },
    };

    // Если загрузка
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    // Если ошибка
    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 4 }}>
                {error}
            </Alert>
        );
    }

    // Если нет книг
    if (!books || books.length === 0) {
        return (
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Книги не найдены
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Попробуйте изменить параметры поиска
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Grid container spacing={3}>
                    <AnimatePresence>
                        {books.map((book) => (
                            <Grid item xs={12} sm={6} md={4} key={book.bookId || book.id}>
                                <motion.div variants={itemVariants}>
                                    <BookCard book={book} onReserve={onReserveBook} />
                                </motion.div>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            </motion.div>

            {/* Пагинация */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={onPageChange}
                        color="primary"
                        size="large"
                    />
                </Box>
            )}
        </>
    );
};

export default BookList;
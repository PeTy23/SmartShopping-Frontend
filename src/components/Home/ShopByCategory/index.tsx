import { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid'; // Folosim varianta modernă de Grid
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { categoriesApi } from '../../../api/clients/CategoryApiClient'; // Ajustează calea dacă e nevoie
import type { Category } from '../../shared/types/Category';
import './ShopByCategory.css';

function ShopByCategory() {
    const navigate = useNavigate();
    const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Preluăm categoriile din baza de date
        categoriesApi.getAll()
            .then((data) => {
                // Luăm doar primele 3 categorii pentru designul de pe Homepage
                setFeaturedCategories(data.slice(0, 3));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleCategoryClick = (categoryName: string) => {
        // Navigăm către shop și transmitem categoria selectată prin URL
        navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress sx={{ color: '#D4AF37' }} />
            </Box>
        );
    }

    return (
        <Box className="category-section-container">
            {/* Zona de Titlu și Butonul View All */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
                <Box>
                    <Typography variant="h3" className="category-section-title">
                        Shop by Category
                    </Typography>
                    <Typography variant="body1" className="category-section-subtitle">
                        Explore our thoughtfully organized collections.
                    </Typography>
                </Box>
                <Button 
                    variant="text" 
                    endIcon={<ArrowForwardIcon />} 
                    className="view-all-btn"
                    onClick={() => navigate('/shop')}
                >
                    View all
                </Button>
            </Box>

            {/* Grid-ul cu cele 3 Carduri Mari */}
            <Grid container spacing={4}>
                {featuredCategories.map((category) => (
                    <Grid size={{ xs: 12, md: 4 }} key={category.id}>
                        <Box 
                            className="category-card" 
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            {/* Imaginea descărcată din backend */}
                            <Box 
                                component="img" 
                                src={category.imageUrl} 
                                alt={category.name}
                                className="category-image"
                            />
                            {/* Gradientul deasupra pozei pentru lizibilitatea textului */}
                            <Box className="category-overlay"></Box>
                            
                            <Typography className="category-name">
                                {category.name}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ShopByCategory;
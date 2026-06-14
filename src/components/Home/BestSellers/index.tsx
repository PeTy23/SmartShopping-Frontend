import { useEffect, useState } from 'react';
import { Box, Typography, Button, Rating, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid'; // Folosim varianta modernă de Grid dacă este disponibilă, altfel din @mui/material
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { productsApi } from '../../../api/clients/ProductApiClient';
import type { Product } from '../../shared/types/Product'; // Ajustează calea dacă e diferită
import { useCart } from '../../../context/CartContext/cart-context';
import './Bestsellers.css';

function Bestsellers() {
    const [topProducts, setTopProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();

    useEffect(() => {
        productsApi.getAll()
            .then((data) => {
                // Ordonăm după rating (cele mai bune primele) și luăm doar 4
                const sortedProducts = data.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
                setTopProducts(sortedProducts.slice(0, 4));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress sx={{ color: '#D4AF37' }} />
            </Box>
        );
    }

    return (
        <Box className="bestsellers-container">
            <Typography variant="h3" className="bestsellers-title">
                Curated for You
            </Typography>
            <Typography variant="body1" className="bestsellers-subtitle">
                Our most coveted pieces, chosen by our community.
            </Typography>

            <Grid container spacing={4} sx={{ mt: 4 }}>
                {topProducts.map((product) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                        <Box className="product-card">
                            {/* Zona imaginii cu efect la hover */}
                            <Box className="product-image-container">
                                <Box 
                                    component="img" 
                                    src={product.imageUrl} 
                                    alt={product.name}
                                    className="product-image"
                                />
                                <Box className="product-overlay">
                                    <Button 
                                        variant="contained" 
                                        className="quick-add-btn"
                                        startIcon={<ShoppingBagOutlinedIcon />}
                                        onClick={() => addItem(product.id, 1)}
                                        disabled={!product.isInStock}
                                    >
                                        {product.isInStock ? 'Quick Add' : 'Out of Stock'}
                                    </Button>
                                </Box>
                            </Box>

                            {/* Informațiile produsului */}
                            <Box className="product-info">
                                <Typography className="product-name">
                                    {product.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.5 }}>
                                    <Rating value={product.rating} precision={0.1} readOnly size="small" />
                                    <Typography variant="caption" color="text.secondary">
                                        ({product.rating})
                                    </Typography>
                                </Box>
                                <Typography className="product-price">
                                    {product.price.toFixed(2)} RON
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Bestsellers;
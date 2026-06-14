import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    TextField,
    Typography,
    Grid,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    Switch,
    Rating,
    Chip
} from "@mui/material";
import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from "react";
import { productsApi } from "../../api/clients/ProductApiClient";
import type { Product } from "../shared/types/Product";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import { useCart } from "../../context/CartContext/cart-context";

function Shop() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
    const [sortOrder, setSortOrder] = useState<string>("price_asc");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [onSaleOnly, setOnSaleOnly] = useState(false);
    const [minRating, setMinRating] = useState<number>(0);

    const { addItem } = useCart()

    const location = useLocation();

    // Acest useEffect "ascultă" bara de adrese
    useEffect(() => {
        // Extragem parametrii din URL
        const queryParams = new URLSearchParams(location.search);
        const categoryFromUrl = queryParams.get('category');

        // Dacă găsim o categorie în URL, o adăugăm automat în lista de bife
        if (categoryFromUrl) {
            setSelectedCategory([categoryFromUrl]); // Bifăm doar categoria selectată
        }
    }, [location.search]); // Se va rula de fiecare dată când se schimbă URL-ul

    const allCategories = useMemo(() => {
        const categoriesSet = new Set<string>();
        products.forEach(p => p.categories.forEach(cat => categoriesSet.add(cat)));
        return Array.from(categoriesSet).sort();
    }, [products]);


    const visibleProducts = useMemo(() => {
        let filtered = products.filter((products) => {
            const matchesSearch = products.name
                .toLowerCase()
                .includes(search.trim().toLowerCase());
            
            const matchesCategory = 
                selectedCategory.length === 0 ||
                // selectedCategory.every(cat => products.categories.includes(cat));
                products.categories.some(cat => selectedCategory.includes(cat));// depinde cum vreau implementarea, 
                // dacă vreau să arate doar produsele care au toate categoriile selectate sau măcar una din ele
            
            const matchesPrice = 
                products.price >= priceRange[0] && products.price <= priceRange[1];
            
            const matchesStock = !inStockOnly || products.isInStock; // Dacă inStockOnly e fals, ignoră regula. Dacă e true, verifică produsul.
            const matchesSale = !onSaleOnly || products.isOnSale;
            const matchesRating = products.rating >= minRating;

            return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesSale && matchesRating;
        });

        filtered.sort((a, b) => {
            if (sortOrder === "price_asc") return a.price - b.price;
            if (sortOrder === "price_desc") return b.price - a.price;
            if (sortOrder === "rating_desc") return b.rating - a.rating;
            if (sortOrder === "rating_asc") return a.rating - b.rating;
            return 0;
        });

        return filtered;
    }, [products, search, selectedCategory, priceRange, sortOrder, inStockOnly, onSaleOnly, minRating]);

    const handleAddToCart = async (product: Product) => {
        await addItem(product.id, 1)
    }

    const handleCategoryToggle = (category: string) => {
        setSelectedCategory((prev) => 
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handlePriceChange = (event: Event, newValue: number | number[]) => {
        setPriceRange(newValue as number[]);
    };


    function loadProducts() {
        productsApi
            .getAll()
            .then((data) => {
                console.log("Date primite:", data);
                setProducts(data);
                setError("");
            })
            .catch((err) => setError((err as Error).message))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {error !== "" && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h4">Shop</Typography>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                        value={sortOrder}
                        label="Sort by"
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <MenuItem value="price_asc">Price: Low to High</MenuItem>
                        <MenuItem value="price_desc">Price: High to Low</MenuItem>
                        <MenuItem value="rating_desc">Rating: High to Low</MenuItem>
                        <MenuItem value="rating_asc">Rating: Low to High</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <TextField
                label="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                sx={{ mb: 4 }}
            />
            
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={4}>
                    
                    {/* PARTEA STÂNGĂ: Sidebar cu Filtre */}
                    <Grid 
                        size={{ xs: 12, md: 3, lg: 3 }} 
                        sx={{ 
                            position: { md: 'sticky' },
                            top: { md: 24 },
                            alignSelf: 'start',
                            maxHeight: { md: 'calc(100vh - 48px)' }, // Nu depășește niciodată înălțimea ecranului
                            overflowY: 'auto', // Dacă e ecranul mic, face scroll doar bara de filtre
                            pr: 2, // Spațiu în dreapta pentru a nu suprapune scrollbar-ul peste text
                            pb: 2, // Spațiu jos
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Filters</Typography>
                            {/* Buton opțional de resetare filtre */}
                            <Button size="small" onClick={() => {
                                setSelectedCategory([]);
                                setInStockOnly(false);
                                setOnSaleOnly(false);
                                setMinRating(0);
                                setPriceRange([0, 10000]);
                                setSearch("");
                                setSortOrder("");
                            }}>
                                Clear
                            </Button>
                        </Box>
                        
                        <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary', display: 'block', mb: 1 }}>
                            Categories
                        </Typography>
                        {/* SECRETUL AICI: Cutie cu scroll intern doar pentru categorii */}
                        <Box sx={{ maxHeight: 220, overflowY: 'auto', mb: 1, pr: 1 }}>
                            <FormGroup sx={{ '& .MuiFormControlLabel-root': { mb: -1, pl: 0.65 } }}>
                                {allCategories.map((category) => (
                                    <FormControlLabel
                                        key={category}
                                        control={
                                            <Checkbox 
                                                size="small"
                                                checked={selectedCategory.includes(category)}
                                                onChange={() => handleCategoryToggle(category)}
                                                sx={{ padding: 0.5 }} // Reduce spațiul din jurul butonului
                                            />
                                        }
                                        label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{category}</Typography>}
                                    />
                                ))}
                            </FormGroup>
                        </Box>

                        <Divider sx={{ my: 1.5 }} />

                        <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary', display: 'block', mb: 1 }}>
                            Availability
                        </Typography>
                        <FormGroup sx={{ '& .MuiFormControlLabel-root': { mb: -0.5 } }}>
                            <FormControlLabel 
                                control={<Switch size="small" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />} 
                                label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>In Stock Only</Typography>} 
                            />
                            <FormControlLabel 
                                control={<Switch size="small" checked={onSaleOnly} onChange={(e) => setOnSaleOnly(e.target.checked)} />} 
                                label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Special Offers</Typography>} 
                            />
                        </FormGroup>

                        <Divider sx={{ my: 1.5 }} />

                        <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary', display: 'block', mb: 1 }}>
                            Minimum Rating
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                            <Rating 
                                value={minRating} 
                                onChange={(_event, newValue) => setMinRating(newValue || 0)} 
                                precision={0.5} 
                                size="small" 
                            />
                        </Box>

                        <Divider sx={{ my: 1.5 }} />

                        <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary', display: 'block', mb: 1 }}>
                            Price
                        </Typography>
                        <Box sx={{ px: 1, mt: 1 }}>
                            <Slider
                                size="small"
                                value={priceRange}
                                onChange={(_event, newValue) => setPriceRange(newValue as number[])}
                                valueLabelDisplay="auto"
                                min={0}
                                max={10000}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{priceRange[0]} RON</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{priceRange[1]} RON</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* PARTEA DREAPTĂ: Grid-ul de produse */}
                    <Grid size={{ xs: 12, md: 9, lg: 9 }}>
                        <Box 
                            sx={{
                                display: 'grid',
                                gap: 2,
                                flexGrow: 1,
                                alignContent: 'start',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))'
                            }}
                        >
                            {visibleProducts.map((product) => (
                                <Card key={product.id} sx={{display: 'flex', flexDirection: 'column'}}>
                                    {product.isOnSale && (
                                        <Chip 
                                            label="SALE!" 
                                            color="error" 
                                            size="small" 
                                            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, fontWeight: 'bold' }} 
                                        />
                                    )}
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={product.imageUrl}
                                        alt={product.name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" sx={{ lineHeight: 1.2, mb: 1 }}>{product.name}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Rating value={product.rating} readOnly size="small" precision={0.1} />
                                            <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                                                ({product.rating})
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                            {product.categoriesLabel}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {product.description}
                                        </Typography>
                                        <Typography variant="subtitle1" sx= {{ pt: 1, fontWeight: 'bold' }}>
                                            {product.priceLabel}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={<AddShoppingCartIcon />}
                                            onClick={() => handleAddToCart(product)}
                                            disabled={!product.isInStock}
                                        >
                                            {product.isInStock ? "Add to Cart" : "Out of Stock"}
                                        </Button>
                                    </CardActions>
                                </Card>
                            ))}
                            {visibleProducts.length === 0 && (
                                <Typography>No products found with the current filters.</Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}

export default Shop;
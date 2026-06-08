import { AppBar, Box, Toolbar, Typography, IconButton, ToggleButtonGroup, ToggleButton, Badge } from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';
import './NavBar.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useState } from "react";
import { useCart } from "../../context/CartContext/cart-context";

const iconColor = '#333333';

function NavBar() {
    const [mode, setMode] = useState<'user' | 'admin'>('user');
    const navigate = useNavigate();
    const {cart, openCart} = useCart();
    const handleModeChange = (event: React.MouseEvent<HTMLElement>, value: 'user' | 'admin') => {
        setMode(value);
        navigate('/'); // Reset to home on mode change
    };

  return (
        <AppBar position="sticky" color="default" className="mui-navbar"> 
            <Toolbar className="mui-toolbar"> 
                
                <Link to="/" className="logo-container">
                    
                    <img src={logo} alt="Smart Shopping Assistant Logo" className="logo-img" />
                    
                    <Typography className="logo-text">
                        NO NAME
                    </Typography>

                </Link>

                <Box className="mui-nav-links"> 
                    <NavLink to="/" className="nav-link">Home</NavLink>
                    {mode === 'admin' ? ( <>    
                        <NavLink to="/categories" className="nav-link">Categories</NavLink>
                        <NavLink to="/products" className="nav-link">Products</NavLink>
                        <NavLink to="/promotions" className="nav-link">Promotions</NavLink>
                        </>
                    ):(
                        <NavLink to="/shop" className="nav-link">Shop</NavLink>
                        

                    )}
                    {/* <NavLink to="/categories" className="nav-link">Categories</NavLink>
                    <NavLink to="/products" className="nav-link">Products</NavLink>
                    <NavLink to="/promotions" className="nav-link">Promotions</NavLink>
                    <NavLink to="/shop" className="nav-link">Shop</NavLink> */}
                </Box>
                
                <ToggleButtonGroup value={mode} exclusive size="small" onChange={handleModeChange} className="mode-toggle"> 
                    <ToggleButton value="user">User</ToggleButton>
                    <ToggleButton value="admin">Admin</ToggleButton>
                </ToggleButtonGroup>


                <Box className="mui-nav-icons"> 
                    <IconButton color="inherit"><SearchIcon sx={{ color: iconColor }} /></IconButton>
                    <IconButton color="inherit"><FavoriteBorderIcon sx={{ color: iconColor }} /></IconButton>
                    <IconButton color="inherit"><ShoppingBagOutlinedIcon sx={{ color: iconColor }} /></IconButton>
                </Box>
                
                {mode === 'user' && (
                <IconButton color="inherit" onClick={openCart}>
                    <Badge badgeContent={cart?.itemCount ?? 0} color="primary">
                    <ShoppingCartIcon />
                    </Badge>
                </IconButton>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;

import Box from '@mui/material/Box';
import './App.css'
import NavBar from './components/NavBar';
import {Route, Routes } from 'react-router-dom';
import Categories from './components/Categories';
import Home from './components/Home';
import Products from './components/Products';
import Promotions from './components/Promotions';
import NotFound from './components/NotFound';
import Shop from './components/shop';
import CartProvider from './context/CartContext/CartProvider';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <CartProvider> 
        <Box className="app">
          <NavBar />
          <Routes>  
            <Route path="/" element={<Home />}/>
            <Route path="/shop" element={<Shop />}/>
            <Route path="/products" element={<Products />}/>
            <Route path="/categories" element={<Categories />}/>
            <Route path="/promotions" element={<Promotions />}/>
            <Route path="*" element={<NotFound /> } />
          </Routes>
          <Footer />
          <CartDrawer />
      </Box>
    </CartProvider>
    
    </>
  );
}





export default App;


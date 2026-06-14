import { Box, Typography, IconButton, Divider, Grid } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import logo from '../../assets/logo.png';
import './Footer.css';

function Footer() {
    return (
        <Box component="footer" className="footer-wrapper">
            <Box className="footer-content">
                <Grid container spacing={6}>
                    {/* Coloana Stângă */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box className="footer-brand">
                            <img src={logo} alt="Logo" className="footer-logo-img" />
                            <Typography className="footer-logo-text">NO NAME</Typography>
                        </Box>
                        <Typography variant="body2" className="footer-brand-desc">
                            Considered design, exceptional materials, and a quiet kind of luxury — delivered to your door.
                        </Typography>
                        <Box className="social-icons">
                            <IconButton className="social-btn"><InstagramIcon fontSize="small" /></IconButton>
                            <IconButton className="social-btn"><TwitterIcon fontSize="small" /></IconButton>
                            <IconButton className="social-btn"><FacebookIcon fontSize="small" /></IconButton>
                            <IconButton className="social-btn"><YouTubeIcon fontSize="small" /></IconButton>
                        </Box>
                    </Grid>

                    {/* Coloanele din Dreapta */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 6, sm: 4 }}>
                                <Typography className="footer-list-title">SHOP</Typography>
                                <ul className="footer-list">
                                    <li><a href="#">All Products</a></li>
                                    <li><a href="#">Categories</a></li>
                                    <li><a href="#">Promotions</a></li>
                                    <li><a href="#">New Arrivals</a></li>
                                </ul>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 4 }}>
                                <Typography className="footer-list-title">SUPPORT</Typography>
                                <ul className="footer-list">
                                    <li><a href="#">Contact</a></li>
                                    <li><a href="#">FAQ</a></li>
                                    <li><a href="#">Shipping</a></li>
                                    <li><a href="#">Returns</a></li>
                                </ul>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 4 }}>
                                <Typography className="footer-list-title">COMPANY</Typography>
                                <ul className="footer-list">
                                    <li><a href="#">About</a></li>
                                    <li><a href="#">Careers</a></li>
                                    <li><a href="#">Press</a></li>
                                    <li><a href="#">Sustainability</a></li>
                                </ul>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            <Divider sx={{ mt: 6, mb: 3 }} />
            <Box sx={{ pb: 4, display: 'flex', justifyContent: 'center' }}>
                <Typography variant="caption" sx={{ color: '#999999' }}>
                    © {new Date().getFullYear()} NO NAME. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}

export default Footer;
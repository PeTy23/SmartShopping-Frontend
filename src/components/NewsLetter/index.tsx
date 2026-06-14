import { Box, Typography, Button, TextField, Grid } from '@mui/material';
import './Newsletter.css';

function Newsletter() {
    return (
        <Box className="newsletter-card">
            {/* alignItems mutat în sx, exact cum cere versiunea 6 */}
            <Grid container spacing={4} sx={{ alignItems: 'center' }}>
                {/* Folosim size în loc de item xs */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="overline" className="newsletter-kicker">
                        The Inner Circle
                    </Typography>
                    <Typography variant="h4" className="newsletter-title">
                        First access to drops, private events, and stories from the studio.
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box className="newsletter-form">
                        <TextField 
                            variant="outlined" 
                            placeholder="Your email address" 
                            size="small"
                            fullWidth
                            className="newsletter-input"
                        />
                        <Button variant="contained" className="newsletter-btn" disableElevation>
                            Subscribe
                        </Button>
                    </Box>
                    <Typography variant="caption" className="newsletter-spam-text">
                        No spam. Unsubscribe anytime.
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Newsletter;
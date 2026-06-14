import { Box, Typography, Button, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './Home.css';

function Home() {
  return (
    <Box className="home-hero">
      <Box className="hero-content">
        
        {/* 1. Insigna (Badge) */}
        <Box className="hero-badge">
          <span className="hero-dot"></span> SUMMER COLLECTION · 2026
        </Box>

        {/* 2. Titlul Principal */}
        <Typography variant="h1" className="hero-title">
          Quiet luxury, <br />
          <span className="highlight-text">delivered.</span>
        </Typography>

        {/* 3. Subtitlul */}
        <Typography variant="body1" className="hero-subtitle">
          A considered edit of objects, garments and tools — <br />
          chosen for the way they feel a decade from now.
        </Typography>

        {/* 4. Butoanele */}
        <Stack direction="row" spacing={2} className="hero-buttons">
          <Button 
            variant="contained" 
            className="btn-primary"
            endIcon={<ArrowForwardIcon />}
            disableElevation
          >
            Shop the collection
          </Button>
          <Button 
            variant="outlined" 
            className="btn-secondary"
            disableElevation
          >
            Explore categories
          </Button>
        </Stack>

        {/* 5. Statisticile */}
        <Stack direction="row" spacing={6} className="hero-stats">
          <Box>
            <Typography className="stat-number">200+</Typography>
            <Typography className="stat-label">Curated pieces</Typography>
          </Box>
          <Box>
            <Typography className="stat-number">48h</Typography>
            <Typography className="stat-label">Worldwide shipping</Typography>
          </Box>
          <Box>
            <Typography className="stat-number">10y</Typography>
            <Typography className="stat-label">Craft guarantee</Typography>
          </Box>
        </Stack>

      </Box>
    </Box>
  );
}

export default Home;
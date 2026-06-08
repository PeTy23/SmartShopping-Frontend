import { Box, Typography,Button } from "@mui/material";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Box sx={{display: 'flex', justifyContent: 'center',
         alignItems: 'center', height: '80vh',
         px:3, flexDirection: 'column', gap: 4
    }}>
    <Typography variant="h1" sx={{
        fontWeight:'bold',
        fontSize: {xs:'3rem', md:'7rem'},
    }}>
        404 Not Found
    </Typography>  
    <Button component={Link} to="/" variant="contained" size="large">
      Go to Home Page
    </Button>

    </Box>

  );
}

export default NotFound;
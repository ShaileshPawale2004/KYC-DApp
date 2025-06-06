import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import homeImage from '../Home.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '20px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.15)'
    }
  };

  const iconStyle = {
    width: 60,
    height: 60,
    backgroundColor: 'rgb(16, 137, 211)',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgb(18, 177, 209)',
      transform: 'scale(1.05)',
    },
    transition: 'all 0.3s ease-in-out',
  };



  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: '15px',
          mb: 5
        }}
      >
        <img 
          src={homeImage} 
          alt="KYC System" 
          style={{
            width: '490px',
            height: '300px',
            objectFit: 'contain',
            opacity: 1
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: '80px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={cardStyle}
          onClick={() => navigate('/customer')}
        >
          <IconButton sx={iconStyle} disableRipple>
            <PersonIcon sx={{ fontSize: 30 }} />
          </IconButton>
          <Typography variant="h5" color="primary">
            Customer
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Register & Manage KYC
          </Typography>
        </Box>

        <Box
          sx={cardStyle}
          onClick={() => navigate('/admin')}
        >
          <IconButton sx={iconStyle} disableRipple>
            <AdminPanelSettingsIcon sx={{ fontSize: 30 }} />
          </IconButton>
          <Typography variant="h5" color="primary">
            Admin
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Verify & Manage KYC
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;

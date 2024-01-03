import React from 'react';
import { Card, CardContent, Typography, Checkbox, Button, Box } from '@mui/material';
import HealingIcon from '@mui/icons-material/Healing'; // Temporary placeholder icon

const ServiceCard = ({ icon, title, price, services }) => {
  return (
    <Card sx={{ 
      maxWidth: 345, 
      m: 2, 
      borderColor: '#EEEEEE', 
      borderWidth: '1px', 
      borderStyle: 'solid',
      bgcolor: '#FFF' 
    }}>
      <CardContent>
        <Box sx={{ textAlign: 'center', my: 2 }}>
          {icon}
          <Typography 
            gutterBottom 
            variant="h5" 
            component="div" 
            sx={{ color: '#1976D2' }} 
          >
            {title}
          </Typography>
          <Typography variant="h6" sx={{ color: '#000000' }}> 
            {price} / Per Visit
          </Typography>
        </Box>
        {services.map((service, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <Checkbox 
              checked={service.checked} 
              disabled={true}
              sx={{
                color: '#5AB4FD', 
                '&.Mui-checked': {
                  color: '#1976D2', 
                },
              }}
            />
            <Typography variant="body1" sx={{ color: '#000000' }}> 
              {service.text}
            </Typography>
          </Box>
        ))}
        <Button 
          variant="contained" 
          size="large" 
          sx={{ 
            width: '100%', 
            mt: 3, 
            bgcolor: '#1976D2', 
            '&:hover': {
              bgcolor: '#5AB4FD', 
            },
          }}
        >
          Subscribe Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;

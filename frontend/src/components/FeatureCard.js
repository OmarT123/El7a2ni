import {useState} from 'react';
import { Card, CardContent, Typography, Avatar } from '@mui/material';

const FeatureCard = ({ icon : IconComponent, title, message }) => {
    const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <Card sx={{ border: 'none', maxWidth: 300, boxShadow: "none"}}>
      <CardContent sx={{ textAlign: 'center' }}>
      <Avatar
          sx={{
            width: 92,
            height: 92,
            backgroundColor: '#fff',
            margin: '0 auto',
            border: "1px solid #bbb",
            transition: 'background-color 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: 'primary.main',
            },
            }}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
        >
            {isHovered ? (
            <IconComponent style={{ fontSize: 36, fill: "#EEEEEE" }} />
          ) : (
            <IconComponent style={{ fontSize: 36}} color="primary" />
          )}
        </Avatar>
        <Typography variant="h5" component="div" mt={2} sx={{marginBottom:"15px"}}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ wordWrap: 'break-word' }}>
        {message}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;

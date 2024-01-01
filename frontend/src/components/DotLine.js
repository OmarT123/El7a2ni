import React from 'react';
import { Box } from '@mui/material';

const DotLine = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100px',
        justifyContent: 'center',
        paddingTop:"60px"
      }}
    >
      {[...Array(15)].map((_, index) => (
        <Box
          key={index}
          sx={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            marginX: '2px',
            backgroundColor:"#1976D2",
        }}
        />
      ))}
    </Box>
  );
};

export default DotLine;

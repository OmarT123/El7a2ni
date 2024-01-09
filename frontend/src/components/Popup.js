import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const Popup = ({ title, message, onClose, showButtons = true, content }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          padding: '20px',
          width: '80%', // Popup width relative to the viewport width
          maxWidth: '800px', // Maximum width of the popup
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            cursor: 'pointer',
          }}
          onClick={onClose}
        >
          &times;
        </Box>
        <Box
          sx={{
            borderBottom: '1px solid #ccc',
            paddingBottom: '10px',
            marginBottom: '20px',
            textAlign: 'center', // Centers the title text
          }}
        >
          <h2 style={{ color: '#4E4FEB', fontWeight: 'bold' }}>{title}</h2>
        </Box>
        {content && content.medicineReport && (
          <ul>
            {content.medicineReport.map((report, index) => (
              <li key={index}>
                <strong>Medicine:</strong> {report.medicine} |{' '}
                <strong>Total Quantity Sold:</strong> {report.totalQuantitySold} |{' '}
                <strong>Total Money Earned:</strong> {report.totalMoneyEarned}$
              </li>
            ))}
          </ul>
        )}
        {!content && <p>{message}</p>}
        {content && content.medicineReport.length === 0 && !message && <p>There were no sales in the selected month.</p>}
        {showButtons && <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <Button variant="outlined" onClick={onClose} sx={{ marginRight: '10px' }}>
            No, thanks
          </Button>
          <Button variant="contained" color="primary" onClick={onClose}>
            Yes, sure
          </Button>
        </Box>}
      </Box>
    </Box>
  );
};

export default Popup;
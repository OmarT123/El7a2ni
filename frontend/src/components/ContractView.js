import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const ContractView = ({ user, acceptContract, rejectContract }) => {
  return (
    <Container maxWidth="md">
      <Typography variant="h3">Employment Contract</Typography>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: user.contract }} className='contract' />
      <Button variant="contained" color="primary" onClick={acceptContract}>
        Accept
      </Button>
      <Button variant="contained" color="secondary" onClick={rejectContract}>
        Reject
      </Button>
    </Container>
  );
};

export default ContractView;

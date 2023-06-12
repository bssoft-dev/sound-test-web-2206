import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid } from '@mui/material';

export default function Loading({sx}) {
  return (
    <Grid container 
      justifyContent="center" alignItems="center"
      sx={[sx, {width: '100%', height: '100%', backgroundColor: '#ffffffa8'}]}>
      <CircularProgress color="info" />
    </Grid>
  );
}
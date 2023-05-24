import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import { Box, Grid, Typography } from "@mui/material";

import "./styles.css";


function IndexPage() {

  return (
    <Layout title="BS SOFT">
      <Grid container justifyContent="center" alignItems="center" sx={{height: '100%', paddingBottom: 50}}>
        <Typography variant="h3" color="text.secondary">
        TEST PAGE
        </Typography>
      </Grid>
    </Layout>
  );
}


export default IndexPage;

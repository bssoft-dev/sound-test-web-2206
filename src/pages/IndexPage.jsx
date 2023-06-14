import React, { useEffect, useState } from "react";
import { useCtx } from "../context/Context";
import Layout from "../components/Layout/Layout";
import { Box, Grid, Typography } from "@mui/material";

import "./styles.css";


function IndexPage() {
  const context = useCtx();  
  const { setTitle } = context;

  useEffect(() => {
      setTitle('비에스 소프트');
  }, []);

  return (
    <Layout>
      <Grid container justifyContent="center" alignItems="center" sx={{height: '100%', paddingBottom: 50}}>
        <Typography variant="h3" color="text.secondary">
        TEST PAGE
        </Typography>
      </Grid>
    </Layout>
  );
}


export default IndexPage;

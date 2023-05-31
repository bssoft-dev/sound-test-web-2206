import { Button, Grid, Typography } from "@mui/material";
import Layout from "../components/Layout/Layout";
import Microphone from "../components/Microphone/Microphone";
import { useCtx } from "../context/Context";
import { useEffect, useState } from "react";

export default function TestPage() {
  const context = useCtx();

  return (<Layout title="TestPage">
    <Grid container justifyContent="center" alignItems="center" sx={{height: '100%', paddingBottom: 50}}>
      <Microphone />
    </Grid>
  </Layout>)
}
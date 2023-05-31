import { Button, Grid, Typography } from "@mui/material";
import Layout from "../components/Layout/Layout";
import Alert from "../components/Alert/Alert";
import Microphone from "../components/Microphone/Microphone";
import { useCtx } from "../context/Context";

export default function TestPage() {
  const context = useCtx();
  
    return (<Layout title="TestPage">
    <Grid container justifyContent="center" alignItems="center" sx={{height: '100%', paddingBottom: 50}}>
    <Microphone />
    </Grid>
  </Layout>)
}
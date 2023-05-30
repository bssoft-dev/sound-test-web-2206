import { Grid, Typography } from "@mui/material";
import Layout from "../components/Layout/Layout";
import Alert from "../components/Alert/Alert";
import Microphone from "../components/Microphone/Microphone";

export default function TestPage() {
    return (<Layout title="TestPage">
    <Grid container justifyContent="center" alignItems="center" sx={{height: '100%', paddingBottom: 50}}>
    {/* <Alert /> */}
    <Microphone />
    </Grid>
  </Layout>)
}
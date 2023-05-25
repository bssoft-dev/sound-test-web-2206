import { Grid, Typography } from "@mui/material";
import Layout from "../components/Layout/Layout";
import Alert from "../components/Alert/Alert";

export default function TestPage() {
    return (<Layout title="TestPage">
    <Grid container justifyContent="center" alignItems="center" sx={{height: '100%', paddingBottom: 50}}>
    <Alert />
    </Grid>
  </Layout>)
}
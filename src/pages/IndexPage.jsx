import React, { useLayoutEffect } from "react";
import { useCtx } from "../context/Context";
import { useTitle } from "../hooks/useTitle";
import Layout from "../components/Layout/Layout";
import { Grid, Typography } from "@mui/material";

import "./styles.css";
import { withAuth } from "../hooks/withAuth";


function IndexPage() {
  const context = useCtx();  
  const { setTitle, token } = context;
  useTitle()

  useLayoutEffect(() => {
    console.log(token)
    setTitle('비에스 소프트');
  }, []);

  return (<>
    {token ? 
      <Layout>
        <Grid container justifyContent="center" alignItems="center" sx={{height: '100%', paddingBottom: 50}}>
          <Typography variant="h3" color="text.secondary">
          TEST PAGE
          </Typography>
        </Grid>
      </Layout> : <></>
      }
  </>);
}


export default withAuth(IndexPage);

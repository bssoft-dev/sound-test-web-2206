import React, { useEffect, useLayoutEffect,  } from "react";
import { useTitle } from "../hooks/useTitle";
import Layout from "../components/Layout/Layout";
import { Grid, Typography } from "@mui/material";

import "./styles.css";
import { withAuth } from "../hooks/withAuth";
import { useStore } from "../stores/useStore";


function IndexPage() {
  const { setTitle, token, pathname } = useStore(
    state => ({
      setTitle: state.setTitle,
      token: state.token,
      pathname: state.pathname,
    })
  );
  useTitle()
  useEffect(() => {
    setTitle('비에스 소프트');
  }, [pathname]);

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

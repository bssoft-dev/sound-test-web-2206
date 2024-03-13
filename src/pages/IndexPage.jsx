import React, { useEffect, useLayoutEffect, } from "react";
import { useTitle } from "../hooks/useTitle";
import Layout from "../components/Layout/Layout";
import { Button, Card, Divider, Grid, Stack, Typography } from "@mui/material";

import "./styles.css";
import { withAuth } from "../hooks/withAuth";
import { useStore } from "../stores/useStore";
import ServerHealthCard from "../components/ServerHealthCard/ServerHealthCard";
import GpuHealthCard from "../components/GpuHealthCard/GpuHealthCard";
import axios from "axios";
import ServerControlCard from "../components/ServerControlCard/ServerControlCard";


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
        <Grid container
          flexDirection="column"
          sx={{ height: { md: 'calc(100% + 24px)' } }}>
          <Grid item xs={12}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Grid container spacing={6} sx={{ width: '100%' }}>
              
              <Grid item xs={12} md={6} sx={{ mb: 6 }} >
                <Grid container flexDirection="column">
                  <Typography variant="h6" color="#000000de">GPU 현황</Typography>
                  <Divider sx={{mt: 1}} />
                  <Grid container flexWrap="wrap" spacing={2}
                    sx={{ pt: 3 }}>
                      <GpuHealthCard />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6} sx={{ mb: 6 }} >
                <Grid container flexDirection="column">
                  <Typography variant="h6" color="#000000de">서버 유지 현황</Typography>
                  <Divider sx={{mt: 1}} />
                  <Grid container flexWrap="wrap" spacing={2}
                    sx={{ pt: 3 }}>
                      <ServerControlCard />
                  </Grid>
                </Grid>
              </Grid>

            </Grid>
            <Grid item sx={{ mb: 6 }} >
              <Grid container flexDirection="column">
                <Typography variant="h6" color="#000000de">서버 현황</Typography>
                <Divider sx={{mt: 1}} />
                <Grid container flexWrap="wrap" spacing={2}
                  sx={{ pt: 3 }}>
                    <ServerHealthCard />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item xs={12} md={6} sx={{ mb: { xs: 4, md: 0 } }}>
          </Grid> */}
        </Grid>
      </Layout> : <></>
    }
  </>);
}


export default withAuth(IndexPage);

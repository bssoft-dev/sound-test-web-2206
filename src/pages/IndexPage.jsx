import React, { useEffect, useLayoutEffect, } from "react";
import { useTitle } from "../hooks/useTitle";
import Layout from "../components/Layout/Layout";
import { Button, Card, Grid, Stack, Typography } from "@mui/material";

import "./styles.css";
import { withAuth } from "../hooks/withAuth";
import { useStore } from "../stores/useStore";
import ServerHealthCard from "../components/ServerHealthCard/ServerHealthCard";


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
          flexDirection={{ md: 'column', lg: 'row' }}
          sx={{ height: { md: 'calc(100% + 24px)' } }}>
          <Grid item xs={12} md={6}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Grid item flex="1" sx={{ mb: 4 }} >
              <Grid container flexDirection="column">
                <Typography variant="h6">서버 현황</Typography>
                <Grid container flexWrap="wrap" spacing={2}
                  sx={{ pt: 3 }}>
                    <ServerHealthCard />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} sx={{ mb: { xs: 4, md: 0 } }}>
          </Grid>
        </Grid>
      </Layout> : <></>
    }
  </>);
}


export default withAuth(IndexPage);

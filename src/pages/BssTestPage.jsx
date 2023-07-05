import React, { useEffect, useState } from "react";
import { useCtx } from "../context/Context";
import { useTitle } from "../hooks/useTitle";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import RecordTable from "../components/RecordTable/RecordTable";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";

import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
  item: {
    padding: '0 !important',
  },
}));

export default function BssTestPage() {
  const classes = useStyles();
  const context = useCtx();  
  const { setTitle, files  } = context;

  const title = '화자 분리 테스트'
  useTitle(title);

  useEffect(() => {
    setTitle(title);
  }, []);


  
  return (
    <Layout>
      <>
        <RecordTable />
        <Grid container direction="column">
          {files.map((file, index) => (
            <Grid key={index} item className={classes.item}>
              <AudioPlayer file={file} />
            </Grid>
          ))}
        </Grid>
      </>
    </Layout>
  )
}

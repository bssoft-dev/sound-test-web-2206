import React, { useEffect, useLayoutEffect, useState } from "react";
import { useCtx } from "../context/Context";
import { useTitle } from "../hooks/useTitle";
import Layout from "../components/Layout/Layout";
import RecordTable from "../components/RecordTable/RecordTable";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";

import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import supabase from "../utils/supabase";
import { withAuth } from "../hooks/withAuth";

const useStyles = makeStyles(theme => ({
  item: {
    padding: '0 !important',
  },
}));

function SoundTestPage() {
  const classes = useStyles();
  const context = useCtx();  
  const { setTitle, files, fetchSoundDatas, setSoundTableRows, sountTableRows } = context;
  const title = '사운드 처리 테스트'
  useTitle(title);
  
  useLayoutEffect(() => {
    setTitle(title);
    setSoundTableRows([]);
  }, [])

  useEffect(() => {
    fetchSoundDatas();
    const channels = supabase.channel('channels_change')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sound' },
        (payload) => {
          console.log('Change received!', payload);
          fetchSoundDatas();
        }
      )
      .subscribe();
  }, []);

  return (
    <Layout>
      <>
        <RecordTable fetchDatahandle={fetchSoundDatas} rowsData={sountTableRows} />
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

export default withAuth(SoundTestPage);
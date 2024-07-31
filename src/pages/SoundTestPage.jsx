import React, { useEffect, useLayoutEffect} from "react";
import { useTitle } from "../hooks/useTitle";
import Layout from "../components/Layout/Layout";
import RecordTable from "../components/RecordTable/RecordTable";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";

import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import supabase from "../utils/supabase";
import { withAuth } from "../hooks/withAuth";
import { useStore } from "../stores/useStore";
import { shallow } from "zustand/shallow";

const useStyles = makeStyles(theme => ({
  item: {
    padding: '0 !important',
  },
}));

function SoundTestPage() {
  const classes = useStyles();
  const { setTitle, files, fetchSoundDatas, setSoundTableRows, soundTableRows } = useStore(
    state => ({
      setTitle: state.setTitle, 
      files: state.files, 
      fetchSoundDatas: state.fetchSoundDatas, 
      setSoundTableRows: state.setSoundTableRows, 
      soundTableRows: state.soundTableRows
    }), shallow
  );
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
        <RecordTable fetchDatahandle={fetchSoundDatas} rowsData={soundTableRows} />
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
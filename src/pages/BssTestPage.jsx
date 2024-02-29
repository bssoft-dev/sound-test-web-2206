import React, { useEffect, useLayoutEffect, } from "react";
import { useTitle } from "../hooks/useTitle";
import Layout from "../components/Layout/Layout";
import RecordTable from "../components/RecordTable/RecordTable";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";

import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { withAuth } from "../hooks/withAuth";
import { useStore } from "../stores/useStore";
import { shallow } from "zustand/shallow";
import supabase from "../utils/supabase";

const useStyles = makeStyles(theme => ({
  item: {
    padding: '0 !important',
  },
}));

function BssTestPage() {
  const classes = useStyles();
  const { setTitle, files, bssSoundTableRows, setBssSoundTableRows, fetchBssSoundDatas } = useStore(
    state => ({
      setTitle: state.setTitle, 
      files: state.files, 
      bssSoundTableRows: state.bssSoundTableRows, 
      setBssSoundTableRows: state.setBssSoundTableRows, 
      fetchBssSoundDatas: state.fetchBssSoundDatas
    }), shallow
  );

  const title = '화자 분리 테스트'
  useTitle(title);

  useLayoutEffect(() => {
    setTitle(title);
    setBssSoundTableRows([]);  
  }, []);

  useEffect(() => {
    fetchBssSoundDatas();
    const channels = supabase.channel('channels_change')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bssSound' },
        (payload) => {
          console.log('Change received!', payload);
          fetchBssSoundDatas();
        }
      )
      .subscribe();
  }, [])
  
  return (
    <Layout>
      <>
        <RecordTable fetchDatahandle={fetchBssSoundDatas} rowsData={bssSoundTableRows} />
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

export default withAuth(BssTestPage);
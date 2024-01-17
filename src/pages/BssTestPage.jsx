import React, { useLayoutEffect, } from "react";
import { useTitle } from "../hooks/useTitle";
import Layout from "../components/Layout/Layout";
import RecordTable from "../components/RecordTable/RecordTable";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";

import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { withAuth } from "../hooks/withAuth";
import { useStore } from "../stores/useStore";
import { shallow } from "zustand/shallow";

const useStyles = makeStyles(theme => ({
  item: {
    padding: '0 !important',
  },
}));

function BssTestPage() {
  const classes = useStyles();
  const { setTitle, files, fetchData, setRows, rows } = useStore(
    state => ({
      setTitle: state.setTitle, 
      files: state.files, 
      fetchData: state.fetchData, 
      setRows: state.setRows, 
      rows: state.rows
    }), shallow
  );

  const title = '화자 분리 테스트'
  useTitle(title);

  useLayoutEffect(() => {
    setRows([]);  
    setTitle(title);
  }, []);


  
  return (
    <Layout>
      <>
        <RecordTable fetchDatahandle={fetchData} rowsData={rows} />
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
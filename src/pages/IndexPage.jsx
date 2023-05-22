import React, { useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import RecordTable from "../components/RecordTable/RecordTable";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";

import Grid from "@mui/material/Grid";


import axios from "axios";

import "./styles.css";


function IndexPage() {
  const [files, setFiles] = useState([null]);

  const pushFile = file => {
    setFiles([...files, file]);
  };

  const setFile = file => {
    setFiles(file);
  };

  const [regions, setRegions] = useState([
      {
        id: 'region-1',
        start: 0,
        end: 1,
        color: "rgba(60, 179, 113, 0.3)"
      }
    ]);

  const setRegion = region => {
    setRegions([region]);
  };

  const [rows, setRows] = useState([]);
  
  const fetchData = () => {
    axios.get("http://sound.bs-soft.co.kr/status")
        .then((response)=> {
            console.log('response status: ',response.data);
            setRows(response.data);
        })
        .catch((error)=> {
            console.log(error);
        })
  }

  return (
    <div className="App">
      <header className="App-header">
      </header>
    <>
      <NavBar fetchData={fetchData} />
      {/* <Microphone pushFile={pushFile} /> */}
      <RecordTable regions={regions} setFile={setFile} fetchData={fetchData} rows={rows} />
      <Grid container direction="column" spacing={3}>
        {files.map((file, index) => (
          <Grid key={index} item>
            <AudioPlayer file={file} regions={regions} setRegion={setRegion}/>
          </Grid>
        ))}
      </Grid>
    </>
    </div>
  );
}


export default IndexPage;

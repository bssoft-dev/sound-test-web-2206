import { useEffect, useRef, useState } from "react";
import { useCtx } from "../context/Context";
import Layout from "../components/Layout/Layout";
import WaveSurfer from "wavesurfer.js";
import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js";
import { Button, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
  waveWrap: {
      width: 500,
      height: 180, 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      backgroundColor:'#FBF0E0',
      overflow: 'hidden'
  },
  recordWave: {
    width: 400,
    height: 100
  }
}));

export default function TestPage() {
  const context = useCtx();
  const classes = useStyles();
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    return () => {
      if (wavesurferRef.current && wavesurferRef.current.microphone) {
        wavesurferRef.current.microphone.stopDevice();
        wavesurferRef.current.destroy();
      }
    };
  }, []);

  const handleClick = () => {
    if (wavesurferRef.current === null) {
      let context, processor;

      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#FFB673',
        backgroundColor:'#FBF0E0',
        widht: 400,
        height: 100,
        interact: false,
        cursorWidth: 0,
        audioContext: context || null,
        audioScriptProcessor: processor || null,
        // Set a bar width
        barWidth: 3,
        // Optionally, specify the spacing between bars
        barGap: 4,
        // And the bar radius
        barRadius: 2,
        plugins: [
          MicrophonePlugin.create({
            bufferSize: 4096,
            numberOfInputChannels: 1,
            numberOfOutputChannels: 1,
            constraints: {
              video: false,
              audio: true,
            },
          }),
        ],
      });

      wavesurferRef.current.microphone.on('deviceReady', () => {
        console.info('Device ready!');
      });
      wavesurferRef.current.microphone.on('deviceError', (code) => {
        console.warn('Device error: ' + code);
      });
      wavesurferRef.current.on('error', (e) => {
        console.warn(e);
      });
      wavesurferRef.current.microphone.start();
    } else if (wavesurferRef.current.microphone != null && wavesurferRef.current.microphone) {
      if (wavesurferRef.current.microphone.active) {
        wavesurferRef.current.microphone.stop();
      } else {
        wavesurferRef.current.microphone.start();
      }
    }
  };

  return (<Layout title="TestPage">
    <Grid container flexDirection="column"
      justifyContent="center" alignItems="center" 
      sx={{ height: '100%', paddingBottom: 50 }}>
      <Grid className={classes.waveWrap}>
        <Grid id="waveform" className={classes.recordWave} ref={waveformRef}></Grid>
      </Grid>
      <button onClick={handleClick}>Toggle Microphone</button>
    </Grid>
  </Layout>)
}
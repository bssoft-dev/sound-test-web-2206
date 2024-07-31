import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTitle } from "../hooks/useTitle";
import Layout from "../components/Layout/Layout";

import { Card, CardContent, CardHeader, Divider, Grid, Paper, Typography } from "@mui/material";
import WaveSurfer from "wavesurfer.js";
import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js";
import { makeStyles } from "@mui/styles";
import { keyframes } from '@mui/system';
import { withAuth } from "../hooks/withAuth";
import { useStore } from "../stores/useStore";
import { shallow } from "zustand/shallow";
import SocketStream from "../components/SocketStrem/SocketStream";

const useStyles = makeStyles(theme => ({
  dataWrap: {
    width: '100%',
    height: '100%'
  },
  waveWrap: {
    flex: 1,
    height: '90%',
    minHeight: '120px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 12,
    // backgroundColor: '#FBF0E0',
    overflow: 'hidden',
  },
  recordWave: {
    width: '85%',
    height: 100
  },
}));

const pulse = keyframes`
    0% {
        box-shadow: 0px 0px 5px 0px rgba(251, 173, 173, .3);
    }
    65% {
        box-shadow: 0px 0px 5px 13px rgba(251, 173, 173, .3);
    }
    90% {
        box-shadow: 0px 0px 5px 13px rgba(251, 173, 173, 0);
    }
`;

export const recorderParams = {
  text: "",
  // energy_threshold: [0.01, 0.1],
  start_threshold: 0,
  end_threshold: 0,
  pause_threshold: 1.0,
  neutral_color: "inherit",
  recording_color: "error",
  icon_name: "microphone",
  icon_size: "3x",
  sample_rate: 16000,
  key: "audio_recorder",
  continuousRecording: false,
  timeContinuousRecording: true
};


function DangerSoundPage() {
  const classes = useStyles();
  const { setTitle } = useStore(
    state => ({
      setTitle: state.setTitle,
    }), shallow
  );

  const title = '위험 사운드 분류'
  useTitle(title);

  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [recording, setRecording] = useState(false);

  useLayoutEffect(() => {
    setTitle(title);
    return () => {
      if (wavesurferRef.current && wavesurferRef.current.microphone) {
        wavesurferRef.current.microphone.stopDevice();
        wavesurferRef.current.destroy();
      }
    };
  }, [setTitle]);

  const [violent, setViolent] = useState(null);
  const [isViolent, setIsViolent] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (violent !== null && violent.length > 0) {
      setIsViolent(true);

      timeoutId = setTimeout(() => {
        setIsViolent(false);
        // isViolent가 false로 변경된 후 2초 뒤에 violent를 null로 설정
        setTimeout(() => {
          setViolent(null);
        }, 2000);
      }, 4000);
    }

    return () => {
      clearTimeout(timeoutId); // 컴포넌트가 언마운트될 때 타이머 정리
    };
  }, [violent]);

  // const [recordData, setRecordData] = useState([]);
  
  // const handleDataUpdate = (data) => {
  //   setRecordData((prevData) => [...prevData, data]);
  // };

  // useEffect(() => {
  //   console.log('recordData: ', recordData);
  // }, [recordData])

  const handleClick = () => {
    if (wavesurferRef.current === null) {
      let context, processor;

      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#f44336',
        // backgroundColor: '#FBF0E0',
        width: 400,
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
        console.log('err');
      });

      wavesurferRef.current.microphone.start();
    } else if (wavesurferRef.current.microphone != null) {
      if (wavesurferRef.current.microphone.active) {
        wavesurferRef.current.microphone.stop();
      } else {
        wavesurferRef.current.microphone.start();
      }
    }
  };


  return (
    <Layout>
      <Grid container spacing={2}
        flexDirection="column"
        sx={{ position: 'relative', minHeight: '100%' }}>
        <Grid item>
          <Paper sx={{ py: 2, px: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <SocketStream
              wsURL="wss://api-2106.bs-soft.co.kr/ws/byte"
              wavesurferRef={wavesurferRef}
              handleWaveForm={handleClick}
              // handleDataUpdate={handleDataUpdate}
              recording={recording}
              setRecording={setRecording}
              setViolent={setViolent}
              btnStyle={[{
                borderRadius: '50%', width: { xs: '3rem', lg: '5rem' }, minWidth: 'fit-content', height: { xs: '3rem', lg: '5rem' },
              }, recording && { backgroundColor: "#f44336", boxShadow: 'none', animation: `${pulse} 1.5s infinite linear` }]}
            />
            <Grid className={classes.waveWrap}>
              <Grid id="waveform" className={classes.recordWave} ref={waveformRef}></Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item flex="1" sx={{ mb: 4 }} >
          <Card sx={{ height: '100%', overflowY: 'auto' }}>
            <CardHeader title={
              <Typography variant="subtitle1" fontWeight={500}>위험 사운드 발생</Typography>
            } />
            <Divider />
            <CardContent sx={{ textAlign: 'center' }} >
              {/* {recordData && recordData.map((data, index) => {
                    return (<Typography sx={{ pb: 1 }} key={index}>{data}</Typography>)
                  })} */}
              <Typography fontWeight={600}
                color="error"
                sx={{
                  py: 3, height: 84, fontSize: 24, transition: 'all 3s ease-in-out',
                  opacity: isViolent ? 1 : 0
                }} >{violent ? violent : ' '}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default withAuth(DangerSoundPage);
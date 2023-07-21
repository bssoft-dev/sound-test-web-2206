import { createContext, useEffect, useRef, useState } from "react";
import { useCtx } from "../context/Context";
import { useTitle } from "../hooks/useTitle";
import Layout from "../components/Layout/Layout";
import { TimerContextProvider, TimerCtx } from "../context/TimerContext";
import { RecordContextProvider, RecordCtx } from "../context/RecordContext";

import { Button, Card, CardContent, CardHeader, Divider, Grid, IconButton, Paper, Typography } from "@mui/material";
import SttRecord from "../components/SttRecord/SttRecord";
import Loading from "../components/Loading/Loading";
import AudioRecorder from "../components/AudioRecorder/AudioRecorder";
import WaveSurfer from "wavesurfer.js";
import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js";
import { makeStyles } from "@mui/styles";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { red } from "@mui/material/colors";
import { keyframes } from '@mui/system';

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
    start_threshold: 0.01,
    end_threshold: 0.01,
    pause_threshold: 1.0,
    neutral_color: "inherit",
    recording_color: "error",
    icon_name: "microphone",
    icon_size: "3x",
    sample_rate: 16000,
    key: "audio_recorder",
    continuousRecording: true
};


export default function SttTestPage() {
    const classes = useStyles();
    const context = useCtx();  
    const { setTitle, loading, } = context;
    const title = 'STT 기본모델 테스트'
    useTitle(title);

    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [recording, setRecording] = useState(false);
    
    useEffect(() => {
      setTitle(title);
      return () => {
        if (wavesurferRef.current && wavesurferRef.current.microphone) {
          wavesurferRef.current.microphone.stopDevice();
          wavesurferRef.current.destroy();
        }
      };
    }, []);

    const [ recordData, setRecordData ] = useState([]);
    const handleDataUpdate = (data) => {
        setRecordData((prevData) => [...prevData, data]);
    };
    const handleClick = () => {
        if (wavesurferRef.current === null) {
          let context, processor;
    
          wavesurferRef.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: '#f44336',
            // backgroundColor: '#FBF0E0',
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
            console.log('err')
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
    
    return(<TimerContextProvider>
        <RecordContextProvider>
            <Layout>
            <Grid container spacing={2}
                flexDirection="column"
                sx={{position: 'relative', minHeight: '100%'}}>
                <Grid item>
                    <Paper sx={{py: 2, px: 4, display: 'flex', alignItems: 'center', gap: 4}}>
                        <AudioRecorder args={new Map(Object.entries(recorderParams))} 
                            wavesurferRef={wavesurferRef}
                            handleWaveForm={handleClick}
                            handleDataUpdate={handleDataUpdate}
                            recordIcon={<KeyboardVoiceIcon sx={{color: recording ? '#fff' : 'inherit'}} />}
                            setRecording={setRecording}
                            btnStyle={[{ borderRadius: '50%', width: { xs: '3rem', lg: '5rem' }, minWidth: 'fit-content', height: { xs: '3rem', lg: '5rem' },
                                }, recording && {backgroundColor: "#f44336", boxShadow: 'none', animation: `${pulse} 1.5s infinite linear`}]}
                            />  
                        <Grid className={classes.waveWrap}>
                            <Grid id="waveform" className={classes.recordWave} ref={waveformRef}></Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item flex="1" sx={{ mb: 4}} >
                    <Card sx={{ height: '100%',overflowY: 'auto'}}>
                        <CardHeader title={
                            <Typography variant="subtitle1" fontWeight={500}>인식결과</Typography>
                        } />
                        <Divider />
                        <CardContent>
                            {recordData && recordData.map((data, index) => {
                                return (<Typography sx={{pb: 1}} key={index}>{data}</Typography>)
                            })}
                        </CardContent>
                    </Card>
                </Grid>
                {/* <Grid item flex={1}>
                    <embed src="https://sound.bs-soft.co.kr/receive/ws/byte"
                    width="100%" height="100%"></embed>
                </Grid> */}
                </Grid>
            </Layout>
        </RecordContextProvider>
      </TimerContextProvider>)
}

export const SttContext = createContext();
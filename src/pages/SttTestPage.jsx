import { useEffect, useRef } from "react";
import { useCtx } from "../context/Context";
import Layout from "../components/Layout/Layout";
import { TimerContextProvider, TimerCtx } from "../context/TimerContext";
import { RecordContextProvider, RecordCtx } from "../context/RecordContext";
import RecordWaveSurfer from "../components/WaveSurferComp/RecordWaveSurfer";

import { Grid, IconButton, Paper } from "@mui/material";
import SttRecord from "../components/SttRecord/SttRecord";
import Loading from "../components/Loading/Loading";
import AudioRecorder from "../components/AudioRecorder/AudioRecorder";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
    dataWrap: {
        width: '100%',
        height: '100%'
    }
}));

export const recorderParams = {
    text: "Click to record",
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
};

export default function SttTestPage() {
    const classes = useStyles();
    const context = useCtx();  
    const { setTitle, loading } = context;

    useEffect(() => {
        setTitle('STT 기본모델 테스트');
    }, []);
    
    return(<TimerContextProvider>
        <RecordContextProvider>
            <Layout>
            <Grid container spacing={2}
                flexDirection="column"
                sx={{position: 'relative', height: '100%'}}>
                  <AudioRecorder args={new Map(Object.entries(recorderParams))} />  
                  <Grid flex={1}>
                    <embed src="https://sound.bs-soft.co.kr/receive/ws/byte"
                    width="100%" height="100%"></embed>
                  </Grid>
                </Grid>
            </Layout>
        </RecordContextProvider>
      </TimerContextProvider>)
}
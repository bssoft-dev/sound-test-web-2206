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
                sx={{position: 'relative'}}>
                  <AudioRecorder args={new Map(Object.entries(recorderParams))} />  
                  <embed src="https://sound-stream.bs-soft.co.kr/receive/ws"
                  height="800px"
                  ></embed>
                </Grid>
            </Layout>
        </RecordContextProvider>
      </TimerContextProvider>)
}
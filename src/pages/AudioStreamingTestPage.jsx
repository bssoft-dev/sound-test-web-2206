import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useCtx } from "../context/Context";
import { Card, CardActions, CardContent, Divider, Grid, Paper, Typography } from "@mui/material";
import Timer from "../components/Timer/Timer";
import AudioStream from "../components/AudioStream/AudioStream";
import { TimerContextProvider } from "../context/TimerContext";
import StreamTable from "../components/StreamTable/StreamTable";
import { StreamContextProvider, StreamCtx } from "../context/StreamContext";
import ButtonWrap from "../components/AudioStream/ButtonWrap";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";
import WaveSurferComp from "../components/AudioStream/WaveSurferComp";

export default function AudioStreamingTestPage() {
    const context = useCtx();  
    const { setTitle  } = context;
    const AudioAnalyserRef = useRef();

    const [audioAnalyserRefWidth, setAudioAnalyserRefWidth] = useState();

    useEffect(() => {
        setTitle('오디오 스트리밍 테스트');
        setAudioAnalyserRefWidth(AudioAnalyserRef.current.offsetWidth - 40 * 2);
    }, []);

    return(<StreamContextProvider>
        <TimerContextProvider>
            <Layout>
                <Grid container spacing={2}>
                    <Grid item xs={6} >
                        <Paper ref={AudioAnalyserRef} sx={{height: '100%', overflow: 'hidden', py: 2, px: 5}}>
                            <Grid container justifyContent="center"
                                spacing={1} sx={{ml: 0, pt: 3}}>
                                <ButtonWrap />
                                <Timer />
                                <AudioStream audioAnalyserRefWidth={audioAnalyserRefWidth} />
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper sx={{height: '100%', py: 2, px: 5}}>
                            <WaveSurferComp />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <StreamTable />
                        </Paper>
                    </Grid>
                </Grid>
            </Layout>
        </TimerContextProvider>
    </StreamContextProvider>)
}
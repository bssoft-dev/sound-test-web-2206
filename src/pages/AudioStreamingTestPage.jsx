import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useCtx } from "../context/Context";
import { TimerContextProvider } from "../context/TimerContext";
import { StreamContextProvider, StreamCtx } from "../context/StreamContext";
import StreamWaveSurfer from "../components/WaveSurferComp/StreamWaveSurfer";
import Timer from "../components/Timer/Timer";
import AudioStream from "../components/AudioStream/AudioStream";
import ButtonWrap from "../components/AudioStream/ButtonWrap";
import StreamTable from "../components/StreamTable/StreamTable";
import { Grid, Paper } from "@mui/material";

export default function AudioStreamingTestPage() {
    const context = useCtx();  
    const { setTitle  } = context;
    const AudioAnalyserRef = useRef();

    const [audioAnalyserRefWidth, setAudioAnalyserRefWidth] = useState();

    useEffect(() => {
        setTitle('ADL 분석 테스트');
        setAudioAnalyserRefWidth(AudioAnalyserRef.current.offsetWidth - 40 * 2);
    }, []);

    return(<StreamContextProvider>
        <TimerContextProvider>
            <Layout>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Paper ref={AudioAnalyserRef} sx={{height: '100%', overflow: 'hidden', py: 2, px: 5}}>
                            <Grid container justifyContent="center"
                                spacing={1} sx={{ml: 0, pt: 3}}>
                                <ButtonWrap />
                                <Timer />
                                <AudioStream audioAnalyserRefWidth={audioAnalyserRefWidth} />
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper sx={{height: '100%', py: 2, px: 5}}>
                            <StreamWaveSurfer />
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
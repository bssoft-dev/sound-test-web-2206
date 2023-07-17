import { useEffect, useRef, useState } from "react";
import { useCtx } from "../context/Context";
import { useTitle } from "../hooks/useTitle";
import Layout from "../components/Layout/Layout";
import { TimerContextProvider } from "../context/TimerContext";
import { StreamContextProvider, StreamCtx } from "../context/StreamContext";
import StreamWaveSurfer from "../components/WaveSurferComp/StreamWaveSurfer";
import Timer from "../components/Timer/Timer";
import AudioStream from "../components/AudioStream/AudioStream";
import ButtonWrap from "../components/AudioStream/ButtonWrap";
import StreamTable from "../components/StreamTable/StreamTable";
import { Grid, Paper } from "@mui/material";
import axios from "axios";

export default function AudioStreamingTestPage() {
    const context = useCtx();  
    const { setTitle, setServerHealth } = context;

    const title = 'ADL 분석 테스트'
    useTitle(title);

    const AudioAnalyserRef = useRef();

    const [audioAnalyserRefWidth, setAudioAnalyserRefWidth] = useState();

    useEffect(() => {
        const padding = window.innerWidth> 600 ? 40 : 24
        setTitle(title);
        setAudioAnalyserRefWidth(AudioAnalyserRef.current.offsetWidth - padding * 2);
        axios.get('https://api-2035.bs-soft.co.kr/')
            .then((response) => {
                if(response.status === 200) {
                    setServerHealth(true);
                }
            })
            .catch((error)=> {
                console.log(error);
                setServerHealth(false);
            })
    }, []);

    return(<StreamContextProvider>
        <TimerContextProvider>
            <Layout>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Paper ref={AudioAnalyserRef} sx={{height: '100%', overflow: 'hidden', py: 2, px: {xs: 3, md: 5}}}>
                            <Grid container flexDirection={{xs: 'column-reverse', md: "column"}}
                                spacing={1} sx={{ml: 0, pt: {xs: 1, md: 3}}}>
                                <Grid container flexDirection={{xs: 'row', md: 'column'}} 
                                    alignItems="center" justifyContent="center" 
                                    sx={{gap: 1}}>
                                    <ButtonWrap />
                                    <Timer/>
                                </Grid>
                                <AudioStream audioAnalyserRefWidth={audioAnalyserRefWidth} />
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper sx={{height: '100%', py: 2, px: {xs: 2, md: 5}}}>
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
import React, { useLayoutEffect, useRef, useState } from "react";
import { useTitle } from "../hooks/useTitle";
import Layout from "../components/Layout/Layout";
import StreamWaveSurfer from "../components/WaveSurferComp/StreamWaveSurfer";
import Timer from "../components/Timer/Timer";
import AudioStream from "../components/AudioStream/AudioStream";
import ButtonWrap from "../components/AudioStream/ButtonWrap";
import StreamTable from "../components/StreamTable/StreamTable";
import { Grid, Paper } from "@mui/material";
import { withAuth } from "../hooks/withAuth";
import { useStore } from "../stores/useStore";
import { shallow } from "zustand/shallow";

function AudioStreamingTestPage() {
    const { setTitle } = useStore(
        state => ({
            setTitle: state.setTitle
        }), shallow
    );

    const title = 'ADL 분석 테스트'
    useTitle(title);

    const AudioAnalyserRef = useRef();

    const [audioAnalyserRefWidth, setAudioAnalyserRefWidth] = useState();

    useLayoutEffect(() => {
        const padding = window.innerWidth> 600 ? 40 : 24
        setTitle(title);
        setAudioAnalyserRefWidth(AudioAnalyserRef.current.offsetWidth - padding * 2);
    }, []);

    return(
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
    )
}

export default withAuth(AudioStreamingTestPage);
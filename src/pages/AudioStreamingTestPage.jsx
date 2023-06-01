import { useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useCtx } from "../context/Context";
import { Grid } from "@mui/material";
import Timer from "../components/Timer/Timer";
import AudioStream from "../components/AudioStream/AudioStream";
import { TimerContextProvider } from "../context/TimerContext";

export default function AudioStreamingTestPage() {
    const context = useCtx();  
    const { setTitle, files  } = context;

    useEffect(() => {
        setTitle('오디오 스트리밍 테스트');
    }, [])

    return(<TimerContextProvider>
        <Layout>
            <Grid container justifyContent="center" alignContent="center" flexDirection="column"
            sx={{height: '100%'}}>
                <Timer />
                <AudioStream />
            </Grid>
        </Layout>
    </TimerContextProvider>)
}
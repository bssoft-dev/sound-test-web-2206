import { useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useCtx } from "../context/Context";
import { Card, CardActions, CardContent, Divider, Grid, Typography } from "@mui/material";
import Timer from "../components/Timer/Timer";
import AudioStream from "../components/AudioStream/AudioStream";
import { TimerContextProvider } from "../context/TimerContext";
import StreamTable from "../components/StreamTable/StreamTable";

export default function AudioStreamingTestPage() {
    const context = useCtx();  
    const { setTitle, files  } = context;

    useEffect(() => {
        setTitle('오디오 스트리밍 테스트');
    }, [])

    return(<TimerContextProvider>
        <Layout>
            <Grid container flexDirection="column"
            alignContent="center"
            spacing={2}>
                <Grid item 
                    sx={{width: 'fit-content', mx: 'auto', mb: 2}} >
                    <Timer />
                    <AudioStream />
                    {/* <Card>    
                        <CardContent >
                        </CardContent>
                    </Card> */}
                </Grid>
                <Divider />
                <Grid item sx={{width: '100%'}}>
                    <Typography>
                        데이터에 맞춰 아래 테이블 변경 예정
                    </Typography>
                    <StreamTable />
                </Grid>
            </Grid>
        </Layout>
    </TimerContextProvider>)
}
import { useEffect, useRef } from "react";
import { useCtx } from "../context/Context";
import Layout from "../components/Layout/Layout";
import { RecordContextProvider, RecordCtx } from "../context/RecordContext";
import RecordWaveSurfer from "../components/WaveSurferComp/RecordWaveSurfer";

import { Grid, IconButton, Paper } from "@mui/material";
import SttRecord from "../components/SttRecord/SttRecord";
import Loading from "../components/Loading/Loading";

export default function SttTestPage() {
    const context = useCtx();  
    const { setTitle, loading } = context;

    useEffect(() => {
        setTitle('STT 기본모델 테스트');
    }, []);
    
    return(
        <RecordContextProvider>
            <Layout>
            <Grid container spacing={2}
                sx={{position: 'relative'}}>
                {loading && <Loading sx={{position: 'absolute', top: 0, left: 0, zIndex: 100}} /> }
                    {/* <Grid item xs={12}>
                        <Paper>
                        녹음하면 blob파일 api 전달해서 response가 넘어올 때 까지 로딩, 
                        response가 넘어오면 메세지 출력
                        클로바 노트 참고
                        </Paper>
                    </Grid> */}
                    <Grid item xs={6} >
                        <Paper sx={{height: '100%', overflow: 'hidden', py: 2, px: 5}}>
                            <SttRecord />
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper sx={{height: '100%', py: 2, px: 5}}>
                            <RecordWaveSurfer />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            메세지 출력 될 영역
                        </Paper>
                    </Grid>
                </Grid>
            </Layout>
        </RecordContextProvider>
    )
}
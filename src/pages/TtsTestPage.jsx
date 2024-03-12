import { shallow } from "zustand/shallow";
import Layout from "../components/Layout/Layout";
import { withAuth } from "../hooks/withAuth";
import { useStore } from "../stores/useStore";
import { useTitle } from "../hooks/useTitle";
import { useEffect, useLayoutEffect, useState } from "react";
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Divider, Grid, TextField, Typography, cardHeaderClasses } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import axios from "axios";
import RecordTable from "../components/RecordTable/RecordTable";
import supabase from "../utils/supabase";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";

const useStyles = makeStyles(theme => ({
    audio: {
        width: '100%',
    }
}));

export const StyledCardHeader = styled(CardHeader)(({ theme }) => ({

    [`&.${cardHeaderClasses.root}`]: {
        height: 65,
        '@media (max-width: 600px)': {
            height: 'fit-content'
        },
    },
    [`& .MuiTypography-root`]: {
        textAlign: 'center',
        fontWeight: 700,
        fontSize: 22,
        '@media (max-width: 600px)': {
            fontSize: 18
        },
    }
}));


function TtsTestPage() {
    const classes = useStyles();
    const [ttsResult, setTtsResult] = useState('');

    const { setTitle, files, setAlert, ttsSoundTableRows, setTtsSoundTableRows, fetchTtsSoundDatas } = useStore(
        state => ({
            setTitle: state.setTitle,
            files: state.files, 
            setAlert: state.setAlert,
            ttsSoundTableRows: state.ttsSoundTableRows,
            setTtsSoundTableRows: state.setTtsSoundTableRows,
            fetchTtsSoundDatas: state.fetchTtsSoundDatas
        }), shallow
    )
    const title = 'TTS 기본 모델 테스트'
    useTitle(title);

    useLayoutEffect(() => {
        setTitle(title);
        setTtsSoundTableRows([]);
    }, []);
    useEffect(() => {
        fetchTtsSoundDatas();
        const channels = supabase.channel('channels_change')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ttsSound' },
        (payload) => {
            console.log('Change received!', payload);
            setAlert({
                open: true,
                type: "success",
                message: "TTS 변환이 완료되었습니다"
            });
            setTtsResult(payload.new.uriBase);
            fetchTtsSoundDatas();
        }
      )
      .subscribe();
    }, [])

    const [ttsText, setTtsText] = useState('');
    const handleChange = async () => {
        if (ttsText.trim().length === 0) {
            setAlert({
                open: true,
                type: "warning",
                message: "텍스트를 입력해주세요"
            });
        }
        try {
            const response = await axios.post(
                `https://tts.bs-soft.co.kr/tts/test?input_text=${ttsText}`,
            );
            setAlert({
                open: true,
                type: "success",
                message: "텍스트를 전송하였습니다"
            });
            console.log(response)
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Layout>
            <Grid container spacing={3}
                flexDirection="column"
                sx={{ height: { md: 'calc(100% + 24px)' } }}>
                <Grid item
                    sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, justifyContent: { md: 'space-between' }, }}>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <StyledCardHeader title="텍스트 입력" />
                            <Divider />
                            <CardContent sx={{ pb: 1 }}>
                                <TextField fullWidth
                                    id="ttsText"
                                    placeholder="텍스트를 입력해 주새요"
                                    multiline
                                    rows={3}
                                    onChange={e => setTtsText(e.target.value)} />
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0, }}>
                                <Button variant="contained"
                                    onClick={handleChange}>확인</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <StyledCardHeader title="TTS 결과" />
                            <Divider />
                            <CardContent>
                                <audio controls src={ttsResult} className={classes.audio}>
                                </audio>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Grid item>
                    <Divider sx={{mt: 1, mb: 3}} />
                    <RecordTable fetchDatahandle={fetchTtsSoundDatas} rowsData={ttsSoundTableRows} />
                    <Grid container direction="column">
                        {files.map((file, index) => (
                            <Grid key={index} item className={classes.item}>
                                <AudioPlayer file={file} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    )
}
export default withAuth(TtsTestPage);
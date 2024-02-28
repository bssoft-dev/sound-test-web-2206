import { shallow } from "zustand/shallow";
import Layout from "../components/Layout/Layout";
import { withAuth } from "../hooks/withAuth";
import { useStore } from "../stores/useStore";
import { useTitle } from "../hooks/useTitle";
import { useLayoutEffect } from "react";
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Divider, Grid, TextField, cardHeaderClasses } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";

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

    const { setTitle } = useStore(
        state => ({
            setTitle: state.setTitle,
        }), shallow
    )
    const title = 'TTS 기본 모델 테스트'
    useTitle(title);

    useLayoutEffect(() => {
        setTitle(title);
    }, []);

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
                            <CardContent sx={{pb: 1}}>
                                <TextField fullWidth 
                                    id="ttsText"
                                    placeholder="텍스트를 입력해 주새요"
                                    multiline
                                    rows={3}
                                    onChange={e => console.log(e.target.value)} />
                            </CardContent>
                            <CardActions sx={{justifyContent: 'flex-end', p: 2, pt: 0, }}>
                                <Button variant="contained">확인</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <StyledCardHeader title="결과" />
                            <Divider />
                            <CardContent>
                                <audio controls className={classes.audio}>
                                    <source src="/examples/media/sample_audio_mp3.mp3" type="audio/mpeg" />
                                    이 문장은 여러분의 브라우저가 audio 태그를 지원하지 않을 때 화면에 표시됩니다!
                                </audio>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Grid item>
                    <Card>
                        <StyledCardHeader title="TTS 리스트" />
                        <Divider />
                        <CardContent></CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    )
}
export default withAuth(TtsTestPage);
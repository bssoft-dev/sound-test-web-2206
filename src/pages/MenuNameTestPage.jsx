import { useEffect, useRef, useState } from "react";
import { useCtx } from "../context/Context";
import Layout from "../components/Layout/Layout";
import AudioRecorder from "../components/AudioRecorder/AudioRecorder";
import WaveSurfer from "wavesurfer.js";
import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Collapse, Divider, Grid, IconButton, List, ListItem, Typography, cardHeaderClasses } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { grey } from "@mui/material/colors";

const menuList = ['올타임콜드브루', '(1호점)신촌커피', '바닐라 카페라떼', '카라멜 마끼아또', '스페니쉬 연유 카페라떼', '달고나 카페라떼', '딸기 젤리 밀크티', '23수박주스', '아인슈페너 프라페', '스트로베리 초콜릿 프라페', '요거트 프라페', '블루밍 파인애플 라씨', '20곡 오틀리 라떼', '베이컨 체다 베이글', '멕시칸 파니니', '바베큐치킨 파니니', '떠먹는 티라미수', '떠먹는 아이스 박스', 'P. 뉴욕치즈', 'P. 클래식 가토 쇼콜라', 'P. 레드 벨벳', 'P. 퀸즈 캐롯', '초콜릿 크로캉 롱 슈', '황치즈 마카롱', '청포도 요거트 마카롱', '산딸기 마카롱', '블루베리 마카롱', '벨지안 초콜릿 마카롱']

const useStyles = makeStyles(theme => ({
  waveWrap: {
    width: '100%',
    height: '90%',
    minHeight: '120px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FBF0E0',
    overflow: 'hidden',
  },
  recordWave: {
    width: '85%',
    height: 100
  },
  recordIcon: {
    color: '#fff',
    position: "absolute",
  },
  recordIconShow: {
    fontSize: '2.38rem !important',
    '@media (max-width: 600px)': {
      fontSize: '1.4rem !important',
    },
  },
  recordIconHide: {
    fontSize: '0 !important',
  },
  menuName: {
    // transition: ".5s",
    animation: '$fadeIn 1s',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0},
    to: { opacity: 1},
  },
}));

export const recorderParams = {
  text: "",
  // energy_threshold: [0.01, 0.1],
  start_threshold: 0.01,
  end_threshold: 0.01,
  pause_threshold: 1.0,
  neutral_color: "warning",
  recording_color: "warning",
  icon_name: "microphone",
  icon_size: "3x",
  sample_rate: 16000,
  key: "audio_recorder",
  continuousRecording: false
};

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({

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

export default function MenuNameTestPage() {
  const classes = useStyles();
  const context = useCtx();
  const { setTitle } = context;
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [recordData, setRecordData] = useState(null);
  const handleDataUpdate = (data) => {
    setRecordData(data);
  };
  const [recording, setRecording] = useState(false);
  const textLng = recordData ? recordData.contents.join('').replaceAll(' ', '').length : 0;

  
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setTitle('카페 주문 테스트');
  }, []);
  useEffect(() => {
    recordData && setTimeout(() => {
        setShowMenu(true);
      }, 300)

  }, [recordData]);

  useEffect(() => {
    return () => {
      if (wavesurferRef.current && wavesurferRef.current.microphone) {
        wavesurferRef.current.microphone.stopDevice();
        wavesurferRef.current.destroy();
      }
    };
  }, []);

  const handleClick = () => {
    if (wavesurferRef.current === null) {
      let context, processor;

      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#FFB673',
        backgroundColor: '#FBF0E0',
        widht: 400,
        height: 100,
        interact: false,
        cursorWidth: 0,
        audioContext: context || null,
        audioScriptProcessor: processor || null,
        // Set a bar width
        barWidth: 3,
        // Optionally, specify the spacing between bars
        barGap: 4,
        // And the bar radius
        barRadius: 2,
        plugins: [
          MicrophonePlugin.create({
            bufferSize: 4096,
            numberOfInputChannels: 1,
            numberOfOutputChannels: 1,
            constraints: {
              video: false,
              audio: true,
            },
          }),
        ],
      });

      wavesurferRef.current.microphone.on('deviceReady', () => {
        console.info('Device ready!');
      });
      wavesurferRef.current.microphone.on('deviceError', (code) => {
        console.warn('Device error: ' + code);
      });
      wavesurferRef.current.on('error', (e) => {
        console.warn(e);
        console.log('err')
      });
      wavesurferRef.current.microphone.start();
    } else if (wavesurferRef.current.microphone != null && wavesurferRef.current.microphone) {
      if (wavesurferRef.current.microphone.active) {
        wavesurferRef.current.microphone.stop();
      } else {
        wavesurferRef.current.microphone.start();
      }
    }
  };

  return (<Layout title="TestPage">
    <Grid container spacing={3}
      flexDirection={{ xs: 'column', md: 'row' }}
      sx={{ height: { md: '100%' } }}>
      <Grid item xs={12} md={6}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <StyledCardHeader title="메뉴선택 테스트" />
          <Divider />
          <CardContent
            sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: { xs: 1, md: 2 }, pb: {xs: '16px !important', md: '24px !important'} }}>
              <Box
                sx={{ mb: 1, px: {md: 1}, alignSelf: {xs: 'flex-start', md: 'center'}}}>
                <Typography variant="button"  color="text.secondary"
                sx={{display: {md: 'inline-block'}}}> 테스트 예시: </Typography>
                <Typography fontWeight={500} fontSize={{xs: 14, md: 16}}
                  sx={{ml: {md: 1}, color: '#FF8A00', display: {md: 'inline-block'}}}>"황치즈 마카롱하고, 카라멜 마끼아또 주세요"</Typography>
              </Box>
            <Box sx={{flex: 1, width: '100%', mb: {xs: '12px', md: 0}}}>
              <Grid className={classes.waveWrap}>
                <Grid id="waveform" className={classes.recordWave} ref={waveformRef}></Grid>
              </Grid>
            </Box>
            <AudioRecorder args={new Map(Object.entries(recorderParams))}
              wavesurferRef={wavesurferRef}
              handleWaveForm={handleClick}
              handleDataUpdate={handleDataUpdate}
              setRecording={setRecording}
              recordIcon={
                <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <MoreHorizIcon sx={{transition: 'all .5s ease',}}
                    className={`${classes.recordIcon} ${recording ? classes.recordIconShow : classes.recordIconHide}`}
                  />
                  <MicRoundedIcon sx={{transition: 'all .5s ease',}}
                    className={`${classes.recordIcon} ${!recording ? classes.recordIconShow : classes.recordIconHide}`}
                  />
                </Box>
              }
              btnStyle={{ borderRadius: '50%', width: { xs: '3rem', md: '5rem' }, minWidth: 'fit-content', height: { xs: '3rem', md: '5rem' }, mt: 'auto' }} />
          </CardContent>
        </Card>
        <Card sx={{ flex: {xs: 0, md: 1}, display: 'flex', flexDirection: 'column' }}>
          <StyledCardHeader title="인식결과" />
          <Divider />
          <CardContent sx={{ p: { md: '28px' }, minHeight: '120px' }}>
            <Typography fontSize={{ xs: '24px', md: '2.5rem' }}
              fontWeight={500} lineHeight={1.4}
              sx={{ color: '#FF8A00' }} >
              {recordData && recordData.title}
            </Typography>
            {recordData && recordData.contents.map((data, index) => {
              return (
                <Collapse key={index} orientation="horizontal" in={showMenu} collapsedSize={0}
                sx={{height: {xs: '33.59px', md: 56}}}
                className={showMenu ? classes.menuName : ''}>
                  <Typography
                    xs={12} md={6}
                    fontSize={{ xs: '24px', md: '2.5rem' }}
                    fontWeight={500} lineHeight={1.4}>
                    {data}
                  </Typography>
                </Collapse>
              )
            })}
          </CardContent>
          <CardActions sx={{ mt: 'auto', justifyContent: 'space-between', pl: { xs: 2, md: '28px' }, pr: { md: '20px' } }}>
            <Typography color="#adadad" fontWeight={500}
              sx={{ fontSize: { md: '18px' } }}>{textLng} / 100</Typography>
            <IconButton onClick={() => setRecordData(null)}
              sx={{ fontSize: { xs: 24, md: 36 } }}>
              <RefreshRoundedIcon fontSize="inherit" sx={{ color: '#FF8A00' }} />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} sx={{mb: {xs: 4, md: 0}}}>
        <Card sx={{ height: { md: '100%' } }}>
          <StyledCardHeader title="메뉴" />
          <Divider />
          <CardContent sx={{ p: { md: 3 } }}>
            <List sx={{ columnCount: 2, maxWidth: 'calc(100% -80px)' }}>
              {menuList.map((menu, index) => {
                return <ListItem key={index}
                  sx={{
                    display: 'list-item', listStyleType: 'disc', listStylePosition: 'inside',
                    fontSize: { md: '1.2rem' }, py: '10px', px: { xs: 0, md: 2 }, }} 
                  >
                  {menu}
                </ListItem>
              })}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Layout>)
}
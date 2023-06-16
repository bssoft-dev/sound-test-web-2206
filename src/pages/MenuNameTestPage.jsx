import { useEffect, useRef, useState } from "react";
import { useCtx } from "../context/Context";
import Layout from "../components/Layout/Layout";
import WaveSurfer from "wavesurfer.js";
import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js";
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, IconButton, List, ListItem, Typography, cardHeaderClasses } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { grey } from "@mui/material/colors";

const menuList = ['아메리카노', '올타임콜드브루', '(1호점)신촌커피', '카페라떼', '바닐라 카페라떼', '카페모카', '카라멜 마끼아또', '스페니쉬 연유 카페라떼', '달고나 카페라떼', '콜드브루', '딸기 젤리 밀크티', '23수박주스', '아인슈페너 프라페', '스트로베리 초콜릿 프라페', '요거트 프라페', '블루밍 파인애플 라씨', '20곡 오틀리 라떼', '베이컨 체다 베이글', '멕시칸 파니니', '바베큐치킨 파니니', '떠먹는 티라미수', '떠먹는 아이스 박스', 'P. 뉴욕치즈', 'P. 클래식 가토 쇼콜라', 'P. 레드 벨벳', 'P. 퀸즈 캐롯', '초콜릿 크로캉 롱 슈', '황치즈 마카롱', '청포도 요거트 마카롱', '산딸기 마카롱', '블루베리 마카롱', '벨지안 초콜릿 마카롱']

const useStyles = makeStyles(theme => ({
  waveWrap: {
      width: 500,
      height: 180, 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      backgroundColor:'#FBF0E0',
      overflow: 'hidden'
  },
  recordWave: {
    width: 400,
    height: 100
  }
}));

const StyledCardHeader = styled(CardHeader)(({theme}) => ({
  [`& .MuiTypography-root`]: {
    textAlign: 'center', 
    fontWeight: 700, 
    fontSize: 22
  }
}));

export default function MenuNameTestPage() {
  const context = useCtx();
  const classes = useStyles();
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

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
        backgroundColor:'#FBF0E0',
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
      flexDirection={{xs: 'column', md: 'row'}}
      sx={{ height: {md: '100%'}}}>
        <Grid item xs={12} md={6}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3}}>
          <Card sx={{flex: 1}}>
            <StyledCardHeader title="메뉴선택 테스트" />
            <Divider />
            <CardContent>
              <Grid className={classes.waveWrap}>
                <Grid id="waveform" className={classes.recordWave} ref={waveformRef}></Grid>
              </Grid>
              <button onClick={handleClick}>Toggle Microphone</button>  
            </CardContent>
          </Card>
          <Card sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            <StyledCardHeader title="인식결과" />
            <Divider />
            <CardContent sx={{p: {md: '28px'}}}>
              <Typography fontSize={{md: '2.5rem'}}
                fontWeight={500} lineHeight={1.4}
                sx={{color: '#FF8A00'}} >
                메뉴선택
              </Typography>
              <Typography fontSize={{md: '2.5rem'}}
                fontWeight={500} lineHeight={1.4} >
                아메리카노
              </Typography>
              <Typography fontSize={{md: '2.5rem'}}
                fontWeight={500} lineHeight={1.4} >
                떠먹는 티라미수
              </Typography>
            </CardContent>
            <CardActions sx={{mt: 'auto', justifyContent: 'space-between', pl: {xs: 2, md: '28px'}, pr: {md: '20px'}}}>
              <Typography color="#adadad" fontWeight={500}
                sx={{fontSize: {md: '18px'}}}>글자수 체크</Typography>
              <IconButton >
                <RefreshRoundedIcon fontSize={"large"} sx={{color: '#FF8A00'}} />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{height: {md: '100%'}}}>
            <StyledCardHeader title="메뉴" />
            <Divider />
            <CardContent sx={{p: {md: 3}}}>
              <List sx={{columnCount: 2, maxWidth: 'calc(100% -80px)'}}>
                {menuList.map((menu, index) => {
                  return <ListItem key={index}
                    sx={{display: 'list-item', listStyleType: 'disc', listStylePosition: 'inside', 
                      fontSize: {md: '1.2rem'}, py: '10px', px: {xs: 0, md: 2}}}>
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
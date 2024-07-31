import React, { useEffect, useRef, useState } from "react";
import AudioRecorder from "../AudioRecorder/AudioRecorder";
import WaveSurfer from "wavesurfer.js";
import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js";
import { Box, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { StyledCardHeader, recorderParams } from "../../pages/CafeOrderTestPage";
import { makeStyles } from "@mui/styles";
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

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
      '@media (max-width: 1200px)': {
        fontSize: '1.8rem !important',
      },
      '@media (max-width: 600px)': {
        fontSize: '1.4rem !important',
      },
    },
    recordIconHide: {
      fontSize: '0 !important',
    },
}));

export default function CafeOrderRecord({ handleDataUpdate }) {
    const classes = useStyles();
    
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [recording, setRecording] = useState(false);
  

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

    return(
        <Card sx={{ flex: {xs: 2, md: 5, lg: 4}, display: 'flex', flexDirection: 'column' }}>
          <StyledCardHeader title="한 문장 주문 테스트" />
          <Divider />
          <CardContent
            sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: { xs: 1, md: 2 }, pb: {xs: '16px !important', lg: '24px !important'} }}>
              <Box
                sx={{ mb: {xs: 1, lg: 2}, px: {md: 1}, alignSelf: 'flex-start'}}>
                <Box sx={{mb: {xs: '4px', lg: 1}}}>
                  <Typography variant="button" color="text.secondary"
                    sx={{lineHeight: 1.2}}> 테스트 예시: </Typography>
                  <Typography fontWeight={500} fontSize={{xs: 14, lg: 16}}
                    sx={{ml: {md: 1}, color: '#FF8A00', lineHeight: 1.2}}>"신촌커피 레귤러랑 달고나 카페라떼 아이스로 라지 두 잔하고, 멕시칸 파니니 세개 테이크아웃 해주세요"</Typography>
                </Box>
                <Box>
                  <Typography variant="button" color="text.secondary"
                    sx={{lineHeight: 1.2}}> 제한 사항: </Typography>
                  <Typography fontWeight={500} fontSize={{xs: 14, lg: 16}}
                    sx={{ml: {md: 1}, color: '#FF8A00', lineHeight: 1.2}}>"두 문장 이상의 주문, 메뉴에 없는 주문은 테스트 불가능합니다."</Typography>
                </Box>
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
              btnStyle={{ borderRadius: '50%', width: { xs: '3rem', lg: '5rem' }, minWidth: 'fit-content', height: { xs: '3rem', lg: '5rem' }, mt: 'auto' }} />
          </CardContent>
        </Card>
    )
}
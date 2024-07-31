import { Box, Grid, IconButton, Typography } from "@mui/material";
import React, { useEffect, useLayoutEffect } from "react";
import { shallow } from 'zustand/shallow';
import { grey, red } from "@mui/material/colors";
import { makeStyles } from "@mui/styles";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useTimerStore } from "../../stores/useTimerStore";

const useStyles = makeStyles(theme => ({
  recording: {
    color: red[500],
    transition: ".2s",
    animation: '$blink .7s infinite'
  },
  '@keyframes blink': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.7 },
    '100%': { opacity: 1}
  },
  resetBtn: {
      transition: "0.3s",
      animation: '$fadeIn 1s',
      marginBottom: '-4%',
      '@media (max-width:600px)': {
        width: 30,
        height: 30
      }
  },
  '@keyframes fadeIn': {
    from: { opacity: 0},
    to: { opacity: 1},
  },
}))

export default function Timer() {
  const { isRunning , setIsRunning, timer, increaseTimer, setTimer } = useTimerStore(
    state => ({
      isRunning: state.isRunning, 
      setIsRunning: state.setIsRunning,
      timer: state.timer, 
      increaseTimer: state.increaseTimer,
      setTimer: state.setTimer,
    }), shallow
  );
  const classes = useStyles();
  const fontSize = window.innerWidth> 600 ? 'h4' : 'h5'

  useLayoutEffect(() => {
    setTimer(0)
  }, []);

  useEffect(() => {
      let intervaltimer;
  
      if (isRunning) {
        intervaltimer = setInterval(() => {
          increaseTimer();
        }, 10);
      } else {
          setIsRunning(false);
      }
  
      return () => {
        clearInterval(intervaltimer);
      };
  }, [isRunning]);

  const formatTime = time => {
      const milliseconds = Math.floor((time % 1000) / 10).toString().padStart(2, '0');
      const seconds = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
      const minutes = Math.floor((time / (1000 * 60)) % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}.${milliseconds}`;
  };
  
  return (<Grid container
    justifyContent='center' alignItems="center"
    sx={{position: 'relative', width: 'fit-content'}}>
    <Typography variant={fontSize} 
        color="text.secondary" fontWeight={200} textAlign="center">
          <Box component="span" 
            className={isRunning && classes.recording}
            sx={{ fontSize: '1.2em', color: grey[500] }}
            >•</Box>
        {formatTime(timer)}
    </Typography>
    {(!isRunning && timer) ? (
      <IconButton className={classes.resetBtn}
          onClick={() => setTimer(0)}
          color="Secondary">
          <RestartAltIcon />
      </IconButton>
    ) : ''}
  </Grid>)
}
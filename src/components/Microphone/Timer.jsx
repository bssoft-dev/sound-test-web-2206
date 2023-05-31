import { Typography } from "@mui/material";
import { MicrophoneContext } from "./Microphone";
import { useContext, useEffect, useState } from "react";

export default function Timer() {
    const microphoneContext = useContext(MicrophoneContext);
    const { isRunning , setIsRunning } = microphoneContext;

    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let intervaltimer;
    
        if (isRunning) {
          intervaltimer = setInterval(() => {
            setTimer(prev => prev + 10);
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
    
    return (<Typography variant="h4" 
        color="text.secondary" fontWeight={200} textAlign="center">
        {formatTime(timer)}
    </Typography>)
}
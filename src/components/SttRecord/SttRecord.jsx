import { RecordCtx } from "../../context/RecordContext";
import ReactMicComp from "../ReactMicComp/ReactMicComp";
import { Grid, IconButton } from "@mui/material";
import { shallow } from "zustand/shallow";

import StopIcon from "@mui/icons-material/Stop";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { grey } from "@mui/material/colors";
import { useCtx } from "../../context/Context";
import { useEffect, useState } from "react";
import { useTimerStore } from "../../stores/useTimerStore";

export default function SttRecord() {
    const context = useCtx();
    const { setLoading } = context;
    const { setIsRunning, setTimer }  = useTimerStore(
        state => ({ 
          setIsRunning: state.setIsRunning,
          setTimer: state.setTimer,
        }), shallow
    );
    const recordContext = RecordCtx();
    const { record, setRecord, tempFile, setTempFile } = recordContext;

    const uploadTemplFile = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append(
            "file",
            tempFile.blob
            // tempFile.stopTime
        );
        console.log('formData', formData);
        console.log(formData.get('file'), '확인용');
        for (var value of formData.values()){
            console.log('formData',value)
        }
        // response 전송 받으면 loading false
        // response.data -> result가 메세지
        setTimeout(() => {
            setLoading(false);
        }, 2000)
    }

    useEffect(()=> {
        if(tempFile) {
            
            uploadTemplFile();
        }
    }, [tempFile])

    const startRecording = () => {
        setTempFile(null);
        setRecord(true);
        setIsRunning(true);
    };

    const stopRecording = () => {
        setRecord(false);
        setIsRunning(false);
        setTimer(0);
        console.log('stop');
    };

    return (
        <Grid container justifyContent="center"
            spacing={1} sx={{ml: 0, pt: 3}}>
            <Grid container 
                justifyContent="center" position="relative"
                sx={{ backgroundColor: '#fff', mb: 2 }}>
                {!record && (
                    <Grid item>
                        <IconButton aria-label="녹음"
                        sx={{border: '1px solid', borderColor: grey[300], p: 0 }}
                            onClick={startRecording}>
                            <FiberManualRecordIcon fontSize="large" color="error" />
                        </IconButton>
                    </Grid>
                )}

                {record && (
                <Grid item>
                    <IconButton aria-label="중지"
                    sx={{border: '1px solid', borderColor: grey[300], p: 0 }}
                    onClick={stopRecording}>
                    <StopIcon fontSize="large" />
                    </IconButton>
                </Grid>
                )}
            </Grid>
            <ReactMicComp />
        </Grid>
    )
}
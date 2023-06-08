import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import axios from 'axios'
import { RecordCtx } from "../../context/RecordContext";
import { TimerCtx } from "../../context/TimerContext";
import { useCtx } from "../../context/Context";
import RecordDialog from "./RecordDialog";
import { Button } from "@mui/material";

export const MicrophoneContext = createContext();

export default function Microphone() {
  const context = useCtx();
  const {setAlert, pushFile} = context;
  const timerContext = TimerCtx();
  const {isRunning, setIsRunning} = timerContext;
  const recordContext = RecordCtx();
  const { setRecord, tempFile, setTempFile } = recordContext;

  const wavesurfer = useRef(null);
  const [open, setOpen] = React.useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(()=> {}, )

  const togglePlayback = () => {
    if (!isPlaying) {
      wavesurfer.current.play();
    } else {
      wavesurfer.current.pause();
    }
  };

  const stopPlayback = () => wavesurfer.current.stop();

  const uploadTemplFile = (tempFile) => {
    const formData = new FormData();
    formData.append(
      "file",
      tempFile.blob
      // tempFile.stopTime
    );
    console.log('formData', formData);
    console.log(formData.get('file'), '확인용');
    // for (var value of formData.values()){
    //   console.log('formData',value)
    // }
    axios({
      url: `https://sound.bs-soft.co.kr/analysis/stt/blob`,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => {
      console.log(response);
      if(response.status != 200) {
        setAlert({
          open: true, 
          type: "warning",
          message: "파일을 다시 확인해주세요."
        });
      }
      setAlert({
        open: true, 
        type: "success",
        message: "업로드를 완료하였습니다."
      });
      console.log('response status: ', response.data);
    })
    .catch((error) => {
      setAlert({
        open: true, 
        type: "error",
        message: "업로드를 실패하였습니다. 파일을 다시 확인해주세요."
      });
      console.log(error);
    })
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleDone = () => {
    if (tempFile) {
      uploadTemplFile(tempFile);
      console.log('fighting')
      pushFile(tempFile);
      setTempFile(null);
      setRecord(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setRecord(false);
    setTempFile(null);
    setOpen(false);
  };

  const startRecording = () => {
    setTempFile(null);
    setRecord(true);
    setIsRunning(true);
  };

  const stopRecording = () => {
    setRecord(false);
    setIsRunning(false);
  };

  const restartRecording = () => {
    setTempFile(null);
    setRecord(false);
  }


  return (
      <MicrophoneContext.Provider value={{
      isPlaying, open,
      wavesurfer, setPlayerReady, setIsPlaying,
      togglePlayback, stopPlayback, handleDone, handleCancel,
      startRecording, stopRecording, restartRecording,
      isRunning, setIsRunning
    }}>
      <Button variant="outlined" color="error"
        onClick={handleClickOpen}
        sx={{marginLeft: 2, boxShadow: 1}}>
        녹음하기
      </Button>
      <RecordDialog />
    </MicrophoneContext.Provider>
  );
}

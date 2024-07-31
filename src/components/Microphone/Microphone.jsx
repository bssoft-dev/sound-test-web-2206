import React, { createContext,  } from "react";
import axios from 'axios'
import RecordDialog from "./RecordDialog";
import { Button } from "@mui/material";
import { useTimerStore } from "../../stores/useTimerStore";
import { shallow } from "zustand/shallow";
import { useRecordStore } from "../../stores/useRecordStore";
import { useStore } from "../../stores/useStore";

export const MicrophoneContext = createContext();

export default function Microphone() {
  const { setAlert, pushFile, setLoading } = useStore(
    state => ({
      setAlert: state.setAlert, 
      pushFile: state.pushFile, 
      setLoading: state.setLoading
    }), shallow
  );
  const { setTimer, setIsRunning } = useTimerStore(
    state => ({
      setTimer: state.setTimer, 
      setIsRunning: state.setIsRunning,
    }), shallow
  );
  const { setRecord, tempFile, setTempFile, setOpen,  } = useRecordStore(
    state => ({
      setRecord: state.setRecord, 
      tempFile: state.tempFile, 
      setTempFile: state.setTempFile,
      setOpen: state.setOpen, 
    }), shallow
  );

  const uploadTemplFile = (tempFile) => {
    console.log(tempFile);
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
    axios({
      url: `https://sound.bs-soft.co.kr/analysis/uploadBlob`,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => {
      setLoading(false);
      setOpen(false);
      if(response.status !== 200) {
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

  const handleDone = () => {
    if (tempFile) {
      uploadTemplFile(tempFile);
      console.log('fighting')
      pushFile(tempFile);
      setTempFile(null);
      setRecord(false);
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
    setTimer(0);
  };

  const restartRecording = () => {
    setTempFile(null);
    setRecord(false);
  }


  return (
    <MicrophoneContext.Provider value={{
      handleDone, handleCancel,
      startRecording, stopRecording, restartRecording,
    }}>
      <Button variant="outlined" color="error"
        onClick={() => setOpen(true)}
        sx={{marginLeft: {xs: 1, sm: 2}, boxShadow: 1}}>
        녹음하기
      </Button>
      <RecordDialog />
    </MicrophoneContext.Provider>
  );
}

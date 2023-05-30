import React, { useState, useRef, useEffect, createContext } from "react";
import axios from 'axios'
import RecordDialog from "./RecordDialog";
import { useCtx } from "../../context/Context";
import { Button } from "@mui/material";

export const MicrophoneContext = createContext();

export default function Microphone() {
  const context = useCtx();
  const {pathname, setIsAlert, pushFile} = context;

  const wavesurfer = useRef(null);
  const [record, setRecord] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [tempFile, setTempFile] = React.useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloadLinkURL, setDownloadLinkURL] = useState(null);

  useEffect(() => {
    console.log("tempFile", tempFile);
    if (tempFile) {
      wavesurfer.current.load(tempFile.blobURL);
    }
  }, [tempFile]);

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
      url: `http://172.30.1.17:22104/v1/upload-raw/test`,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => {
      if(response.status != 200) {
        setIsAlert({
          open: true, 
          type: "warning",
          message: "파일을 다시 확인해주세요."
        });
      }
      setIsAlert({
        open: true, 
        type: "success",
        message: "업로드를 완료하였습니다."
      });
      console.log('response status: ', response.data);
    })
    .catch((error) => {
      setIsAlert({
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
  };

  const stopRecording = () => {
    setRecord(false);
  };

  const restartRecording = () => {
    setTempFile(null);
    setRecord(false);
  }

  const onData = recordedBlob => {
    console.log("chunk of real-time data is: ", recordedBlob); // 'audio/ogg'
  };

  const onStop = recordedBlob => {
    setTempFile(recordedBlob); // 'audio/wav'
  };

  const onSave = recordedBlob => {
    setDownloadLinkURL(recordedBlob.blobURL);
  }
  
  if(!(pathname === '/sound-test')) return '';

  return (
    <MicrophoneContext.Provider value={{
      record, tempFile, isPlaying, downloadLinkURL, open,
      wavesurfer, onStop, onData, onSave, setPlayerReady, setIsPlaying,
      togglePlayback, stopPlayback, handleDone, handleCancel,
      startRecording, stopRecording, restartRecording
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

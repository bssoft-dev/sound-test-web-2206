import { useContext } from "react";
import { MicrophoneContext } from "./Microphone";

import { Button, Grid, IconButton } from "@mui/material";
import StopIcon from "@mui/icons-material/Stop";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { grey } from "@mui/material/colors";

export default function ButtonWrap() {
  const microphoneContext = useContext(MicrophoneContext);
  const {record, tempFile, isPlaying, downloadLinkURL, startRecording, stopRecording, restartRecording, togglePlayback, stopPlayback, handleDone} = microphoneContext;

  return (<>
    {!record && !tempFile && (
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

    {!record && tempFile && (
      <Grid container justifyContent="space-between">
        <Button onClick={restartRecording} 
          aria-label="취소"
          color="inherit" >
          취소
        </Button>

        <Grid item>
          {!isPlaying ? (
            <IconButton onClick={togglePlayback}
              aria-label="재생">
              <PlayArrowIcon />
            </IconButton>
          ) : (
            // pause
            <IconButton onClick={togglePlayback}
              aria-label="일시정지">
              <PauseIcon />
            </IconButton>
          )}
          <IconButton onClick={stopPlayback}
            aria-label="정지">
            <StopIcon />
          </IconButton>
        </Grid>

        {/* 확인 */}
        <Button onClick={handleDone}
          aria-label="저장">
          저장
        </Button>
        {/* <Button>
          <a href={downloadLinkURL} download="recording.wav">
            다운
          </a>
        </Button> */}
      </Grid>
    )}
  </>)
}
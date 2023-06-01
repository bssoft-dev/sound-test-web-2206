import { useContext } from "react";
import { MicrophoneContext } from "./Microphone";
import { ReactMic } from "react-mic";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Timer from "../Timer/Timer";

const useStyles = makeStyles(theme => ({
    reactmic: {
      width: "100%",
      height: 150, 
    }
  }));
  
export default function ReactMicComp() {
    const classes = useStyles();
    const microphoneContext = useContext(MicrophoneContext);
    const {record, onSave, onStop, onData} = microphoneContext;

    return (<Box sx={{width: '90%', mx: 'auto', mt: 3}}>
      <Timer />
      <ReactMic
        record={record}
        className={classes.reactmic}
        onStop={onStop}
        onSave={onSave}
        onData={onData}
        mimeType='audio/wav'
        channelCount={2}
        strokeColor="grey"
    />
  </Box>)
}
import { ReactMic } from "react-mic";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Timer from "../Timer/Timer";
import { useRecordStore } from "../../stores/useRecordStore";
import { shallow } from "zustand/shallow";

const useStyles = makeStyles(theme => ({
    reactmic: {
      width: "100%",
      height: 100, 
    }
  }));
  
export default function ReactMicComp() {
    const classes = useStyles();
    const {record, onSave, onStop, onData} = useRecordStore(
      state => ({
        record: state.record,
        onSave: state.onSave, 
        onStop: state.onStop, 
        onData: state.onData,
      }), shallow
    );

    return (<Grid container justifyContent="center"
      sx={{width: '90%', mx: 'auto', mt: 3}}>
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
  </Grid>)
}
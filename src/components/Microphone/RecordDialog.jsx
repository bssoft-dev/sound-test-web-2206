import React, { useContext } from "react";
import ReactMicComp from "../ReactMicComp/ReactMicComp";
import ButtonWrap from "./ButtonWrap";
import { RecordCtx } from "../../context/RecordContext";
import RecordWaveSurfer from "../WaveSurferComp/RecordWaveSurfer";

import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Slide } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from "@mui/styles";
import { MicrophoneContext } from "./Microphone";
import Loading from "../Loading/Loading";

const useStyles = makeStyles(theme => ({
    flex: {
      flex: 1, 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }, 
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function RecordDialog() {
    const classes = useStyles();

    const microphoneContext = useContext(MicrophoneContext);
    const {open, handleCancel, loading} = microphoneContext;
    const recordContext = RecordCtx();
    const { tempFile } = recordContext;

    return (<Dialog 
        fullWidth
        maxWidth="sm" 
        TransitionComponent={Transition}
        open={open} 
        // onClose={handleCancel}
      >
        <DialogTitle component="div"
          className={classes.flex}>
          녹음하기
            <IconButton onClick={handleCancel}
              sx={{ mr: '-12px' }}>
              <CloseIcon />
            </IconButton>
        </DialogTitle>

        <DialogContent sx={{py: 3}}>
          {loading ? 
            <Loading /> : (
            tempFile ? <RecordWaveSurfer /> : <ReactMicComp />
          )}
        </DialogContent>
        <DialogActions
          sx={{py: 2, justifyContent: 'center'}}>
          <ButtonWrap />
        </DialogActions>
      </Dialog>)
}
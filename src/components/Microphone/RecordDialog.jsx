import React, { useContext } from "react";
import WaveSurferComp from "./WaveSurferComp";
import ReactMicComp from "./ReactMicComp";
import ButtonWrap from "./ButtonWrap";
import { MicrophoneContext } from "./Microphone";

import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Slide } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from "@mui/styles";

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
    const {tempFile, open, handleCancel} = microphoneContext;

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
          {tempFile ? <WaveSurferComp /> : <ReactMicComp />}
        </DialogContent>
        <DialogActions
          sx={{py: 2, justifyContent: 'center'}}>
          <ButtonWrap />
        </DialogActions>
      </Dialog>)
}
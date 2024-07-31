import React from "react";
import { Grid, IconButton } from "@mui/material";

import StopIcon from "@mui/icons-material/Stop";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { grey } from "@mui/material/colors";
import { useStreamStore } from "../../stores/useStreamStore";
import { shallow } from "zustand/shallow";

export default function ButtonWrap() {
    const { status, controlAudio } = useStreamStore(
        state => ({
            status: state.status, 
            controlAudio: state.controlAudio
        }), shallow
    );
    
    return(<Grid position="relative"
        sx={{ backgroundColor: '#fff'}}>
        {status !== "recording" && (
            <IconButton aria-label="녹음"
                sx={{border: '1px solid', borderColor: grey[300], p: 0 }}
                onClick={() => controlAudio("recording")}>
                <FiberManualRecordIcon fontSize="large" color="error" />
            </IconButton>)}
        {status === "recording" && (
            <IconButton aria-label="중지"
                sx={{border: '1px solid', borderColor: grey[300], p: 0 }}
                onClick={() => controlAudio("inactive")}>
                <StopIcon fontSize="large" />
            </IconButton>
            // <Button color="inherit" variant="contained"
            //     onClick={() => controlAudio("paused")}>
            //     일시 정지
            // </Button>
        )}
    </Grid>)
}
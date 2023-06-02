import { Box, Button, Grid, IconButton } from "@mui/material";

import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { makeStyles } from "@mui/styles";
import { grey } from "@mui/material/colors";

export default function ButtonWrap({ status, controlAudio }) {
    
    return(<Grid container 
        justifyContent="center" position="relative"
        sx={{ backgroundColor: '#fff', order: -1 }}>
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
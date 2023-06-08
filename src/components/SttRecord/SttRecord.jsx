
import { TimerCtx } from "../../context/TimerContext";
import { RecordCtx } from "../../context/RecordContext";
import ReactMicComp from "../Microphone/ReactMicComp";
import { Grid, IconButton } from "@mui/material";

import StopIcon from "@mui/icons-material/Stop";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { grey } from "@mui/material/colors";

export default function SttRecord() {
    const timerContext = TimerCtx();
    const {isRunning, setIsRunning} = timerContext;
    const recordContext = RecordCtx();
    const { record, setRecord, tempFile, setTempFile } = recordContext;

    const startRecording = () => {
        setTempFile(null);
        setRecord(true);
        setIsRunning(true);
    };

    const stopRecording = () => {
        setRecord(false);
        setIsRunning(false);
    };

    return (
        <Grid container justifyContent="center"
            spacing={1} sx={{ml: 0, pt: 3}}>
            {!record && (
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
            <ReactMicComp />
        </Grid>
    )
}
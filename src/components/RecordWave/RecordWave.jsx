import { Grid } from "@mui/material";

export default function RecordWave({ waveformRef }) {
  return(
    <Grid className={classes.waveWrap}>
      <Grid id="waveform" className={classes.recordWave} ref={waveformRef}></Grid>
    </Grid>
  )
}
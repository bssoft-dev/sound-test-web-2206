import { makeStyles } from "@mui/styles";
import { MicrophoneContext } from "./Microphone";
import WaveSurfer from "wavesurfer.js";

import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import { useContext, useEffect } from "react";
import { Box } from "@mui/material";
import { red } from "@mui/material/colors";

const useStyles = makeStyles(theme => ({
    wavesurferWrap: {
      transition: "0.3s",
      animation: '$fadeIn 2s',
    },
    wavesurfer: {
      width: "100%"
    },
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
}));

export default function WaveSurferComp() {
  const classes = useStyles();
  const microphoneContext = useContext(MicrophoneContext);
  const {wavesurfer, open, tempFile, setPlayerReady, setIsPlaying} = microphoneContext;

  useEffect(() => {
      if (!open || (open && !tempFile)) return;
  
      wavesurfer.current = WaveSurfer.create({
        container: "#wavesurfer-id",
        waveColor: "grey",
        progressColor: red['A200'],
        height: 140,
        cursorWidth: 1,
        cursorColor: "lightgrey",
        // barWidth: 2,
        normalize: true,
        responsive: true,
        fillParent: true,
        splitChannels: true,
        plugins: [
          TimelinePlugin.create({
              container: "#wavesurfer-id-timeline"
          })
        ]
      });
  
      wavesurfer.current.on("ready", () => {
        setPlayerReady(true);
      });
  
      const handleResize = wavesurfer.current.util.debounce(() => {
        wavesurfer.current.empty();
        wavesurfer.current.drawBuffer();
      }, 150);
  
      wavesurfer.current.on("play", () => setIsPlaying(true));
      wavesurfer.current.on("pause", () => setIsPlaying(false));
      window.addEventListener("resize", handleResize, false);
    }, [open, tempFile]);

  return (
      <Box className={classes.wavesurferWrap}
          sx={{mt: 3}}>
          <Box className={classes.wavesurfer} id="wavesurfer-id" />
          <Box id="wavesurfer-id-timeline" />
      </Box>
  );
}
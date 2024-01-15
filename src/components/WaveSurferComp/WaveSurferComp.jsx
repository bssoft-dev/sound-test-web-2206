import { useContext, useEffect, useRef, useState } from "react";
import { StreamCtx } from "../../context/StreamContext";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";

import { makeStyles } from "@mui/styles";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { red, grey } from "@mui/material/colors";

import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

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

export default function WaveSurferComp({ tempFile }) {
  const wavesurfer = useRef(null);
  const classes = useStyles();
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [regions, setRegions] = useState([ ]);
  const setRegion = region => setRegions([region]);

  const togglePlayback = () => {
    if (!isPlaying) {
      wavesurfer.current.play();
    } else {
      wavesurfer.current.pause();
    }
  };

  const height = window.innerWidth > 600 ? 140 : 100;

  const stopPlayback = () => wavesurfer.current.stop();

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: "#wavesurfer-id",
      waveColor: "grey",
      progressColor: red['A200'],
      backgroundColor: grey[50],
      height: height,
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
        }),
        RegionsPlugin.create({
          regions: regions
        })
      ]
    });

    const handleResize = wavesurfer.current.util.debounce(() => {
      wavesurfer.current.empty();
      wavesurfer.current.drawBuffer();
    }, 150);

    wavesurfer.current.on("ready", () => {
      setPlayerReady(true);
    });

    wavesurfer.current.on("play", () => setIsPlaying(true));
    wavesurfer.current.on("pause", () => setIsPlaying(false));
    
    wavesurfer.current.on("region-update-end", () => {
      setRegion({
        id: 'region-1',
        start: wavesurfer.current.regions.list["region-1"].start,
        end: wavesurfer.current.regions.list["region-1"].end,
      });
    });

      window.addEventListener("resize", handleResize, false);
    }, []);

    useEffect(() => {
      console.log("tempFile", tempFile);
      if (tempFile != null && wavesurfer.current != null) {
        wavesurfer.current.load(tempFile.blobURL);
      }
    }, [tempFile, wavesurfer.current]);

    
  useEffect(() => {
    wavesurfer.current.clearRegions();
    wavesurfer.current.addRegion(regions[0]);
  }, [regions]);

  return (<>
    <Grid>
      <Typography>
        {tempFile ? tempFile.reckey : 'Audio reckey'}
      </Typography>
    </Grid>
    <Grid className={classes.wavesurferWrap}
        sx={{my: 1}}>
        <Box className={classes.wavesurfer} id="wavesurfer-id" />
        <Box id="wavesurfer-id-timeline" />
    </Grid>
    <Grid container justifyContent="space-between">
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
    </Grid>
  </>
  );
}
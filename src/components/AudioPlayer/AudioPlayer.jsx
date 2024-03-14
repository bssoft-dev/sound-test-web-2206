/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min";
import {v4 as uuidv4} from "uuid";

import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PlayArrowIconOutlined from "@mui/icons-material/PlayArrowOutlined";
import StopIcon from "@mui/icons-material/Stop";
import PauseIcon from "@mui/icons-material/Pause";
// import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
// import ShareIcon from "@mui/icons-material/Share";
// import FavoriteIcon from "@mui/icons-material/Favorite";

import { red } from "@mui/material/colors";
import { useStore } from "../../stores/useStore";
import { shallow } from "zustand/shallow";
import { Typography } from "@mui/material";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: '100%',
    minWidth: 240,
    marginBottom: 16,
    transition: "0.3s",
    boxShadow: 1,
    width: "100%",
    animation: '$fadeIn 2s',
  },
  media: {
    width: "100%"
  },
  list: {
    padding: 0
  },
  listItem: {
    //paddingBottom: 0
    flexDirection: "column",
  },
  buttons: {
    padding: 1
  },
  controls: {
    minWidth: "100px"
  },
  icon: {
    height: 18,
    width: 18
  },
  avatar: {
    display: "inline-block"
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
}));

export default function AudioPlayer({ file }) { 
  const { regions, setRegion } = useStore(
    state => ({
      regions: state.regions, 
      setRegion: state.setRegion
    }), shallow
  );
  const classes = useStyles();

  const wavesurfer = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const wavesurferId = `wavesurfer--${uuidv4()}`;

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: `#${wavesurferId}`,
      waveColor: "grey",
      progressColor: red['A200'],
      height: 70,
      cursorWidth: 2,
      cursorColor: "lightgray",
      normalize: true,
      responsive: true,
      fillParent: true,
      plugins: [
        TimelinePlugin.create({
          container: `#${wavesurferId}-timeline`
        }),
        CursorPlugin.create({
          showTime: true,
          opacity: 1,
          customShowTimeStyle: {
              'background-color': '#000',
              color: '#fff',
              padding: '2px',
              'font-size': '10px'
          }
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
    wavesurfer.current.on("region-play", () => setIsPlaying(true));
    wavesurfer.current.on("region-pause", () => setIsPlaying(false));
    
    // 개별 region 변경 시 글로벌 region도 변경
    wavesurfer.current.on("region-update-end", () => {
      setRegion({
        id: 'region-1',
        start: wavesurfer.current.regions.list["region-1"].start,
        end: wavesurfer.current.regions.list["region-1"].end,
        color: "rgba(144, 202, 249, 0.3)"
      });
    });

    window.addEventListener("resize", handleResize, false);

    // return () => {
    //   window.removeEventListener('resize', handleResize, false);
    // };
  }, []);

  useEffect(() => {
    if (file) {
      wavesurfer.current.load(file.blobURL);
    } else {
      const wav = require("../../static/blob.wav");
      wavesurfer.current.load(wav);
    }
  }, [file]);

  // 글로벌 region 변경 시 개별 region도 변경
  useEffect(() => {
      wavesurfer.current.clearRegions();
      wavesurfer.current.addRegion(regions[0]);
  }, [regions]);

  const togglePlayback = () => {
    if (!isPlaying) {
      wavesurfer.current.play();
    } else {
      wavesurfer.current.pause();
    }
  };
  
  const stopPlayback = () => wavesurfer.current.stop();

  let transportPlayButton;

  if (!isPlaying) {
    transportPlayButton = (
      <IconButton onClick={togglePlayback}>
        <PlayArrowIcon className={classes.icon} />
      </IconButton>
    );
  } else {
    transportPlayButton = (
      <IconButton onClick={togglePlayback}>
        <PauseIcon className={classes.icon} />
      </IconButton>
    );
  }
  
  const toggleRegionPlayback = () => {
    if (!isPlaying) {
      console.log(wavesurfer.current.regions.list)
      wavesurfer.current.regions.list["region-1"].play();
    } else {
      wavesurfer.current.pause();
    }
  };

  let transportRegionPlayButton;

  if (!isPlaying) {
    transportRegionPlayButton = (
      <IconButton onClick={toggleRegionPlayback}>
        <PlayArrowIconOutlined className={classes.icon} />
      </IconButton>
    );
  } else {
    transportRegionPlayButton = (
      <IconButton onClick={toggleRegionPlayback}>
        <PauseIcon className={classes.icon} />
      </IconButton>
    );
  }

  return (
    <>
      <Card className={classes.card} 
        sx={{ "&:hover": { boxShadow: 3 } }}>
        <Grid container direction="column">
          <Grid item>
            <List className={classes.list}>
              <ListItem alignItems="flex-start" className={classes.listItem}>
                <ListItemText sx={{mb: 0}}
                  primary={file === null ? "Example" : file.title}
                  secondary={file === null ? "This is an example wave file" : file.name}
                />
                {file === null && !file?.ttsText ? 
                  <></>
                  :
                  <Typography variant="body2" color="text.secondary" gutterBottom >
                    {file?.ttsText}
                  </Typography>
                }
              </ListItem>
            </List>
          </Grid>
          <Grid item id={wavesurferId} />
          <Grid item id={wavesurferId+"-timeline"} />
          <Grid item container justifyContent='center' className={classes.buttons}>
            {/* <Grid item xs={5}> */}
            <Grid item>
              {transportPlayButton}
              {transportRegionPlayButton}
              <IconButton onClick={stopPlayback}>
                <StopIcon className={classes.icon} />
              </IconButton>
            </Grid>
            {/* <Grid item xs={50}>
              [
              {transportRegionPlayButton}
              <IconButton onClick={stopPlayback}>
                <StopIcon className={classes.icon} />
              </IconButton>
              ]
            </Grid> */}
            {/* <Grid item xs={7} container justify="space-around">
              <Grid item>
                <IconButton>
                  <FavoriteIcon
                    style={{ color: blue[500] }}
                    className={classes.icon}
                  />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton>
                  <ShareIcon
                    style={{ color: red[500] }}
                    className={classes.icon}
                  />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton>
                  <ChatBubbleIcon
                    style={{ color: green[500] }}
                    className={classes.icon}
                  />
                </IconButton>
              </Grid>
            </Grid> */}
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

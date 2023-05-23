import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: 2
  },
  title: {
    flexGrow: 1
  }
}));


export default function NavBar({fetchData}) {
  const classes = useStyles();

	const uploadHandler = (event) => {
    const formData = new FormData();
    // Array.from(event.target.files).forEach((file, i) => {
    //   formData.append('files', file);
    // });
    console.log(event.target.files[0]);
    formData.append('file', event.target.files[0]);
    axios({
      url: `http://sound.bs-soft.co.kr/analysis/uploadFile`,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      alert('업로드를 완료하였습니다.');
      fetchData()
    }).catch(err => {
      alert('업로드를 실패하였습니다. 파일을 다시 확인해주세요.');
    });
	};

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" className={classes.title}>
            사운드 처리 테스트
          </Typography>
          <Button variant="contained" component="label" color="secondary">
            파일업로드
            <input type="file" style={{ display: "none" }} onChange={uploadHandler} hidden multiple/>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

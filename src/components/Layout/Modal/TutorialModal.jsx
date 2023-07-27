import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Tooltip } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { green, grey } from "@mui/material/colors";
import { useCtx } from '../../../context/Context';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TutorialModal() {
  const context = useCtx();
  const { serverHealth, setServerHealth, pathname, version, setVersion } = context;
  const [open, setOpen] = useState(false);
  
  // health check
  const getServerHealth = (baseUrl) => {
    axios.get(baseUrl)
      .then((response)=> {
        if(response.status === 200) {
            setServerHealth(true);
            setVersion(response.data.version ? response.data.version : null);
        }else {
          setServerHealth(false);
          setVersion(null);
        }
    })
    .catch((error)=> {
        console.log(error);
        setServerHealth(false);
        setVersion(null);
    })
  }
  const handleOpen = async () => {
    console.log(pathname)
    let res = null;
    switch(pathname) {
      case '/menu-test':
        getServerHealth('https://stt-cafe.bs-soft.co.kr/v1/version/menu')
        break;
      case '/audio-test':
        getServerHealth('https://api-2035.bs-soft.co.kr/')
        break;
      case "/sound-test":
        getServerHealth('https://sound.bs-soft.co.kr/status');
        break;
      case "/bss-test":
        getServerHealth('https://bss.bs-soft.co.kr/status');
        break;
      default:
        setServerHealth(false);
        setVersion(false);
    }
    setOpen(true)
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="도움말">
        <Button variant="contained" color="inherit"
            onClick={handleOpen}
            sx={{borderColor: grey[400], borderRadius: 4, backgroundColor: '#fff', color: grey[600], padding: '5px !important', minWidth: 'fit-content'}}>
            <QuestionMarkIcon sx={{fontSize: {xs: '1rem', md: '1.25rem'}}} />
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="description"
      >
        <DialogTitle>{"도움말"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="description">
            해당 페이지에 대해 안내합니다
          </DialogContentText>
            <DialogContentText textAlign="center"
              color={serverHealth ? green[600] : 'error'}
              sx={{mt: 1}}>  
              { serverHealth ? '서버 연결' : '서버 꺼짐' }
          </DialogContentText> 
          {version && <DialogContentText textAlign="center" >
            version: {version}
          </DialogContentText>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>확인</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Tooltip } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { green, grey } from "@mui/material/colors";
import axios from 'axios';
import { useStore } from '../../../stores/useStore';
import { shallow } from 'zustand/shallow';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TutorialModal() {
  const { pathname, serverHealth, setServerHealth, version, setVersion } = useStore(
    state => ({
      pathname: state.pathname, 
      serverHealth: state.serverHealth, 
      setServerHealth: state.setServerHealth, 
      version: state.version, 
      setVersion: state.setVersion
    }), shallow
  );

  const [open, setOpen] = useState(false);

  const serverPowerPath = pathname === "/bss-test" || pathname === "/audio-test";
  const [tech, setTech] = useState(null);
  const [serverLoading, setServerLoading] = useState(false);
  const [serverPowerUpdate, setServerPowerUpdate] = useState(null);

  const handleServerPower = async () => {
    setServerLoading(true);
    let cmd;
    if(serverHealth) cmd = 'stop';
    else cmd = 'start';

    console.log('cmd: ', cmd);
    axios.get(`https://aiserver.bs-soft.co.kr/control/${tech}/${cmd}`)
      .then((response) => {
        console.log('server: ', response);
        if(response.data === 'ok') {
          swithPah();
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  // health check
  const getServerHealth = (baseUrl) => {
    axios.get(baseUrl)
      .then((response)=> {
        console.log('health', response)
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
    .finally(() => setServerLoading(false))
  }

  const swithPah = () => {
    switch(pathname) {
      case '/menu-test':
        getServerHealth('https://stt-cafe.bs-soft.co.kr/');
        break;
      case '/audio-test':
        getServerHealth('https://api-2035.bs-soft.co.kr/');
        setTech('adl')
        break;
      case "/sound-test":
        getServerHealth('https://sound.bs-soft.co.kr/');
        break;
      case "/bss-test":
        getServerHealth('https://bss.bs-soft.co.kr/');
        setTech('bss')
        break;
      case "/stt-test":
        break;
      // default:
      //   setServerHealth(false);
      //   setVersion(false);
    }
  }

  const handleOpen = async () => {
    let res = null;
    swithPah();
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
            {serverPowerPath &&
              <Button variant={serverHealth ? 'outlined' : 'contained'}
                color="success" size="small"
                onClick={handleServerPower}
                sx={{minWidth: 'fit-content', marginLeft: 1 }}>
                {serverLoading ? '•••' : 
                  (serverHealth ? '끄기' : '켜기')
                }
              </Button>
            }
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
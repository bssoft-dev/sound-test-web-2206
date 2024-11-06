import * as React from 'react';
import { useState } from 'react';
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
  const [serverLoading, setServerLoading] = useState(false);
  const serverPowerPath = pathname === "/bss-test" || pathname === "/audio-test";
  const [tech, setTech] = useState(null);

  const [info, setInfo] = useState();

  const handleServerPower = async () => {
    setServerLoading(true);
    let cmd = serverHealth ? 'stop' : 'start';
    
    try {
      const response = await axios.get(`https://aiserver.bs-soft.co.kr/control/${tech}/${cmd}`);
      if (response.data === 'ok') {
        swithPah();
      }
    } catch (error) {
      console.error(error);
    }
    setServerLoading(false);
  }

  const getServerHealth = async (baseUrl) => {
    try {
      const response = await axios.get(baseUrl);
      if (response.status === 200) {
        setServerHealth(true);
        setVersion(response.data.version || null);
      } else {
        setServerHealth(false);
        setVersion(null);
      }
    } catch (error) {
      console.error(error);
      setServerHealth(false);
      setVersion(null);
    }
  }

  const getInfo = async (tech) => {
    console.log(tech)
    const baseUrl = `https://aiserver.bs-soft.co.kr/info/${tech}` 
    try {
      const response = await axios.get(baseUrl);
      if(response.status === 200)  {
        setInfo(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const swithPah = () => {
    switch(pathname) {
      case '/menu-test':
        getInfo('cafe');
        // getServerHealth('https://stt-cafe.bs-soft.co.kr/');
        break;
      case '/audio-test':
        getInfo('adl');
        // getServerHealth('https://adl-api.bs-soft.co.kr/');
        break;
      case "/sound-test":
        getInfo('soundprocess');
        // getServerHealth('https://sound.bs-soft.co.kr/');
        break;
      case "/bss-test":
        getInfo('bss');
        // getServerHealth('https://bss.bs-soft.co.kr/');
        break;
      case "/stt-test":
        getInfo('stt');
        break;
      case "/tts-test":
        getInfo('tts');
        break;
      case "/danger-sound":
        getInfo('warn');
        break;
      default:
        setInfo();
        setServerHealth(false);
        setVersion(null);
    }
  }

  const handleOpen = async () => {
    swithPah();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false)
  };

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
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              minWidth: '30vw'
            },
          },
        }}
      >
        <DialogTitle>{"도움말"}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="description">
            해당 페이지에 대해 안내합니다
          </DialogContentText> */}
          {/* <DialogContentText textAlign="center"
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
          </DialogContentText>  */}
          <DialogContentText sx={{mt: 1}}>  
            <div dangerouslySetInnerHTML={{ __html: info }} />
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
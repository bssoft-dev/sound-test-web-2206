import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import { withHyperuser } from "../../hooks/withHyperuser";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import { useEffect, useState } from "react";
import axios from "axios";
import { green } from "@mui/material/colors";
import { useStore } from "../../stores/useStore";
import { shallow } from "zustand/shallow";

function ServerHealthCard({ link }) {
  const { setAlert } = useStore(
    state => ({
      setAlert: state.setAlert
    }), shallow
  )
  const [serverHealth, setServerHealth] = useState(false);
  const [serverLoading, setServerLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tech, setTech] = useState(null);
  const serverPowerPath = link.url === "/bss-test" || link.url === "/audio-test" || link.url === '/menu-test';
  
  // health check
  const getServerHealth = (baseUrl) => {
      axios.get(baseUrl)
      .then((response)=> {
          console.log('health', response)
          if(link.url === '/stt-test') console.log('stt', response)
          if(response.status === 200) {
              setServerHealth(true);
              setServerLoading(false);
          }else {
              setServerHealth(false);
          }
      })
      .catch((error)=> {
          console.log(error);
          setServerHealth(false);
      })
  }

  const swithServerHealth = () => {
      switch(link.url) {
        case '/menu-test':
          getServerHealth('https://stt-cafe.bs-soft.co.kr/');
          setTech('cafe');
          break;
        case '/audio-test':
          getServerHealth('https://adl-api.bs-soft.co.kr/');
          setTech('adl');
          break;
        case "/sound-test":
          getServerHealth('https://sound.bs-soft.co.kr/');
          break;
        case "/bss-test":
          getServerHealth('https://bss.bs-soft.co.kr/');
          setTech('bss');
          break;
        case "/stt-test":
          const websocket = new WebSocket("wss://stt.bs-soft.co.kr/ws/byte");
          websocket.onopen = (event) => {
            if (websocket.readyState === WebSocket.OPEN) {
              setServerHealth(true);
              websocket.close();
            } else {
              setServerHealth(false);
            }
          };
          break;
        // default:
        //   setServerHealth(false);
        //   setVersion(false);
      }
  }

  const handleServerPower = async () => {
      setServerLoading(true);
      setIsDisabled(true);
      let cmd;
      if(serverHealth) cmd = 'stop';
      else cmd = 'start';
  
      console.log('cmd: ', cmd);
      axios.get(`https://aiserver.bs-soft.co.kr/control/${tech}/${cmd}`)
        .then((response) => {
          console.log('server: ', response);
          if(response.status === 200) {
            const msg = response.data.msg
            console.log(response.data.msg)
            if(msg.includes('전송했습니다')) {
              setAlert({
                open: true,
                type: "info",
                message: msg
              })
            } else if (msg.includes('이전 명령')) {
              setAlert({
                open: true,
                type: "warning",
                message: msg
              })
            }
            
            const timer = setTimeout(() => {
              window.location.reload();
            }, 4000);
        
            return () => clearTimeout(timer);
          }
        })
        .catch((error) => {
          console.log(error);
        })
    }
  

  useEffect(() => {
      swithServerHealth();
  }, [])

  return (
    <Grid item xs={6} md={4} lg={3}> 
        <Card
            sx={{ p: 2 }}>
            <Typography variant="body" color="text.secondary" fontWeight={600}>{ link.name }</Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center"
            sx={{ mt: 2, height: '2.4rem' }}>
                <Typography gutterBottom variant="body2" 
                    color={ serverHealth ? green[500] : 'secondary'} fontWeight={500} >
                    {serverHealth ? '켜짐' : '꺼짐'}
                </Typography>
                {serverPowerPath && 
                    <Button 
                        onClick={handleServerPower}
                        variant="contained" color={serverHealth ? 'success' : 'secondary'}
                        disabled={isDisabled}
                        sx={{ borderRadius: '50%', width: '2.4rem', minWidth: '2.4rem', height: '2.4rem', p: 1, }}>
                        {serverLoading ? <ModeStandbyIcon sx={{ color: '#ffffff82' }} />:
                            <PowerSettingsNewIcon sx={{ color: '#fff' }} />
                        }
                    </Button>
                }
            </Stack>
        </Card>
    </Grid>
  )
}

export default withHyperuser(ServerHealthCard);
import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import { green } from "@mui/material/colors";
import axios from "axios";
import { CompareSharp } from "@mui/icons-material";

export default function ServerControlCard() {
    const [serverHealth, setServerHealth] = useState(false);
    const [serverLoading, setServerLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleServerPower = async () => {
        if(!serverHealth) {
            try {
                const response = await axios.post('https://aiserver.bs-soft.co.kr/post-schedule');
                console.log('response.data: ', response.data);
                await getServerHealth()
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                const response = await axios.delete('https://aiserver.bs-soft.co.kr/delete-schedule');
                console.log('response.data: ', response.data);
                await getServerHealth()
            } catch (error) {
                console.log(error);
            }
        }

    }
    const getServerHealth = async () => {
        try {
            const response = await axios.get('https://aiserver.bs-soft.co.kr/get-schedule');
            const msg = response.data.msg;
            if(msg === 'Schedule file does not exist.' || msg === 'Schedule deleted.') {
                setServerHealth(false);
            } else if(msg === 'Schedule file exists.') {
                setServerHealth(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getServerHealth()
    }, [])
    return (
        <Grid item xs={6} xl={4}>
            <Card
                sx={{ p: 2 }}>
                <Stack flexDirection="row" flexWrap="wrap" sx={{gap: 1}}>
                    <Typography variant="body" 
                        color="text.secondary" fontWeight={600}>
                        서버 유지 현황
                    </Typography>
                    <Typography variant="body2" component="span"
                        color="text.secondary" fontWeight={600}>
                        (오늘만 새벽에 안끄기)
                    </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center"
                    sx={{ mt: 2, height: '2.4rem' }}>
                    <Typography gutterBottom variant="body2"
                        color={serverHealth ? green[500] : 'secondary'} fontWeight={500} >
                        {serverHealth ? '켜짐' : '꺼짐'}
                    </Typography>
                    <Button
                        onClick={handleServerPower}
                        variant="contained" color={serverHealth ? 'success' : 'secondary'}
                        disabled={isDisabled}
                        sx={{ borderRadius: '50%', width: '2.4rem', minWidth: '2.4rem', height: '2.4rem', p: 1, }}>
                        {serverLoading ? <ModeStandbyIcon sx={{ color: '#ffffff82' }} /> :
                            <PowerSettingsNewIcon sx={{ color: '#fff' }} />
                        }
                    </Button>
                </Stack>
            </Card>
        </Grid>
    )
}
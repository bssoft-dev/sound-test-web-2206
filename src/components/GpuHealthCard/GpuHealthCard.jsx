import { Card, Grid, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function GpuHealthCard() {
    const [gpuHealth, setGpuHealth] = useState([])

    const getGpuHealth = async () => {
        try {
            const response = await axios.get('https://aiserver.bs-soft.co.kr/gpu-usage');
            setGpuHealth(response.data);
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getGpuHealth();
    }, [])

    return (
        <>
            {gpuHealth.length > 0 && gpuHealth.map(data => (
                <Grid item xs={6} md={3} lg={2}>
                    <Card
                        sx={{ p: 2 }}>
                        <Typography variant="body" component="p"
                            color="text.secondary" fontWeight={600}
                            sx={{ mb: 2 }}>
                            {data[0].replace(':', '')}
                        </Typography>
                        <Stack direction="row" sx={{gap: 1}}>
                            <Typography gutterBottom variant="body2" component="span"
                                color="secondary" fontWeight={500} >
                                {data[1].split(':')[0]} :
                            </Typography>
                            <Typography gutterBottom variant="body2" component="span"
                                color="secondary" fontWeight={700} >
                                {data[1].split(':')[1]}
                            </Typography>
                        </Stack>
                        <Stack direction="row" sx={{gap: 1}}>
                            <Typography gutterBottom variant="body2" component="span"
                                color="secondary" fontWeight={500} >
                                {data[2].split(':')[0]} :
                            </Typography>
                            <Typography gutterBottom variant="body2" component="span"
                                color="secondary" fontWeight={700} >
                                {data[2].split(':')[1]}
                            </Typography>
                        </Stack>
                    </Card>
                </Grid>
            ))}
        </>
    )
}
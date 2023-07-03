import { useEffect, useState } from "react";
import { Card, CardActions, CardContent, Collapse, Divider, IconButton, Typography } from "@mui/material"
import { StyledCardHeader } from "../../pages/CafeOrderTestPage"
import { makeStyles } from "@mui/styles";
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

const useStyles = makeStyles(theme => ({
    menuName: {
      // transition: ".5s",
      animation: '$fadeIn 1s',
    },
    '@keyframes fadeIn': {
      from: { opacity: 0},
      to: { opacity: 1},
    },
}));

export default function RecordingResult({ recordData, handleDataUpdate }) {
    const classes = useStyles();

    const [showMenu, setShowMenu] = useState(false);
    useEffect(() => {
      recordData && setTimeout(() => {
          setShowMenu(true);
        }, 300)
    }, [recordData]);

    const textLng = recordData ? recordData.contents.join('').replaceAll(' ', '').length : 0;

    return(
        <Card sx={{ flex: {xs: 0, md: 1}, display: 'flex', flexDirection: 'column' }}>
          <StyledCardHeader title="인식결과" />
          <Divider />
          <CardContent sx={{ p: { md: '28px' }, minHeight: '120px' }}>
            <Typography fontSize={{ xs: '24px', md: '2.5rem' }}
              fontWeight={500} lineHeight={1.4}
              sx={{ color: '#FF8A00' }} >
              {recordData && recordData.title}
            </Typography>
            {recordData && recordData.contents.map((data, index) => {
              return (
                <Collapse key={index} orientation="horizontal" in={showMenu} collapsedSize={0}
                sx={{height: {xs: '33.59px', md: 56}}}
                className={showMenu ? classes.menuName : ''}>
                  <Typography
                    xs={12} md={6}
                    fontSize={{ xs: '24px', md: '2.5rem' }}
                    fontWeight={500} lineHeight={1.4}>
                    {data}
                  </Typography>
                </Collapse>
              )
            })}
          </CardContent>
          
          <CardActions sx={{ mt: 'auto', justifyContent: 'space-between', pl: { xs: 2, md: '28px' }, pr: { md: '20px' } }}>
            <Typography color="#adadad" fontWeight={500}
              sx={{ fontSize: { lg: '18px' } }}>{textLng} / 100</Typography>
            <IconButton onClick={() => handleDataUpdate(null)}
              sx={{ fontSize: { xs: 24, md: 30, lg: 36 } }}>
              <RefreshRoundedIcon fontSize="inherit" sx={{ color: '#FF8A00' }} />
            </IconButton>
          </CardActions>
        </Card>
    )
}
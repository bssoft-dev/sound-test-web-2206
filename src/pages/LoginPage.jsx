import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Login from "../components/User/Login/Login";

const useStyles = makeStyles(theme => ({
    gradientBG: {
        width: '100vw', 
        height: '100vh', 
        background: 'rgb(104,190,213)',
        background: 'linear-gradient(149deg, rgba(104,190,213,1) 0%, rgba(78,78,142,1) 100%)'
    }
  }));

export default function LoginPage() {
    const classes = useStyles();

    return (<Grid container
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: '100vh' }}
        xs={12} >
        <Grid className={classes.gradientBG}
            position='absolute' bottom={0} zIndex='-1' >
        </Grid>
        <Grid container sx={{ p: 2, pb:0, boxSizing: 'border-box', height: '60px' }}>
            <img src="/images/logo-white.png" className="logo" alt="비에스소프트" 
                height="100%"/>
        </Grid>
        <Grid container
            justifyContent="center"
            alignItems="center"
            flex={1}>
            <Login />
        </Grid>
    </Grid>)
}
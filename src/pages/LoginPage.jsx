import React from "react";
import { useTitle } from "../hooks/useTitle";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Login from "../components/User/Login/Login";
import Alert from "../components/Alert/Alert";
import { withAuth } from "../hooks/withAuth";

const useStyles = makeStyles(theme => ({
    gradientBG: {
        width: '100vw', 
        height: '100dvh', 
        background: 'rgb(104,190,213)',
        background: 'linear-gradient(149deg, rgba(104,190,213,1) 0%, rgba(78,78,142,1) 100%)'
    }
  }));

function LoginPage() {
    const classes = useStyles();

    useTitle('로그인');

    return (<Grid container
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ height: '100dvh', overflow: 'hidden'  }} >
            <Alert />
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

export default withAuth(LoginPage);
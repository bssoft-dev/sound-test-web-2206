import React from "react";
import { Link } from "react-router-dom";
import "./sideNav.css"
import { Grid } from "@mui/material";
import SideMenu from "./SideMenu";

export default function SideNav() {
    
    return(<Grid container 
        flexDirection="column"
        sx={{display: {xs: 'none', sm: 'flex'}}}
        className="sideNav">
        <Grid item className="SideNavTop row">
            <Link to='/'>
                <img src="/images/logo.png" className="logo" alt="비에스소프트" />
            </Link>
        </Grid>
        <SideMenu />
    </Grid>)
}
import { Box, Drawer } from "@mui/material";
import { useCtx } from "../../context/Context";
import Alert from "../Alert/Alert";
import MainContainer from "./MainContainer/MainContainer";
import SideNav from "./SideNav/SideNav";

import "./layout.css";
import SideMenu from "./SideNav/SideMenu";
import { useState } from "react";

export default function Layout({ children }) {
    const context = useCtx();
    const { mobileOpen, handleDrawerToggle } = context;

    return (<div className="row layout">
        <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
            <Box role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
                <SideMenu />
            </Box>
        </Drawer>
        <Alert />
        <SideNav />
        <MainContainer content={children}  />
    </div>)
}
import { Box, Drawer } from "@mui/material";
import { useCtx } from "../../context/Context";
import Alert from "../Alert/Alert";
import MainContainer from "./MainContainer/MainContainer";
import SideNav from "./SideNav/SideNav";

import "./layout.css";
import SideMenu from "./SideNav/SideMenu";
import Loading from "../Loading/Loading";
import { Suspense, lazy } from "react";

const LazyAlert = lazy(() => import("../Alert/Alert"));

export default function Layout({ children }) {
    const context = useCtx();
    const { mobileOpen, handleDrawerToggle, loading, isAlert } = context;

    return (<div className="row layout">
        <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
            <Box role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
                <SideMenu />
            </Box>
        </Drawer>
        <Suspense fallback={null}>
            {isAlert.open && <LazyAlert />}
        </Suspense>
        <SideNav />
        <MainContainer content={children}  />
        {loading && <Loading sx={{position: 'absolute', top: 0, left: 0, zIndex: 100}} />}
    </div>)
}
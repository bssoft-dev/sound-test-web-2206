import { Box, Drawer } from "@mui/material";
import { useCtx } from "../../context/Context";
import Alert from "../Alert/Alert";
import MainContainer from "./MainContainer/MainContainer";
import SideNav from "./SideNav/SideNav";

import "./layout.css";
import SideMenu from "./SideNav/SideMenu";
import { Suspense, lazy } from "react";

const LazyAlert = lazy(() => import("../Alert/Alert"));
const LazyLoading = lazy(() => import("../Loading/Loading"));

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
            {loading && <LazyLoading sx={{position: 'absolute', top: 0, left: 0, zIndex: 100}} />}
        </Suspense>
        <SideNav />
        <MainContainer content={children}  />
    </div>)
}
import { Box, Drawer } from "@mui/material";
import MainContainer from "./MainContainer/MainContainer";
import SideNav from "./SideNav/SideNav";

import "./layout.css";
import SideMenu from "./SideNav/SideMenu";
import React, { Suspense, lazy, useEffect, useLayoutEffect } from "react";
import { shallow } from "zustand/shallow";
import { useStore } from "../../stores/useStore";
import { useLocation } from "react-router-dom";

const LazyAlert = lazy(() => import("../Alert/Alert"));
const LazyLoading = lazy(() => import("../Loading/Loading"));

export default function Layout({ children }) {
    const { pathname, mobileOpen, handleDrawerToggle, loading, isAlert, setVersion, setFile, setRegion } = useStore(
        state => ({
            pathname: state.pathname,
            mobileOpen: state.mobileOpen, 
            handleDrawerToggle: state.handleDrawerToggle, 
            loading: state.loading, 
            isAlert: state.isAlert,
            setVersion: state.setVersion, 
            setFile: state.setFile, 
            setRegion: state.setRegion
        }), shallow
    );

    useEffect(() => {
        const unsubscribe = useStore.subscribe(
            (state) => state.pathname,
            (pathname, previousPathname) => {
                if(pathname !== previousPathname) {
                    console.log(pathname, previousPathname);
                    setFile([null]);
                    setRegion({
                        id: 'region-1',
                        start: 0,
                        end: 1,
                        color: "rgba(60, 179, 113, 0.3)"
                    });
                }
            },
        )
        return unsubscribe;
    }, [pathname]);

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
import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import UserMenu from "../UserMenu/UserMenu";
import './header.css';
import MenuIcon from '@mui/icons-material/Menu';
import { useStore } from "../../../stores/useStore";

export default function Header() {
    const {  token, handleDrawerToggle } = useStore(
        state => ({
        token: state.token,
        handleDrawerToggle: state.handleDrawerToggle,
        })
    );
    
    return (<header className="row">
    <IconButton
        color="inherit"
        aria-label="open drawer"
        // edge="start"
        onClick={handleDrawerToggle}
        sx={{ display: { sm: 'none' } }}
        >
        <MenuIcon color="secondary" />
    </IconButton>
    <Link to='/' className="homeLink">
        <img src="/images/logo.png" className="logo" alt="비에스소프트" />
    </Link>

    <div className="headerRight row">
        {token && <UserMenu />}
        {/* <div className="settingMenu">
            <Button className="settingBtn" color="inherit">
                <SettingsIcon sx={{color: grey[400]}} />
            </Button>
        </div> */}
    </div>
</header>)
}
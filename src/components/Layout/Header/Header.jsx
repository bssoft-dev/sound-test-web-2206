import { useCtx } from "../../../context/Context";
import UserMenu from "../UserMenu/UserMenu";

import { Button, IconButton } from "@mui/material";
import { grey } from "@mui/material/colors";
import './header.css'

import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";

export default function Header() {
    const context = useCtx();
    const { token, handleDrawerToggle } = context;
    
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
        {token && <UserMenu></UserMenu>}
        {/* <div className="settingMenu">
            <Button className="settingBtn" color="inherit">
                <SettingsIcon sx={{color: grey[400]}} />
            </Button>
        </div> */}
    </div>
</header>)
}
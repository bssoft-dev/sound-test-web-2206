import { useCtx } from "../../../context/Context";
import UserMenu from "../UserMenu/UserMenu";

import { Button, IconButton } from "@mui/material";
import { grey } from "@mui/material/colors";
import './header.css'

import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';

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
        <MenuIcon />
    </IconButton>
    <div className="headerRight row">
        {token && <UserMenu></UserMenu>}
        <div className="settingMenu">
            <Button className="settingBtn" color="inherit">
                <SettingsIcon sx={{color: grey[400]}} />
            </Button>
        </div>
    </div>
</header>)
}
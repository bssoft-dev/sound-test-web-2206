import UserMenu from "../UserMenu/UserMenu";
import { Button } from "@mui/material";
import { grey } from "@mui/material/colors";

import SettingsIcon from '@mui/icons-material/Settings';

import './header.css'
import { useCtx } from "../../../context/Context";

export default function Header() {
    const context = useCtx();
    const { token } = context;
    
    return (<header className="row">
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
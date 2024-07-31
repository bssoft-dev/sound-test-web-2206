import React from "react";
import { NavLink } from "react-router-dom";
import { Grid } from "@mui/material";
import { withHyperuser } from "../../../hooks/withHyperuser";

const NavLinkItem = ({ link }) => (
    <li>
        <NavLink to={link.url}
            className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : ""
        }>{ link.name }</NavLink>
    </li>
);

const WithHyperuserNavLinkItem = withHyperuser(NavLinkItem);

export default function SideMenu() {
    return (
        <Grid className="SideMenu">
            <ul>
                <WithHyperuserNavLinkItem />
            </ul>
        </Grid>
    )
}

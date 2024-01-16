import { useLayoutEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Grid } from "@mui/material";
import { withHyperuser } from "../../../hooks/withHyperuser";

const links = [
    // {name: '사운드 처리 테스트', url: '/sound-test' },
    {name: '화자 분리 테스트', url: '/bss-test' },
    {name: 'STT 기본모델 테스트', url: '/stt-test' },
    {name: '카페 주문 테스트', url: '/menu-test' },
    {name: 'ADL 분석 테스트', url: '/audio-test' },
    
    // {name: '로그인', url: '/login' },
    // {name: '테스트', url: '/test' },
]

function SideMenu({ isHyperuser }) {
    
    return (
        <Grid className="SideMenu">
            <ul>
                <li>
                    <NavLink to='/sound-test'
                        className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }>사운드 처리 테스트</NavLink>
                </li>
                {isHyperuser && links.map((link) => (
                    <li key={link.name}>
                        <NavLink to={link.url}
                            className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }>{ link.name }</NavLink>
                    </li>
                ))}
            </ul>
        </Grid>
    )
}

export default withHyperuser(SideMenu);
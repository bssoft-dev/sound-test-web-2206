import { Grid } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const links = [
    {name: '사운드 처리 테스트', url: '/sound-test' },
    {name: '화자 분리 테스트', url: '/bss-test' },
    {name: 'STT 기본모델 테스트', url: '/stt-test' },
    // {name: '로그인', url: '/login' },
    // {name: '오디오 스트리밍 테스트', url: '/audio-test' },
    // {name: '테스트', url: '/test' },
]

export default function SideMenu() {
    const [isHyperuser, setIsHyperuser] = useState(false);

    useEffect(() => {
        if(localStorage.getItem('is_hyperuser')) {
            setIsHyperuser(true);
        }
    }, [])
    
    return (
        <Grid className="SideMenu">
            <ul>
                {isHyperuser && links.map((link) => (
                    <li key={link.name}>
                        <NavLink to={link.url}
                            className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }>{ link.name }</NavLink>
                    </li>
                ))}
                <li>
                    <NavLink to='/audio-test'
                        className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                    }>ADL 분석 테스트</NavLink>
                </li>
            </ul>
        </Grid>
    )
}
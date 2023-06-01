import { Link, NavLink } from "react-router-dom";
import "./sideNav.css"

const links = [
    {name: '로그인', url: '/login' },
    {name: '사운드 처리 테스트', url: '/sound-test' },
    {name: '화자 분리 테스트', url: '/bss-test' },
    {name: '오디오 스트리밍 테스트', url: '/audio-test' },
    // {name: '테스트', url: '/test' },
]

export default function SideNav() {
    return(<div className="sideNav">
        <div className="SideNavTop row">
            <Link to='/'>
                <img src="/images/logo.png" className="logo" alt="비에스소프트" />
            </Link>
        </div>
        <aside className="SideMenu">
            <ul>
                {links.map((link) => (
                    <li key={link.name}>
                        <NavLink to={link.url}
                            className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }>{ link.name }</NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    </div>)
}
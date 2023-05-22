import MainContainer from "../MainContainer/MainContainer";
import SideNav from "../SideNav/SideNav";

import "./layout.css";

export default function Layout(props) {
    const {children, title} = props;
    return (<div className="row layout">
        <SideNav />
        <MainContainer content={children} title={title} />
    </div>)
}
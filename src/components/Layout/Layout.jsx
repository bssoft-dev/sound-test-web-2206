import Alert from "../Alert/Alert";
import MainContainer from "./MainContainer/MainContainer";
import SideNav from "./SideNav/SideNav";

import "./layout.css";

export default function Layout({ children }) {
    return (<div className="row layout">
        <Alert />
        <SideNav />
        <MainContainer content={children}  />
    </div>)
}
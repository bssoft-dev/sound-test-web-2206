import { ContextProvider } from "../../context/Context";
import Alert from "../Alert/Alert";
import MainContainer from "./MainContainer/MainContainer";
import SideNav from "./SideNav/SideNav";

import "./layout.css";

export default function Layout(props) {
    const {children, fetchData} = props;
    return (<div className="row layout">
        <Alert />
        <SideNav />
        <MainContainer content={children} fetchData={fetchData}  />
    </div>)
}
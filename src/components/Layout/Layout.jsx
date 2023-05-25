import { ContextProvider } from "../../context/Context";
import Alert from "../Alert/Alert";
import MainContainer from "./MainContainer/MainContainer";
import SideNav from "./SideNav/SideNav";

import "./layout.css";

export default function Layout(props) {
    const {children, title, fetchData} = props;
    return (<ContextProvider>
        <div className="row layout">
            <Alert />
            <SideNav />
            <MainContainer content={children} title={title} fetchData={fetchData}  />
        </div>
    </ContextProvider>)
}
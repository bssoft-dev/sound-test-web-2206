import { useEffect, useLayoutEffect } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { shallow } from "zustand/shallow";
import { useStore } from "../stores/useStore";

export const withAuth = (Component) => (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setPathname, } = useStore(
        state => ({
            setPathname: state.setPathname, 
        }), shallow
    );

    useEffect(() => {
        if(!localStorage.getItem('token') ) {
            return navigate('/login');
        } else {
            setPathname(location.pathname);
        }
    }, [])

    return <Component {...props} />
}
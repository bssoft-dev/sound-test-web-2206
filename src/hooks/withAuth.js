import { useEffect, useLayoutEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom";

export const withAuth = (Component) => (props) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if(!token ) {
            return navigate('/login');
        }
    }, [])

    return <Component {...props} />
}
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const Context = createContext({});

export function ContextProvider({children}) {
    const location = useLocation();
    const [pathname, setPathname] = useState(location.pathname);
    const [title, setTitle] = useState('비에스 소프트')
    const [isAlert, setIsAlert] = useState({
        open: false,
        type: 'warning',
        message: ''
    });

    useEffect(() => {
        setPathname(location.pathname);
    }, [location.pathname]);

    return (<Context.Provider value={{
            pathname, isAlert, setIsAlert, title, setTitle
        }}>
        {children}
    </Context.Provider>)
}

export const useCtx = () => useContext(Context);
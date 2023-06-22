import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { redirect, useLocation, useNavigate } from "react-router-dom";

export const Context = createContext({});

export function ContextProvider({children}) {
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [pathname, setPathname] = useState(location.pathname);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('비에스 소프트');
    const [isAlert, setIsAlert] = useState({
        open: false,
        type: 'warning',
        message: ''
    });
    const setAlert = data => setIsAlert(data);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
      };

    const [regions, setRegions] = useState([
        {
          id: 'region-1',
          start: 0,
          end: 1,
          color: "rgba(60, 179, 113, 0.3)"
        }
      ]);
    const setRegion = region => setRegions([region]);

    const [files, setFiles] = useState([null]);
    const pushFile = file => setFiles([...files, file]);
    const setFile = file => setFiles(file);
    
    const [rows, setRows] = useState([]);
    const [version, setVersion] = useState(null)
    const [serverHealth, setServerHealth] = useState(false);
    const fetchData = (baseUrl) => {
        axios.get(baseUrl)
        .then((response)=> {
            console.log('response status: ',response.data);
            setRows(response.data);
            if(response.status === 200) {
                setServerHealth(true)
            }
        })
        .catch((error)=> {
            console.log(error);
        })
    }
    useEffect(() => {
        if(sessionStorage.getItem('token')) {
            setToken(sessionStorage.getItem('token'));
        } else {
            return navigate('/login');
        }
    }, [pathname]);

    useEffect(() => {
        setPathname(location.pathname);
        setFile([null]);
        setRegion({
            id: 'region-1',
            start: 0,
            end: 1,
            color: "rgba(60, 179, 113, 0.3)"
          });
    }, [location.pathname]);

    const [isRunning, setIsRunning] = useState(false);

    return (<Context.Provider value={{
            pathname, isAlert, setAlert, title, setTitle,
            regions, setRegion, rows, fetchData,
            files, pushFile, setFile,
            isRunning, setIsRunning, loading, setLoading,
            token, setToken, mobileOpen, handleDrawerToggle,
            serverHealth, setServerHealth, version, setVersion
        }}>
        {children}
    </Context.Provider>)
}

export const useCtx = () => useContext(Context);
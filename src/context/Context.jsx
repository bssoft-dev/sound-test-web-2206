import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const Context = createContext({});

export function ContextProvider({children}) {
    const location = useLocation();
    const [pathname, setPathname] = useState(location.pathname);
    const [title, setTitle] = useState('비에스 소프트');
    const [isAlert, setIsAlert] = useState({
        open: false,
        type: 'warning',
        message: ''
    });
    const setAlert = data => setIsAlert(data);

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
  
    const fetchData = (baseUrl) => {
        axios.get(baseUrl)
        .then((response)=> {
            console.log('response status: ',response.data);
            setRows(response.data);
        })
        .catch((error)=> {
            console.log(error);
        })
    }

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
            isRunning, setIsRunning
        }}>
        {children}
    </Context.Provider>)
}

export const useCtx = () => useContext(Context);
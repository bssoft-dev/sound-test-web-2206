import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import supabase from "../utils/supabase";

export const Context = createContext({});

export function ContextProvider({children}) {
    const [pathname, setPathname] = useState('');
    const [token, setToken] = useState(null);
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
        setRows([]);        
        axios.get(baseUrl)
        .then((response)=> {
            console.log('response status: ', response.data);
            if(response.data) setRows(response.data);
            else setRows([]);

            if(response.status === 200) setServerHealth(true)
            else setRows([]);
        })
        .catch((error)=> {
            setRows([]);
            console.log(error);
        })
    }
    
    const [sountTableRows, setSoundTableRows] = useState([]);
    const fetchSoundDatas = async () => {
        let {data, error} = await supabase
            .from('sound')
            .select('*')
            .order('receivedTime', { ascending: false });
        if(data) {
            console.log('Get Sound: ', data );
            setSoundTableRows(data);
        } else {
            console.log(error);
        }
    }

    useEffect(() => {
        if(localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
        }
        setVersion(null);
        setFile([null]);
        setRegion({
            id: 'region-1',
            start: 0,
            end: 1,
            color: "rgba(60, 179, 113, 0.3)"
          });
    }, [pathname]);
    
    const [bssNumPerson, setBssNumPerson] = useState(2)
    const handleNumPerson = (event) => {
        console.log(event.target.value);
        setBssNumPerson(event.target.value);
    }

    const [sttResult, setSttResult] = useState(null);
    const handleSttResult = (result) => {
        setSttResult(result);
    }


    return (<Context.Provider value={{
            pathname, setPathname,
            isAlert, setAlert, title, setTitle,
            regions, setRegion, rows, setRows, fetchData,
            files, pushFile, setFile,
            loading, setLoading,
            token, setToken, mobileOpen, handleDrawerToggle,
            serverHealth, setServerHealth, version, setVersion,
            bssNumPerson, handleNumPerson,
            sttResult, handleSttResult,
            fetchSoundDatas, sountTableRows, setSoundTableRows
        }}>
        {children}
    </Context.Provider>)
}

export const useCtx = () => useContext(Context);
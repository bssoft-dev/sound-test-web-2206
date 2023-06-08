import { createContext, useContext, useEffect, useState } from "react";


export const StreamContext = createContext({});
export function StreamContextProvider({children}) {
    const [streamList, setStreamList] = useState([]);
    const [audioSrc, setAudioSrc] = useState(null);
    const [tempFile, setTempFile] = useState(null);
    const [status, setStatus] = useState("");
    const controlAudio = (status) => {
        setStatus(status);
        console.log("status", status);
    };

    const [recordedData, setRecordedData] = useState(null);
    const handleStreamList = (data) => setStreamList([...streamList, data]);
    const [rows, setRows] = useState([]);
    const createData = (reckey, oriUrlBase, receivedTime, duration, history ) => {
        return {
          reckey,
          oriUrlBase,
          receivedTime,
          duration,
          history
        };
    }

    useEffect(() => {
        if (recordedData && streamList) {
          const newRow = createData(
            recordedData.Date,
            recordedData.blobURL,
            recordedData.Date,
            '1s',
            streamList
          );
          console.log('streamList', streamList)
          setRows((prevRows) => [...prevRows, newRow]);
          setRecordedData(null);
          setStreamList([]);
          setAudioSrc('');
        }
      }, [recordedData]);

    console.log(rows);

    return(<StreamContext.Provider 
        value={{ audioSrc, setAudioSrc, tempFile, setTempFile,
            rows, streamList, handleStreamList, recordedData, setRecordedData,
            status, controlAudio }}>
        { children }
    </StreamContext.Provider>)
}
export const StreamCtx = () => useContext(StreamContext);
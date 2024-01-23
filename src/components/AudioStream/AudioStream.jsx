import AudioAnalyser from "react-audio-analyser";
import { shallow } from 'zustand/shallow';
import axios from "axios";
import { grey } from "@mui/material/colors";
import { useTimerStore } from "../../stores/useTimerStore";
import { useStreamStore } from "../../stores/useStreamStore";
import { useStore } from "../../stores/useStore";
import { useEffect } from "react";

export default function AudioStream({audioAnalyserRefWidth}) {
    const {setAlert} = useStore(
      state => ({
        setAlert: state.setAlert
      }), shallow
    );

    const { setIsRunning, setTimer } = useTimerStore(
      state => ({
        setIsRunning: state.setIsRunning,
        setTimer: state.setTimer,
      }), shallow
    );

    const { setAudioSrc, streamList, setStreamList, handleStreamList, recordedData, setRecordedData, status, setTempFile, setRows } = useStreamStore(
      state => ({
        setAudioSrc: state.setAudioSrc, 
        streamList: state.streamList,
        setStreamList: state.setStreamList,
        handleStreamList: state.handleStreamList, 
        recordedData: state.recordedData,
        setRecordedData: state.setRecordedData, 
        status: state.status, 
        setTempFile: state.setTempFile,
        setRows: state.setRows,

      }), shallow
    )

    useEffect(() => {
      console.log(recordedData)
      const createData = (reckey, oriUrlBase, receivedTime, duration, history ) => {
        return {
          reckey,
          oriUrlBase,
          receivedTime,
          duration,
          history
        };
      }
      
      if (recordedData && streamList) {
        const newRow = createData(
          recordedData.Date,
          recordedData.blobURL,
          recordedData.Date,
          '10초',
          streamList,
        );
        console.log('streamList', streamList)
        setRows(newRow);
        setRecordedData(null);
        setStreamList([]);
        setAudioSrc('');
      }
    }, [recordedData]);

    // const [audioType, setAudioType] = useState("audio/wav");
    

    // const changeScheme = (e) => {
    //     setAudioType(e.target.value);
    // };

    
    const startCallback = (recordedBlob) => {
        console.log("succ start", recordedBlob);
        handleStartStop();
    };

    const pauseCallback = (recordedBlob) => {
        setIsRunning(prevIsRunning => !prevIsRunning);
        console.log("succ pause", recordedBlob);
    };

    const stopCallback = (recordedBlob) => {
        setAudioSrc(URL.createObjectURL(recordedBlob));
        const date = Date.now();
        setRecordedData({
            recordedBlob: recordedBlob,
            blobURL: URL.createObjectURL(recordedBlob),
            Date: date,
        });
        setTempFile({
            blobURL: URL.createObjectURL(recordedBlob),
            reckey: String(date).slice(7)
        })
        console.log("succ stop", URL.createObjectURL(recordedBlob));
        handleReset();
    };

    const onRecordCallback = (recordedBlob) => {
        const formData = new FormData();
        formData.append(
            "file",
            recordedBlob
        );
        console.log("데이터를 보냅니다.")
        axios({
          url: `https://adl-api.bs-soft.co.kr/v4/upload-analysis-event/blob`,
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          if(response.status != 200) {
            // setAlert({
            //   open: true, 
            //   type: "warning",
            //   message: "파일을 다시 확인해주세요."
            // });
          } else {
            console.log(response)
            handleStreamList({
              timestamp: Date.now(),
              url: URL.createObjectURL(recordedBlob),
              itemData: response.data,
            });
          }
        })
        .catch((error) => {
          // setAlert({
          //   open: true, 
          //   type: "error",
          //   message: "업로드를 실패하였습니다. 파일을 다시 확인해주세요."
          // });
          console.log(error);
        })

        
        console.log("recording", URL.createObjectURL(recordedBlob));
    };

    const errorCallback = (err) => {
        console.log("error", err);
    };

    const audioProps = {
        audioType: "audio/wav",
        // audioOptions: { sampleRate: 30000 }, // 설정된 출력 오디오 샘플률
        status,
        // audioSrc,
        timeslice: 10500, // timeslice (https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters)
        startCallback,
        pauseCallback,
        stopCallback,
        onRecordCallback,
        errorCallback,
        backgroundColor: 'transparent',
        strokeColor: grey[400],
        width: audioAnalyserRefWidth,
        height: 100,
    };

    const handleStartStop = () => {
        setTimer(0);
        setIsRunning(prevIsRunning => !prevIsRunning);
    };

    const handleReset = () => {
        // setTimer(0);
        setIsRunning(false);
    };

    return ( <>
        {audioAnalyserRefWidth && <AudioAnalyser {...audioProps}></AudioAnalyser>}
        
        {/* <p>Choose output type</p>
        <select name="" id="" onChange={(e) => changeScheme(e)} value={audioType}>
            <option value="audio/webm">audio/webm (default)</option>
            <option value="audio/wav">audio/wav</option>
            <option value="audio/mp3">audio/mp3</option>
        </select> */}
    </>);
}

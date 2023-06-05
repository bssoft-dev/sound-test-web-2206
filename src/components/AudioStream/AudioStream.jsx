import { useEffect, useState } from "react";
import AudioAnalyser from "react-audio-analyser";
import { TimerCtx } from "../../context/TimerContext";
import { StreamCtx } from "../../context/StreamContext";

export default function AudioStream({audioAnalyserRefWidth}) {

    const timerContext = TimerCtx();
    const {setIsRunning, setTimer} = timerContext;
    const streamContext = StreamCtx();
    const { setAudioSrc, handleStreamList, setRecordedData, status, setAudioData } = streamContext;
    
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
            blobUrl: URL.createObjectURL(recordedBlob),
            Date: date,
        });
        setAudioData({
            blobUrl: URL.createObjectURL(recordedBlob),
            reckey: String(date).slice(7)
        })
        console.log("succ stop", URL.createObjectURL(recordedBlob));
        handleReset();
    };

    const onRecordCallback = (recordedBlob) => {
        handleStreamList({
            timestamp: Date.now(),
            url: URL.createObjectURL(recordedBlob)
        });
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
        timeslice: 2000, // timeslice (https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters)
        startCallback,
        pauseCallback,
        stopCallback,
        onRecordCallback,
        errorCallback,
        backgroundColor: 'transparent',
        strokeColor: 'grey',
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

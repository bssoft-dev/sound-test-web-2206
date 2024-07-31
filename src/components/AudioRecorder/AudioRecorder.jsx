
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { useStore } from "../../stores/useStore";
import { shallow } from "zustand/shallow";

export default function AudioRecorder({ args, handleDataUpdate, recordIcon, btnStyle, handleWaveForm, wavesurferRef, setRecording }) {
    const [startThreshold, setStartThreshold] = useState(args.get("start_threshold"));
    const [endThreshold, setEndThreshold] = useState(args.get("end_threshold"));
    // threshold 변경 감지
    const [thresholdUpdateNeeded, setThresholdUpdateNeeded] = useState(false);
    const { setServerHealth, setAlert } = useStore(
        state => ({
            setServerHealth: state.setServerHealth, 
            setAlert: state.setAlert
        }), shallow
    );
    const [isDisabled, setIsDisabled] = useState(false);
    const text = args.get("text");
    const continuousRecording = args.get("continuousRecording");
    const [color, setColor] = useState(args.get("neutral_color"));
    // const [socketData, setSocketData] = useState("");
    const websocketRef = useRef(null);
    const audioRecorderRef = useRef({
        stream: null,
        AudioContext: window.AudioContext || window.webkitAudioContext,
        context: null,
        type: 'audio/wav',
        sampleRate: null,
        phrase_buffer_count: null,
        pause_buffer_count: null,
        pause_count: 0,
        stage: null,
        volume: null,
        audioInput: null,
        analyser: null,
        recorder: null,
        recording: false,
        leftchannel: [],
        rightchannel: [],
        leftBuffer: null,
        rightBuffer: null,
        recordingLength: 0,
        tested: false,
    });
    const audioRecorder = audioRecorderRef.current;

    useEffect(() => {
        if (continuousRecording) {
            websocketRef.current = new WebSocket("wss://stt.bs-soft.co.kr/ws/byte");
            // 웹소켓 이벤트 핸들러 등록
            websocketRef.current.onopen = handleWebSocketOpen;
            websocketRef.current.onmessage = handleWebSocketMessage;
            websocketRef.current.onclose = handleWebSocketClose;
            websocketRef.current.onerror = handleWebSocketError;
            return () => {
                // 웹소켓 연결 닫기
                websocketRef.current.onmessage = null;
                if (websocketRef.current.readyState === WebSocket.OPEN) {
                    websocketRef.current.close();
                }
            };
        }

        return () => {
            if (audioRecorder.recording) {
                closeMic(false)
            }
        };
    }, []);
    const handleWebSocketOpen = (event) => {
        // 웹소켓 연결이 열릴 때 처리할 로직
        console.log('웹소켓에 연결되었습니다.');
        setServerHealth(true);
    }

    const handleWebSocketMessage = (event) => {
        // 웹소켓 메시지 수신 시 처리할 로직
        console.log('수신받은 메시지: ', event);
        const msg = JSON.parse(event.data);
        handleDataUpdate(msg);
    }

    const handleWebSocketClose = (event) => {
        // 웹소켓 연결이 닫힐 때 처리할 로직
        console.log('웹소켓이 종료되었습니다');
        setServerHealth(false);
    }

    const handleWebSocketError = (error) => {
        // 웹소켓 오류 발생 시 처리할 로직
        console.log(error)
    }

    const getThreshold = async (audioRecorder, mergeBuffers, encodeWav, interleave) => {
        await start();
        // cafe page threshold 초기화
        setTimeout(() => {
            audioRecorder.recording = false;
            setColor(args.get("neutral_color"))
            closeMic();
            console.log(audioRecorder.recordingLength);

            let interleaved;
            // we flat the left and right channels down
            audioRecorder.leftBuffer = mergeBuffers(
                audioRecorder.leftchannel, audioRecorder.recordingLength
            );
            audioRecorder.rightBuffer = mergeBuffers(
                audioRecorder.rightchannel, audioRecorder.recordingLength
            );
            // we interleave both channels together
            interleaved = interleave(audioRecorder.leftBuffer, audioRecorder.rightBuffer);
        
            // our final binary blob
            const blob = encodeWav(interleaved, audioRecorder.sampleRate);
        
            const blobURL = URL.createObjectURL(blob);
            console.log('Blob URL:', blobURL);
            const formData = new FormData();
            formData.append(
                "file", blob
            );
            axios({
                url: `https://stt-cafe.bs-soft.co.kr/v1/analysis/threshold`,
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(async (response) => {
                console.log(response.data.threshold);
                if (response.status !== 200) {
                    setAlert({
                        open: true,
                        type: "warning",
                        message: "오류가 발생하였습니다. 잠시 후, 다시 시도해주세요"
                    });
                } else {
                    console.log(response.data)
                    setStartThreshold(response.data.threshold);
                    setEndThreshold(response.data.threshold);
                    setThresholdUpdateNeeded(true);
                }
            })
            .catch((error) => {
                console.log(error);
                setAlert({
                    open: true,
                    type: "warning",
                    message: "오류가 발생하였습니다. 잠시 후, 다시 시도해주세요"
                });
            })
        }, 500);
    }

    useEffect(() => {
        // cafe page recording event
        const handleThresholdUpdate = async () => {
            if (!audioRecorder.recording) {
                await start();
                if (!continuousRecording) setRecording(true);
            } else {
                await stop(true);
                if (!continuousRecording) setRecording(false);
            }
            if (handleWaveForm) {
                handleWaveForm();
            }
        }
    
        if (thresholdUpdateNeeded) {
            handleThresholdUpdate();
            setThresholdUpdateNeeded(false);
        }
    }, [thresholdUpdateNeeded])

    //get mic stream
    const getStream = () => {
        console.log("Getting mic");
        return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    };

    const setupMic = async () => {
        try {
            window.stream = audioRecorder.stream = await getStream();
            console.log("Got mic successfully");
            setIsDisabled(true);
        } catch (err) {
            console.log("Error: Issue getting mic", err);
        }

        startRecording();
    };

    const closeMic = () => {
        audioRecorder.stream.getAudioTracks().forEach((track) => {
            track.stop();
        });
        audioRecorder.audioInput.disconnect(0);
        audioRecorder.analyser.disconnect(0);
        audioRecorder.recorder.disconnect(0);
    };

    // const [getThresholdRecording, setGetThresholdRecording] = useState(false);
    // let mediaRecorder;
    // const getThresholdRecording2 = (stream) => {
    //     mediaRecorder = new MediaRecorder(stream);
    //     const chunks = [];
    
    //     mediaRecorder.ondataavailable = (e) => {
    //       chunks.push(e.data);
    //     };
    
    //     mediaRecorder.start();
    
    //     setTimeout(() => {
    //       mediaRecorder.onstop = () => {
    //         const blob = new Blob(chunks, { type: 'audio/webm' });
    //         const url = URL.createObjectURL(blob);
    //         console.log(url);
    //         stream.getTracks().forEach((track) => {
    //           track.stop();
    //         });
    //         const formData = new FormData();
    //         formData.append(
    //             "file", blob
    //         );
    //         axios({
    //             url: `https://stt-cafe.bs-soft.co.kr/v1/analysis/threshold`,
    //             method: 'POST',
    //             data: formData,
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         })
    //         .then(async (response) => {
    //             console.log(response.data.threshold);
    //             if (response.status !== 200) {
    //                 setAlert({
    //                     open: true,
    //                     type: "warning",
    //                     message: "오류가 발생하였습니다. 잠시 후, 다시 시도해주세요"
    //                 });
    //             } else {
    //                 console.log(response.data)
    //                 setStartThreshold(response.data.threshold);
    //                 setEndThreshold(response.data.threshold);
    //                 setThresholdUpdateNeeded(true);
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //             setAlert({
    //                 open: true,
    //                 type: "warning",
    //                 message: "오류가 발생하였습니다. 잠시 후, 다시 시도해주세요"
    //             });
    //         })
            
    //     };
    //     mediaRecorder.stop();
    //     setGetThresholdRecording(false);
    
    //     }, 500);
    // };
    
    const onClicked = async (e) => {
        console.log('threshold: ', startThreshold);
        
        if(!continuousRecording) {
            getThreshold(audioRecorder, mergeBuffers, encodeWav, interleave);
            // if(!getThresholdRecording) {
            //     console.log()
            //     setGetThresholdRecording(true);
            //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            //     getThresholdRecording2(stream);
            // }
        } else {
            if (!audioRecorder.recording) {
                await start();
            } else {
                await stop(true);
            }
            if (handleWaveForm) {
                handleWaveForm()
            }
        }
        
    };

    const writeUTFBytes = (view, offset, string) => {
        let lng = string.length;
        for (let i = 0; i < lng; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    const mergeBuffers = (channelBuffer, recordingLength) => {
        let result = new Float32Array(recordingLength);
        let offset = 0;
        let lng = channelBuffer.length;
        for (let i = 0; i < lng; i++) {
            let buffer = channelBuffer[i];
            result.set(buffer, offset);
            offset += buffer.length;
        }
        return result;
    };

    const interleave = (leftChannel, rightChannel) => {
        let length = leftChannel.length + rightChannel.length;
        let result = new Float32Array(length);

        let inputIndex = 0;

        for (let index = 0; index < length;) {
            result[index++] = leftChannel[inputIndex];
            result[index++] = rightChannel[inputIndex];
            inputIndex++;
        }
        return result;
    };

    const encodeWav = (interleaved, sampleRate) => {
        const buffer = new ArrayBuffer(44 + interleaved.length * 2);
        const view = new DataView(buffer);

        writeUTFBytes(view, 0, "RIFF");
        view.setUint32(4, 44 + interleaved.length * 2, true);
        writeUTFBytes(view, 8, "WAVE");
        writeUTFBytes(view, 12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 2, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 4, true);
        view.setUint16(32, 4, true);
        view.setUint16(34, 16, true);
        writeUTFBytes(view, 36, "data");
        view.setUint32(40, interleaved.length * 2, true);

        let index = 44;
        const volume = 1;
        for (let i = 0; i < interleaved.length; i++) {
            view.setInt16(index, interleaved[i] * (0x7fff * volume), true);
            index += 2;
        }

        return new Blob([view], { type: "audio/wav" });
    };


    const startRecording = () => {
        console.log("Starting recording");

        let input_sample_rate = args.get("sample_rate");
        if (input_sample_rate === null) {
            audioRecorder.context = new audioRecorder.AudioContext();
            audioRecorder.sampleRate = audioRecorder.context.sampleRate;
        } else {
            audioRecorder.context = new audioRecorder.AudioContext({
                sampleRate: input_sample_rate
            });
            audioRecorder.sampleRate = input_sample_rate;
        }

        // create buffer states counts
        let bufferSize = 2048;
        let seconds_per_buffer = bufferSize / audioRecorder.sampleRate;
        audioRecorder.pause_buffer_count = Math.ceil(
            args.get("pause_threshold") / seconds_per_buffer
        );
        audioRecorder.pause_count = 0;
        audioRecorder.stage = "start";

        // creates a gain node
        audioRecorder.volume = audioRecorder.context.createGain();

        // creates an audio node from teh microphone incoming stream
        if (audioRecorder.stream === null) {
            console.log("Error: Stream is null");
            return;
        }
        audioRecorder.audioInput = audioRecorder.context.createMediaStreamSource(
            audioRecorder.stream
        );

        // Create analyser
        audioRecorder.analyser = audioRecorder.context.createAnalyser();
        console.log(audioRecorder.analyser.fftSize);

        // connect audio input to the analyser
        audioRecorder.audioInput.connect(audioRecorder.analyser);

        // connect analyser to the volume control
        // analyser.connect(volume);

        audioRecorder.recorder = audioRecorder.context.createScriptProcessor(
            bufferSize, 2, 2
        );

        // we connect the volume control to the processor
        // volume.connect(recorder);

        audioRecorder.analyser.connect(audioRecorder.recorder);

        // finally connect the processor to the output
        audioRecorder.recorder.connect(audioRecorder.context.destination);

        console.log("Recorder created");
        audioRecorder.recorder.onaudioprocess = function (e) {
            // Check
            if (!audioRecorder.recording) return;
            // Do something with the data, i.e Convert this to WAV
            let left = e.inputBuffer.getChannelData(0);
            // let right = e.inputBuffer.getChannelData(1);

            if (!audioRecorder.tested) {
                audioRecorder.tested = true;
                // if this reduces to 0 we are not getting any sound
                if (!left.reduce((a, b) => a + b)) {
                    alert('호환되지 않는 마이크 또는 브라우저입니다.');
                    // clean up;
                    stop(true);
                    audioRecorder.stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                    audioRecorder.context.close();
                }
            }
            // Check energy level
            let energy = Math.sqrt(
                left.map((x) => x * x).reduce((a, b) => a + b) / left.length
            );
            // console.log(energy);
            if (audioRecorder.stage === "start" && energy > startThreshold) {
                console.log('startThreshold', startThreshold)
                audioRecorder.stage = "speaking";
            } else if (audioRecorder.stage === "speaking") {
                if (energy > endThreshold) {
                    audioRecorder.pause_count = 0;
                } else {
                    audioRecorder.pause_count += 1;
                    if (audioRecorder.pause_count > audioRecorder.pause_buffer_count) {
                        stop(false);
                    }
                }
            }
            // let radius = 33.0 + Math.sqrt(1000.0 * energy);
            // props.setRadius(radius.toString());

            // we clone the samples
            audioRecorder.leftchannel.push(new Float32Array(left));
            // audioRecorder.rightchannel.push(new Float32Array(right));
            audioRecorder.rightchannel.push(new Float32Array(left));
            audioRecorder.recordingLength += bufferSize;
        };

        let recordedChunks = []; // Array to store recorded audio chunks

        audioRecorder.recorder.ondataavailable = function (event) {
            recordedChunks.push(event.data);
        };
        // visualize();
    };

    const start = async () => {
        audioRecorder.recording = true;
        console.log("Recording started");
        setColor(args.get("recording_color"));
        await setupMic();
        // reset the buffers for the new recording
        audioRecorder.leftchannel.length = audioRecorder.rightchannel.length = 0;
        audioRecorder.recordingLength = 0;
    }

    const stop = async (isFinish) => {
        audioRecorder.recording = false;
        setColor(args.get("neutral_color"))
        closeMic();
        console.log(audioRecorder.recordingLength);
        // our final binary blob

        let interleaved;
        // we flat the left and right channels down
        audioRecorder.leftBuffer = mergeBuffers(
            audioRecorder.leftchannel, audioRecorder.recordingLength
        );
        audioRecorder.rightBuffer = mergeBuffers(
            audioRecorder.rightchannel, audioRecorder.recordingLength
        );
        // we interleave both channels together
        interleaved = interleave(audioRecorder.leftBuffer, audioRecorder.rightBuffer);

        // our final binary blob
        const blob = encodeWav(interleaved, audioRecorder.sampleRate);
        const audioUrl = URL.createObjectURL(blob);
        if (continuousRecording) {
            if (!isFinish) {
                await onStop({
                    blob: blob,
                    url: audioUrl,
                    type: audioRecorder.type,
                });
                await start();
            }
        } else {
            setIsDisabled(false);
            await onStop({
                blob: blob,
                url: audioUrl,
                type: audioRecorder.type,
            });
            // 키오스크 axios post 보내기
            const formData = new FormData();
            formData.append(
                "file", blob
            );
            console.log(blob)
            axios({
                url: `https://stt-cafe.bs-soft.co.kr/v1/speech/order`,
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((response) => {
                    if (response.status !== 200) {
                        if(continuousRecording) {
                            setAlert({
                                open: true,
                                type: "warning",
                                message: "파일을 다시 확인해주세요."
                            });
                        } else {
                            setAlert({
                                open: true,
                                type: "warning",
                                message: "음성 인식이 잘못되었습니다. 다시 시도해주세요."
                            });
                        }
                    } else {
                        console.log(response)
                        handleDataUpdate(response.data);
                    }
                })
                .catch((error) => {
                    setAlert({
                        open: true,
                        type: "error",
                        message: "업로드를 실패하였습니다. 파일을 다시 확인해주세요."
                    });
                    console.log(error);
                })
        }

    };

    const onStop = async (data) => {
        const byteObj = await data.blob;
        if (continuousRecording) {
            if (websocketRef.current.readyState === WebSocket.OPEN) {
                websocketRef.current.send(byteObj);
            }
        } else {
            wavesurferRef.current.microphone.stop();
            setRecording(false);
        }
    };

    return (
        <Button variant="contained"
            disabled={!continuousRecording ? isDisabled : false}
            color={color}
            sx={btnStyle}
            onClick={onClicked}>
            {text}
            {recordIcon}
        </Button>
    );
};
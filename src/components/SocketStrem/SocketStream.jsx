import React, { useEffect, useRef } from "react";
import MicrophoneStream from "microphone-stream";
import { Button } from "@mui/material";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";

export default function SocketStream({ wsURL, wavesurferRef, handleWaveForm, recording, setRecording, setViolent, btnStyle }) {

    const micStreamRef = useRef(null);
    const rawDataBufferRef = useRef([]);
    const websocketRef = useRef(null);

    useEffect(() => {
        websocketRef.current = new WebSocket(wsURL);
        // websocketRef.current.binaryType = 'arraybuffer';
        websocketRef.current.onopen = handleWebSocketOpen;
        websocketRef.current.onmessage = handleWebSocketMessage;
        websocketRef.current.onclose = handleWebSocketClose;
        websocketRef.current.onerror = handleWebSocketError;
    }, [])

    const handleWebSocketOpen = (event) => {
        // 웹소켓 연결이 열릴 때 처리할 로직
        console.log('웹소켓에 연결되었습니다.');
    }

    const handleWebSocketMessage = async (event) => {
        // 웹소켓 메시지 수신 시 처리할 로직
        console.log('수신받은 메시지: ', event);
        if(event.data.length > 0) {
            setViolent(event.data);
        }
    }

    const handleWebSocketClose = (event) => {
        // 웹소켓 연결이 닫힐 때 처리할 로직
        console.log('웹소켓이 종료되었습니다');
    }

    const handleWebSocketError = (error) => {
        // 웹소켓 오류 발생 시 처리할 로직
        console.log(error)
    }

    // 모아진 chunk 서버 전송
    const sendRawData = async (data) => {
        try {
            const rawData = {
                data: data,
                sr: 16000,
                type: 'f32'
            }
            websocketRef.current.send(JSON.stringify(rawData));
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {

        const getMicrophoneInput = async () => {
            try {
                // 사용(또는 접근)이 가능한 미디어 입력장치나 출력장치들의 리스트
                let context = new AudioContext({
                    sampleRate: 16000,
                });
                micStreamRef.current = new MicrophoneStream({ context: context });

                if (recording) {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: true
                    });

                    micStreamRef.current.setStream(stream);
                    // stream 중인 상태의 이벤트 관리
                    micStreamRef.current.on('data', (chunk) => {

                        const raw = MicrophoneStream.toRaw(chunk);
                        // console.log('toRaw: ', raw);
                        // console.log('JSON.stringify(raw): ', JSON.stringify(raw));
                        // console.log('JSON.parse(JSON.stringify(raw)): ', JSON.parse(JSON.stringify(raw)));
                        let rawArr = Object.values(JSON.parse(JSON.stringify(raw)));
                        // console.log('JSON.parse(JSON.stringify(raw)) to Array: ', rawArr);
                        rawDataBufferRef.current.push(...rawArr);

                        // 1개씩 보내기
                        // sendRawData(...rawArr);

                        // 10개씩 묶어서 보내기 (chunk: 81920, raw: 20480)
                        if (rawDataBufferRef.current.length === (2048 * 8)) {
                            sendRawData(rawDataBufferRef.current);
                            // console.log(rawDataBufferRef.current)
                            rawDataBufferRef.current = [];
                        }

                    });
                }
                // 오디오 형식 세부 정보 확인
                // micStreamRef.current.on('format', (format) => {
                //     console.log(format);
                // });
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        };

        getMicrophoneInput();

        return () => {
            if (micStreamRef.current) {
                micStreamRef.current.stop();
            }
        };
    }, [recording]);

    const handleStartRecording = () => {
        setRecording(true);

        if (handleWaveForm) {
            handleWaveForm()
        }
    };

    const handleStopRecording = () => {
        console.log('end')
        micStreamRef.current.stop();
        wavesurferRef.current.microphone.stop();
        setRecording(false);
        setViolent(false);
        sendRawData(rawDataBufferRef.current);
        console.log(rawDataBufferRef.current)
        rawDataBufferRef.current = [];
    };

    return (
        <Button variant="contained"
            color={recording ? 'error' : 'inherit'}
            sx={btnStyle}
            onClick={recording ? handleStopRecording : handleStartRecording}>
            <KeyboardVoiceIcon sx={{ color: recording ? '#fff' : 'inherit' }} />
        </Button>
    )
}
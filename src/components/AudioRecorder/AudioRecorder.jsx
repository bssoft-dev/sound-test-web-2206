
import { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../../context/Context";
import { Button } from "@mui/material";
import { CollectionsOutlined } from "@mui/icons-material";

export default function AudioRecorder({ args, handleDataUpdate, recordIcon, btnStyle, handleWaveForm, waveformRef, wavesurferRef }) {
    const context = useContext(Context);
    const { setServerHealth } = context;
    const [isComponentMounted, setIsComponentMounted] = useState(false);

    const text = args.get("text");
    const continuousRecording = args.get("continuousRecording");
    const [color, setColor] = useState(args.get("neutral_color"));
    const [socketData, setSocketData] = useState("");
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
        websocketRef.current = new WebSocket("wss://sound.bs-soft.co.kr/ws/byte");
        // 웹소켓 이벤트 핸들러 등록
        websocketRef.current.onopen = handleWebSocketOpen;
        websocketRef.current.onmessage = handleWebSocketMessage;
        websocketRef.current.onclose = handleWebSocketClose;
        websocketRef.current.onerror = handleWebSocketError;
        
        
        return () => {
            setIsComponentMounted(false);
            // 웹소켓 연결 닫기
            websocketRef.current.onmessage = null;
            if (websocketRef.current.readyState === WebSocket.OPEN) {
                websocketRef.current.close();
            }
            if(audioRecorder.recording) {
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
        // console.log('수신받은 메시지: ', event);
        const msg = JSON.parse(event.data);
        if(setIsComponentMounted) {
            handleDataUpdate(msg.data);
        }
    }

    const handleWebSocketClose = (event) => {
        // 웹소켓 연결이 닫힐 때 처리할 로직
        console.log('웹소켓이 종료되었습니다');
        setIsComponentMounted(false);
        setServerHealth(false);
    }

    const handleWebSocketError = (error) => {
        // 웹소켓 오류 발생 시 처리할 로직
        console.log(error)
    }

    //get mic stream
    const getStream = () => {
        console.log("Getting mic");
        return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    };

    const setupMic = async () => {
        try {
            window.stream = audioRecorder.stream = await getStream();
            console.log("Got mic successfully");
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

    const onClicked = async () => {
        if (!audioRecorder.recording) {
            await start();
        } else {
            await stop(true);
        }
        if(handleWaveForm) {
            handleWaveForm()
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
            if (audioRecorder.stage === "start" && energy > args.get("start_threshold")) {
                audioRecorder.stage = "speaking";
            } else if (audioRecorder.stage === "speaking") {
                if (energy > args.get("end_threshold")) {
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

        ///////////// WAV Encode /////////////////
        // from http://typedarray.org/from-microphone-to-wav-with-getusermedia-and-web-audio/
        //

        // we create our wav file
        let buffer = new ArrayBuffer(44 + interleaved.length * 2);
        let view = new DataView(buffer);

        // RIFF chunk descriptor
        writeUTFBytes(view, 0, "RIFF");
        view.setUint32(4, 44 + interleaved.length * 2, true);
        writeUTFBytes(view, 8, "WAVE");
        // FMT sub-chunk
        writeUTFBytes(view, 12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        // stereo (2 channels)
        view.setUint16(22, 2, true);
        view.setUint32(24, audioRecorder.sampleRate, true);
        view.setUint32(28, audioRecorder.sampleRate * 4, true);
        view.setUint16(32, 4, true);
        view.setUint16(34, 16, true);
        // data sub-chunk
        writeUTFBytes(view, 36, "data");
        view.setUint32(40, interleaved.length * 2, true);

        // write the PCM samples
        let lng = interleaved.length;
        let index = 44;
        let volume = 1;
        for (let i = 0; i < lng; i++) {
            view.setInt16(index, interleaved[i] * (0x7fff * volume), true);
            index += 2;
        }

        // our final binary blob
        const blob = new Blob([view], { type: audioRecorder.type });
        const audioUrl = URL.createObjectURL(blob);
        if(continuousRecording) {
            if (!isFinish) {
                await onStop({
                    blob: blob,
                    url: audioUrl,
                    type: audioRecorder.type,
                });
                await start();
            }
        } else {
            await onStop({
                blob: blob,
                url: audioUrl,
                type: audioRecorder.type,
            });
            if(wavesurferRef) {
                wavesurferRef.current.microphone.stopDevice();

            }
        }
        
    };

    const onStop = async (data) => {
        const byteObj = await data.blob;
        if (websocketRef.current.readyState === WebSocket.OPEN) {
            console.log('new message')
            websocketRef.current.send(byteObj);
        }
    };

    return (
        <Button variant="contained" 
            color={color} 
            sx={btnStyle}
            onClick={onClicked}>
            {text}
            {recordIcon}
        </Button>
    );
};
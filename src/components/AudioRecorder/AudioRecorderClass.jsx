import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import React from "react";
import { Context } from '../../context/Context';
import { Button } from '@mui/material';

class AudioRecorder extends React.Component {
  constructor(props) { 
    super(props);
    this.state = { 
      color: this.props.args.get("neutral_color"),
      socketData: '',
    }
    this.websocket = null; 
  }

  static contextType = Context;

  // context;
  stream = null;
  AudioContext = window.AudioContext || window.webkitAudioContext;
  type = "audio/wav";
  sampleRate = null;
  phrase_buffer_count = null;
  pause_buffer_count = null;
  pause_count = 0;
  stage = null;
  volume = null;
  audioInput = null;
  analyser = null;
  recorder = null;
  recording = false;
  leftchannel = [];
  rightchannel = [];
  leftBuffer = null;
  rightBuffer = null;
  recordingLength = 0;
  tested = false;


  componentDidMount() {
    this.websocket = new WebSocket('wss://sound.bs-soft.co.kr/ws/byte');

    // 웹소켓 이벤트 핸들러 등록
    this.websocket.onopen = this.handleWebSocketOpen;
    this.websocket.onmessage = this.handleWebSocketMessage;
    this.websocket.onclose = this.handleWebSocketClose;
    this.websocket.onerror = this.handleWebSocketError;
  }

  componentWillUnmount() {
    // 웹소켓 연결 닫기
    if (this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.close();
    }
  }
  handleWebSocketOpen = (event) => {
    // 웹소켓 연결이 열릴 때 처리할 로직
    console.log('웹소켓에 연결되었습니다.');
    const { setServerHealth } = this.context;
    setServerHealth(true);
  }

  handleWebSocketMessage = (event) => {
    // 웹소켓 메시지 수신 시 처리할 로직
    // console.log('수신받은 메시지: ', event);
    const msg = JSON.parse(event.data);

    this.props.handleDataUpdate(msg.data);
  }

  handleWebSocketClose = (event) => {
    // 웹소켓 연결이 닫힐 때 처리할 로직
    console.log('웹소켓이 종료되었습니다');
    const { setServerHealth } = this.context;
    setServerHealth(false);

  }

  handleWebSocketError = (error) => {
    // 웹소켓 오류 발생 시 처리할 로직
    console.log(error)
  }

  //get mic stream
  getStream = () => {
    console.log("Getting mic");
    return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  };

  setupMic = async () => {
    try {
      window.stream = this.stream = await this.getStream();
      console.log("Got mic successfully");
    } catch (err) {
      console.log("Error: Issue getting mic", err);
    }

    this.startRecording();
  };

  closeMic = () => {
    this.stream.getAudioTracks().forEach((track) => {
      track.stop();
    });
    this.audioInput.disconnect(0);
    this.analyser.disconnect(0);
    this.recorder.disconnect(0);
  };

  writeUTFBytes = (view, offset, string) => {
    let lng = string.length;
    for (let i = 0; i < lng; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  mergeBuffers = (channelBuffer, recordingLength) => {
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

  interleave = (leftChannel, rightChannel) => {
    let length = leftChannel.length + rightChannel.length;
    let result = new Float32Array(length);

    let inputIndex = 0;

    for (let index = 0; index < length; ) {
      result[index++] = leftChannel[inputIndex];
      result[index++] = rightChannel[inputIndex];
      inputIndex++;
    }
    return result;
  };

  startRecording = () => {
    console.log("Starting recording");
    let input_sample_rate = this.props.args.get("sample_rate");
    if (input_sample_rate === null) {
      this.context = new this.AudioContext();
      this.sampleRate = this.context.sampleRate;
    } else {
      this.context = new this.AudioContext(
        {"sampleRate": input_sample_rate}
      );
      this.sampleRate = input_sample_rate;
    }

    // create buffer states counts
    let bufferSize = 2048;
    let seconds_per_buffer = bufferSize / this.sampleRate;
    this.pause_buffer_count = Math.ceil(
      this.props.args.get("pause_threshold") / seconds_per_buffer
    );
    this.pause_count = 0;
    this.stage = "start";

    // creates a gain node
    this.volume = this.context.createGain();

    // creates an audio node from teh microphone incoming stream
    if (this.stream === null) {
      console.log("Error: Stream is null");
      return;
    }
    this.audioInput = this.context.createMediaStreamSource(this.stream);

    // Create analyser
    this.analyser = this.context.createAnalyser();
    console.log(this.analyser.fftSize);

    // connect audio input to the analyser
    this.audioInput.connect(this.analyser);

    // connect analyser to the volume control
    // analyser.connect(volume);

    this.recorder = this.context.createScriptProcessor(bufferSize, 2, 2);

    // we connect the volume control to the processor
    // volume.connect(recorder);

    this.analyser.connect(this.recorder);

    // finally connect the processor to the output
    this.recorder.connect(this.context.destination);

    const self = this;  // to reference component from inside the function
    console.log("Recorder created");
    this.recorder.onaudioprocess = function (e) {
      // Check
      if (!self.recording) return;
      // Do something with the data, i.e Convert this to WAV
      let left = e.inputBuffer.getChannelData(0);
      // let right = e.inputBuffer.getChannelData(1);

      if (!self.tested) {
        self.tested = true;
        // if this reduces to 0 we are not getting any sound
        if (!left.reduce((a, b) => a + b)) {
          alert('호환되지 않는 마이크 또는 브라우저입니다.');
          // clean up;
          self.stop(true);
          self.stream.getTracks().forEach(function (track) {
            track.stop();
          });
          self.context.close();
        }
      }
      // Check energy level
      let energy = Math.sqrt(
        left.map((x) => x * x).reduce((a, b) => a + b) / left.length
      );
      // console.log(energy);
      if (self.stage === "start" && energy > (self.props.args.get("start_threshold"))) {
        self.stage = "speaking";
      } else if (self.stage === "speaking") {
        if (energy > self.props.args.get("end_threshold")) {
          self.pause_count = 0;
        } else {
          self.pause_count += 1;
          if (self.pause_count > self.pause_buffer_count) {
            self.stop(false);
          }
        }
      }
      // let radius = 33.0 + Math.sqrt(1000.0 * energy);
      // this.props.setRadius(radius.toString());

      // we clone the samples
      self.leftchannel.push(new Float32Array(left));
      // self.rightchannel.push(new Float32Array(right));
      self.rightchannel.push(new Float32Array(left));
      self.recordingLength += bufferSize;
    };
    // this.visualize();
  };

  start = async () => {
    this.recording = true;
    console.log("Recording started");
    this.setState({
      color: this.props.args.get("recording_color")
    })
    await this.setupMic();
    // reset the buffers for the new recording
    this.leftchannel.length = this.rightchannel.length = 0;
    this.recordingLength = 0;
  }

  stop = async (isFinish) => {
    this.recording = false;
    this.setState({
      color: this.props.args.get("neutral_color")
    })
    this.closeMic();
    console.log(this.recordingLength);

    // we flat the left and right channels down
    this.leftBuffer = this.mergeBuffers(this.leftchannel, this.recordingLength);
    this.rightBuffer = this.mergeBuffers(
      this.rightchannel,
      this.recordingLength
    );
    // we interleave both channels together
    let interleaved = this.interleave(this.leftBuffer, this.rightBuffer);

    ///////////// WAV Encode /////////////////
    // from http://typedarray.org/from-microphone-to-wav-with-getusermedia-and-web-audio/
    //

    // we create our wav file
    let buffer = new ArrayBuffer(44 + interleaved.length * 2);
    let view = new DataView(buffer);

    // RIFF chunk descriptor
    this.writeUTFBytes(view, 0, "RIFF");
    view.setUint32(4, 44 + interleaved.length * 2, true);
    this.writeUTFBytes(view, 8, "WAVE");
    // FMT sub-chunk
    this.writeUTFBytes(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    // stereo (2 channels)
    view.setUint16(22, 2, true);
    view.setUint32(24, this.sampleRate, true);
    view.setUint32(28, this.sampleRate * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    // data sub-chunk
    this.writeUTFBytes(view, 36, "data");
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
    const blob = new Blob([view], { type: this.type });
    const audioUrl = URL.createObjectURL(blob);

    if (!isFinish) {
      await this.onStop({
        blob: blob,
        url: audioUrl,
        type: this.type,
      });
      await this.start();
    }
  };

  render = () => {
    const text = this.props.args.get("text");

    return (
      <Button
        color={this.state.color}
        onClick={this.onClicked}
      >
        {text}
        <KeyboardVoiceIcon
        />
      </Button>
    )
  }

  onClicked = async () => {
    if (!this.recording){
      await this.start()
    } else {
      await this.stop(true);
    }
  }

  onStop = async (data) => {
    const byteObj = await data.blob;
    if (this.websocket.readyState === WebSocket.OPEN) {
      console.log('new message')
      this.websocket.send(byteObj);
    }
  };

}

export default AudioRecorder

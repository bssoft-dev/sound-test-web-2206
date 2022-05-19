import React from "react";
import Waveform from "./Waveform";

class WaveformContainer extends React.Component {
  constructor() {
    super();

    this.togglePlay = this.togglePlay.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.resetPlayhead = this.resetPlayhead.bind(this);

    this.state = {
      isPlaying: false,
      isAtBeginning: true,
      urls: [{url: require("./Sample1.wav"), name: 'track 1'}]
    };
  }

  togglePlay() {
    this.setState({
      isPlaying: !this.state.isPlaying,
      isAtBeginning: false
    });
  }

  resetPlayhead() {
    this.setState({ isAtBeginning: true });
  }

  fileUpload(event) {
    const file = event.target.files[0];
    console.log(event.target.files)
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        this.setState(prevState => ({
          urls: [...prevState.urls, {url: reader.result, name: 'test'}]
        }));
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  render() {
    const waveforms = [];
    this.state.urls.map(url => {
      console.log(url);
      waveforms.push(
        <div>
          <Waveform
            src={url.url}
            isPlaying={this.state.isPlaying}
            isAtBeginning={this.state.isAtBeginning}
          />
         {url.name}
        </div>
      );
    });

    return (
      <div>
        {waveforms}
        <button onClick={this.togglePlay}>play/pause</button>
        <button onClick={this.resetPlayhead}>reset playhead</button>
        <input type="file" onChange={this.fileUpload} />
      </div>
    );
  }
}

export default WaveformContainer;

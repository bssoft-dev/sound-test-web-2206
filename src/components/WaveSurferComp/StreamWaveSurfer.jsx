import { useEffect } from "react";
import { StreamCtx } from "../../context/StreamContext";
import WaveSurferComp from "./WaveSurferComp";

export default function StreamWaveSurfer() {
  const streamContext = StreamCtx();
  const { tempFile } = streamContext;
  useEffect(() => {
    console.log('stream' ,tempFile)
  }, [tempFile])

  return (<WaveSurferComp tempFile={tempFile} />);
}
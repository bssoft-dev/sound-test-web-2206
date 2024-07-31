import React, { useEffect } from "react";
import WaveSurferComp from "./WaveSurferComp";
import { useStreamStore } from "../../stores/useStreamStore";
import { shallow } from "zustand/shallow";

export default function StreamWaveSurfer() {
  const { tempFile } = useStreamStore(
    state => ({
      tempFile: state.tempFile,
    }), shallow
  )
  useEffect(() => {
    console.log('stream' ,tempFile)
  }, [tempFile])

  return (<WaveSurferComp tempFile={tempFile} />);
}
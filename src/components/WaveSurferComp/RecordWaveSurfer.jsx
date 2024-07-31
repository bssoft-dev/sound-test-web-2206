import React from "react";
import { shallow } from "zustand/shallow";
import { useRecordStore } from "../../stores/useRecordStore";
import WaveSurferComp from "./WaveSurferComp";

export default function RecordWaveSurfer() {
  const { tempFile } = useRecordStore(
    state => ({
      tempFile: state.tempFile,
    }), shallow
  );

  return (<WaveSurferComp tempFile={tempFile} />);
}
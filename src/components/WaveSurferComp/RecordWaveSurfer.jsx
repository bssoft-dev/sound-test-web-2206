import { RecordCtx } from "../../context/RecordContext";
import WaveSurferComp from "./WaveSurferComp";

export default function RecordWaveSurfer() {
  const recordContext = RecordCtx();
  const { tempFile } = recordContext;

  return (<WaveSurferComp tempFile={tempFile} />);
}
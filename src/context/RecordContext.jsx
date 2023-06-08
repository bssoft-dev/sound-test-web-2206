import React, { createContext, useContext, useState } from "react";

export const RecordContext = createContext();

export function RecordContextProvider({ children }) {
    const [record, setRecord] = useState(false);
    const [tempFile, setTempFile] = useState(null);
    const [downloadLinkURL, setDownloadLinkURL] = useState(null);

  const onData = recordedBlob => {
    console.log("chunk of real-time data is: ", recordedBlob); // 'audio/ogg'
  };
  
  const onStop = recordedBlob => {
    setTempFile(recordedBlob); // 'audio/wav'
    console.log('tempFile', tempFile)
  };

  const onSave = recordedBlob => {
    setDownloadLinkURL(recordedBlob.blobURL);
  }

    return (
      <RecordContext.Provider value={{
        record, setRecord, tempFile, setTempFile, downloadLinkURL, setDownloadLinkURL,
        onData, onStop, onSave
        }}>
        { children }
      </RecordContext.Provider>
    )
}
export const RecordCtx = () => useContext(RecordContext);
import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout/Layout";
import { withAuth } from "../hooks/withAuth";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

function TestPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobs, setRecordedBlobs] = useState([]);
  const [currentFileSize, setCurrentFileSize] = useState(0);
  const [currentFileNumber, setCurrentFileNumber] = useState(0);
  let mediaRecorder;

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            setRecordedBlobs((prevBlobs) => [...prevBlobs, event.data]);
            setCurrentFileSize((prevSize) => prevSize + event.data.size);

            if (currentFileSize >= MAX_FILE_SIZE) {
              console.log('aaaa')
              saveRecording();
              startNewFile();
            }
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
      })
      .catch(error => {
        console.error('녹음을 시작할 수 없습니다:', error);
      });
  };

  const saveRecording = () => {
    const blob = new Blob(recordedBlobs, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);

    // 여기에서 녹음된 Blob 데이터를 저장하거나 처리할 수 있습니다.
    // 예를 들면 파일 업로드 등을 수행할 수 있습니다.
  };

  const startNewFile = () => {
    setRecordedBlobs([]);
    setCurrentFileSize(0);
    setCurrentFileNumber((prevNumber) => prevNumber + 1);
  };

  useEffect(() => {
    if (isRecording) {
      // 일정 시간 후 녹음 중단
      const stopRecordingTimeout = setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, 10000); // 예시로 10초 녹음 후 중단

      return () => {
        clearTimeout(stopRecordingTimeout);
      };
    }
  }, [isRecording]);

  return (
  <Layout title="TestPage">
    {/* <div>
      <button onClick={isRecording ? null : startRecording}>
        {isRecording ? '녹음 중...' : '녹음 시작'}
      </button>
    </div> */}
  </Layout>)
}

export default withAuth(TestPage);
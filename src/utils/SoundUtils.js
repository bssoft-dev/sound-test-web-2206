import axios from "axios";

function download(downloadUrl, recKey, fileNameTail){
  axios({
    url: downloadUrl,
    method: 'GET',
    responseType: 'blob', // important
  }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', recKey+ '-' + fileNameTail);
      document.body.appendChild(link);
      link.click();
  });
}

export default class SoundUtils {
  // 재생 버튼 클릭 callback
  static showWav(data, setFile) {
    const baseUrl = 'https://sound.bs-soft.co.kr/download-single/';
    // data.field 값의 예시 - oriStatus, bssStatus, bss2Status
    const wavType = data.field.split('Sta')[0];
    const url = data.row[wavType+'UrlBase']
    let tempData = url.map(function(item) {
      console.log(item);
      const fileName = item.toString().split('/')[4];
      const downUrl = baseUrl + fileName;
      const tempFile = { blobURL : downUrl , title : fileName.split('_')[1].split('.')[0], name : fileName };
      return tempFile
    });
    setFile(tempData);
  }

  // 다운 버튼 클릭 callback  
  static downWav(data) {
    console.log('data: ', data);
    const baseUrl = 'https://sound.bs-soft.co.kr/download-single/';
    // wav 파일의 url 주소를 파싱하여 recKey-ori와 같은 형식으로 만들어 줌 
    const recKey = data.id
    const wavType = data.field.split('Sta')[0];
    if (wavType !== 'sep') {
      const downloadUrl = baseUrl + recKey + '-' + wavType + '_ch0.wav';
      download(downloadUrl, recKey, wavType+'.wav');
    } else {
      const downloadUrl = 'https://sound.bs-soft.co.kr/download/' + recKey + '-sep';
      download(downloadUrl, recKey, wavType+'.zip');
    }
  }

  static memoPost(data, fetchData) {
    axios({
      url: `https://sound.bs-soft.co.kr/data/memo`,
      method: 'POST',
      data: {recKey:data.id, content:data.value}
    }).then(res => {
      fetchData()
    }).catch(err => {
      console.log(err)
    });
  }

  static headersByType = {
    delete: '삭제',
    ori: '원음',
    reduc: '노이즈 제거',
    reduc2: '노이즈 제거2',
    sep: '1파일 화자분리', 
  };


  static getColumns = (fieldColumns) => {
    const columns = [
      { field: "id", hide: true },
      { field: "recKey", headerName: "recKey", width: 150 },
      ...fieldColumns,
      { field: "oriUrlBase", headerName: "음원 URL", hide: true },
      { field: "reducUrlBase", headerName: "노이즈 제거 URL", hide: true },
      { field: "reduc2UrlBase", headerName: "노이즈 제거2 URL", hide: true },
      { field: "receivedTime", headerName: "업로드 시각", width: 150 },
      { field: "duration", headerName: "음원 길이"},
      { field: "reducprocTime", headerName: "노이즈 제거 처리시간", width: 150},
      { field: "reduc2procTime", headerName: "노이즈 제거2 처리시간", width: 150},
      { field: "sepprocTime", headerName: "1파일 화자분리 처리시간", width: 150},
      { field: "memo", headerName: "메모", editable: true, width: 500 },
    ];
    const moveValue = (array, fromIndex, toIndex) => {
      const item = array.splice(fromIndex, 1)[0];
      array.splice(toIndex, 0, item);
      return array;
    }
    return moveValue(columns, 1, 2);
  };
}
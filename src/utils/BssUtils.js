import axios from "axios";

export default class BssUtils {
  static showWav(data, setFile) {
    const baseUrl = 'https://bss.bs-soft.co.kr/download-single/';
    const wavType = data.field.split('Sta')[0];
    const url = data.row[wavType + 'UrlBase'];
    let tempData = url.map(function(item) {
      const fileName = item.toString().split('/')[5];
      const downUrl = baseUrl + fileName;
      const tempFile = { blobURL: downUrl, title: fileName.split('_')[1].split('.')[0], name: fileName };
      return tempFile;
    });
    setFile(tempData);
  }

  static downWav(data) {
    const baseUrl = 'https://bss.bs-soft.co.kr/download/';
    const wavType = data.field.split('Sta')[0];
    const url = data.row[wavType + 'UrlBase'];
    const wavTag = url.toString().split('/')[5].split('_')[0];
    const downloadUrl = baseUrl + wavTag;
    axios({
      url: downloadUrl,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', wavTag + '.zip');
      document.body.appendChild(link);
      link.click();
    });
  }

  static memoPost(data, fetchData) {
    axios({
      url: `https://bss.bs-soft.co.kr/data/memo`,
      method: 'POST',
      data: { recKey: data.id, content: data.value }
    }).then(res => {
      fetchData();
    }).catch(err => {
      console.log(err);
    });
  }

  static headersByType = {
    ori: '원음',
    bss: '화자분리(BSS-1)',
    bss2: '화자분리(BSS-2)',
    bss3: '화자분리(BSS-3)',
  };

  static getColumns = (fieldColumns) => {
    return [
      { field: "id", hide: true },
      { field: "recKey", headerName: "recKey", width: 150 },
      ...fieldColumns,
      { field: "oriUrlBase", headerName: "음원 URL", hide: true },
      
      { field: "receivedTime", headerName: "업로드 시각", width: 150 },
      { field: "duration", headerName: "음원 길이" },
      { field: "bssprocTime", headerName: "BSS1 처리시간", width: 110 },
      { field: "bss2procTime", headerName: "BSS2 처리시간", width: 110 },
      { field: "bss3procTime", headerName: "BSS3 처리시간", width: 110 },
      { field: "memo", headerName: "메모", editable: true, width: 500 }
    ];
  };
  
}



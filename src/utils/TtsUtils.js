import axios from "axios";

export default class TtsUtils {
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
        delete: '삭제',
        name: 'TTS',
    };
    static getColumns = (fieldColumns) => {
        const columns = [
          { field: "id", hide: true },
          { field: "recKey", headerName: "recKey", width: 150 },
          ...fieldColumns,
          { field: 'processingTime', headerName: '처리 시간', width: 150 },
          { field: 'duration', headerName: '음원 길이', width: 150 },
          { field: 'uploadTime', headerName: '업데이트 시각', width: 150 },
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
import {React, useState, useEffect} from "react";
import { makeStyles } from "@mui/styles";
import Button from '@mui/material/Button';
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

import {v4 as uuidv4} from "uuid";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 380, 
    width: '100%',
    margin: 10
  }
}));


export default function RecordTable({ regions, setFile, rows, fetchData }){
  const classes = useStyles();
  
  useEffect(() => {
    console.log("Loading...");
    fetchData();
  }, []);

  function showWav(data) {
    const baseUrl = 'http://sound.bs-soft.co.kr/download-single/';
    console.log(data);
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
  
  function downWav(data) {
    const baseUrl = 'http://sound.bs-soft.co.kr/download-single/';
    // wav 파일의 url 주소를 파싱하여 recKey-ori와 같은 형식으로 만들어 줌 
    const recKey = data.id
    const wavType = data.field.split('Sta')[0];
    const downloadUrl = baseUrl + recKey + '-' + wavType + '_ch0.wav';
    axios({
      url: downloadUrl,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', recKey+ '-' + wavType + '.wav');
        document.body.appendChild(link);
        link.click();
    });
  }

  function memoPost(data) {
    axios({
      url: `http://sound.bs-soft.co.kr/data/memo`,
      method: 'POST',
      data: {recKey:data.id, content:data.value}
    }).then(res => {
      fetchData()
    }).catch(err => {
      console.log(err)
    });
  }

  function soundFields(params) {
    return (
      <>
        {params.value.toString()}
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginLeft: "10px" }}
          disabled = {params.value.toString() === 'Ready' ? true : false}
          onClick={() => showWav(params)} 
        >
          재생
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginLeft: "10px" }}
          disabled = {params.value.toString() === 'Ready' ? true : false}
          onClick={() => downWav(params)}
        >
          다운
        </Button>
      </>
    );
  }

  const headersByType = {
    ori: '원음',
    reduc: '노이즈 제거'
  }

  function setColumn(type) {
    return { 
      field: type + "Status", 
      headerName: headersByType[type], 
      width: 250,
      renderCell: (params) => (
        soundFields(params)
      )
    };
  }
  
  const columns = [
    { field: "id", hide: true },
    { field: "recKey", headerName: "recKey", width: 150 },
    setColumn('ori'),
    setColumn('reduc'),
    { field: "oriUrlBase", headerName: "음원 URL", hide: true },
    { field: "reducUrlBase", headerName: "노이즈 제거 URL", hide: true },
    { field: "receivedTime", headerName: "업로드 시각", width: 150 },
    { field: "duration", headerName: "음원 길이"},
    { field: "reducprocTime", headerName: "노이즈 제거 처리시간", width: 150},
    { field: "memo", headerName: "메모", editable: true, width: 500 },
  ];
  
  return (
    <div className={classes.root}>
      <DataGrid 
        rows={rows} 
        columns={columns} 
        pageSize={5}
        rowsPerPageOptions={[5]}
        onCellEditCommit={(params, event) => {
          memoPost(params);
        }}
        
        // checkboxSelection
        // disableSelectionOnClick
        />
    </div>
  );
}
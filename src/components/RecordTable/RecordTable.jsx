import {React, useState, useEffect} from "react";
import BssUtils from "../../utils/BssUtils";
import SoundUtils from "../../utils/SoundUtils";
import { useCtx } from "../../context/Context";

import { Button, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { blue } from "@mui/material/colors";

import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 388,
    width: '100%',
    marginBottom: 24,
    backgroundColor: '#fff',
  }
}));

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}:nth-of-type(even)`]: {
    backgroundColor: theme.palette.grey[100],
    '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.grey[400],
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity,
        ),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: blue[50],
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
  [`& .${gridClasses.columnHeaders}`] : {
    backgroundColor: theme.palette.grey[200],
  },
  // [`& .${gridClasses.iconSeparator}`] : {
  //   color: theme.palette.grey[100],
  // },
}));

export default function RecordTable({ fetchDatahandle, rowsData }) {
  const classes = useStyles();
  const context = useCtx();
  
  const location = useLocation();
  const { pathname } = location;
  const {setFile, rows} = context;

  const { showWav, downWav, memoPost, headersByType, getColumns } = pathname === "/sound-test" ? SoundUtils : BssUtils;
 
  function soundFields(params) {
    return ( <>
      {String(params.value)}
      <Button
        variant="contained"
        color="primary"
        size="small"
        style={{ marginLeft: "10px" }}
        disabled={String(params.value) === 'Ready' ? true : false}
        onClick={() => showWav(params, setFile)}
      >
        재생
      </Button>
      <Button
        variant="contained"
        color="info"
        size="small"
        style={{ marginLeft: "10px" }}
        disabled={String(params.value) === 'Ready' ? true : false}
        onClick={() => downWav(params)}
      >
        다운
      </Button>
    </>);
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
  };
  const fieldColumns = Object.keys(headersByType).map((type) => setColumn(type));

  const columns = getColumns(fieldColumns);

  return (
    <Paper className={classes.root}>
      <StripedDataGrid
        rows={rowsData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onCellEditCommit={(params, event) => {
          memoPost(params, fetchDatahandle);
        }}
      />
    </Paper>
  );
}
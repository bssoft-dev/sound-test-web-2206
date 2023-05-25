import {React, useState, useEffect} from "react";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from "@mui/x-data-grid";

import { blue } from "@mui/material/colors";

import { v4 as uuidv4 } from "uuid";

import BssUtils from "../../utils/BssUtils";
import SoundUtils from "../../utils/SoundUtils";
import { useCtx } from "../../context/Context";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 388,
    width: '100%',
    marginBottom: 24,
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
  }
}));



export default function RecordTable({ regions, setFile, rows, fetchData, isBss }) {
  const context = useCtx();
  const {pathname} = context;

  const classes = useStyles();

  useEffect(() => {
    console.log("Loading...");
    fetchData();
  }, []);

  const { showWav, downWav, memoPost, headersByType, getColumns } = pathname === "/sound-test" ? SoundUtils : BssUtils;
 
  function soundFields(params) {
    return (
      <>
        {params.value.toString()}
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginLeft: "10px" }}
          disabled={params.value.toString() === 'Ready' ? true : false}
          onClick={() => showWav(params, setFile)}
        >
          재생
        </Button>
        <Button
          variant="contained"
          color="info"
          size="small"
          style={{ marginLeft: "10px" }}
          disabled={params.value.toString() === 'Ready' ? true : false}
          onClick={() => downWav(params)}
        >
          다운
        </Button>
      </>
    );
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
    <div className={classes.root}>
      <StripedDataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onCellEditCommit={(params, event) => {
          memoPost(params, fetchData);
        }}
      />
    </div>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import BssUtils from "../../utils/BssUtils";
import SoundUtils from "../../utils/SoundUtils";
import TtsUtils from "../../utils/TtsUtils";

import { Button, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { blue } from "@mui/material/colors";

import { useStore } from "../../stores/useStore";
import { shallow } from "zustand/shallow";
import DeleteRow from "./deleteRow";


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
  [`& .${gridClasses.columnHeaders}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  // [`& .${gridClasses.iconSeparator}`] : {
  //   color: theme.palette.grey[100],
  // },
}));

export default function RecordTable({ fetchDatahandle, rowsData }) {
  const classes = useStyles();
  const { pathname, setFile } = useStore(
    state => ({
      pathname: state.pathname,
      setFile: state.setFile
    }), shallow
  );

  const { showWav, downWav, memoPost, headersByType, getColumns } = useMemo(() => {
    switch(pathname) {
      case '/bss-test':
        return BssUtils || {};
      case '/tts-test':
        return TtsUtils || {};
      default:
        return SoundUtils || {};
    }
  }, [pathname]);
  // const { showWav, downWav, memoPost, headersByType, getColumns } = pathname === "/sound-test" ? SoundUtils : BssUtils;

  function soundFields(params) {
    return (<>
      {String(params.value)}
      <Button
        variant="contained"
        color="primary"
        size="small"
        style={{ marginLeft: "auto" }}
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
    if (type === 'delete') {
      return {
        field: 'delete',
        headerName: headersByType[type],
        width: 80,
        renderCell: (params) => (
          <DeleteRow params={params} />
        )
      }
    } else if (type === 'name') {
      return {
        field: type,
        headerName: headersByType[type],
        width: 380,
        renderCell: (params) => (
          soundFields(params)
        )
      }
    }

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
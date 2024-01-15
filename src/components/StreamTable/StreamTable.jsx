import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/styles';

import Row from './Row';
import EnhancedTableHead from './EnhancedTableHead';
import { useStreamStore } from '../../stores/useStreamStore';
import { shallow } from 'zustand/shallow';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.grey[300],
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&': {
        position: 'relative',
        zIndex: 0
    },
    '&:nth-of-type(4n-1)': {
        backgroundColor: theme.palette.action.hover,
    },
    '& td': {
        position: 'relative',
        zIndex: 0
    },
    '& td:nth-of-type(2)': {
        zIndex: 2
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)'
    }
}));

export const headCells = [
  {
    id: 'radio',
    numeric: false,
    disablePadding: true,
    label: 'radio',
    hide: true
  },
  {
    id: 'collapse',
    numeric: false,
    disablePadding: true,
    label: '',
  },
  {
    id: 'reckey',
    numeric: false,
    disablePadding: false,
    label: 'reckey',
  },
  {
    id: 'oriUrlBase',
    numeric: false,
    disablePadding: false,
    label: '음원 URL',
  },
  {
    id: 'receivedTime',
    numeric: true,
    disablePadding: false,
    label: '업로드시각',
  },
  {
    id: 'duration',
    numeric: true,
    disablePadding: false,
    label: '음원길이',
  },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function StreamTable() {
  const { rows, setTempFile } = useStreamStore(
    state => ({
      rows: state.rows, 
      setTempFile: state.setTempFile
    }), shallow
  );

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [selectedValue, setSelectedValue] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, name, url, reckey) => {
    setSelected([name]);
    setSelectedValue(name);
    setTempFile({
      blobURL: url,
      reckey: String(reckey).slice(7),
    });
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.length > 0 ? 
                visibleRows.map((row, index) => {
                  return (<Row key={row.reckey} index={index} row={row} handleClick={handleClick} isSelected={isSelected} handleChange={handleChange} selectedValue={selectedValue} />);
                })
                : 
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No rows
                  </TableCell>
                </TableRow>
              }
              {emptyRows > 0 && (
                <TableRow >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

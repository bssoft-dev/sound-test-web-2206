import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { StyledTableCell, StyledTableRow } from './StreamTable';
import { Box, Collapse, IconButton, Radio, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import ItemRow from './ItemRow';


export default function Row(props) {
    const [open, setOpen] = useState(false);
    const { row, index, handleClick, isSelected, selectedValue, handleChange } = props;
    const isItemSelected = isSelected(row.reckey);
    const labelId = row.reckey;
    
    return (<>
      <StyledTableRow
        hover
        onClick={(event) => handleClick(event, row.reckey, row.oriUrlBase, row.reckey)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.reckey}
        selected={isItemSelected}
        sx={{ cursor: 'pointer', position: 'relative', zIndex: 0 }}
        >
        <StyledTableCell padding="checkbox" sx={{display: 'none'}}>
          <Radio
            checked={selectedValue === labelId}
            onChange={handleChange}
            value={labelId}
            name="radio-buttons"
            inputProps={{ 'aria-label': labelId, 'aria-labelledby': labelId }}
          />
        </StyledTableCell>
        <StyledTableCell
            onClick={() => setOpen(!open)}>
            <IconButton
                aria-label="expand row"
                size="small"
            >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
        </StyledTableCell>
        <StyledTableCell>{String(row.reckey).slice(7)}</StyledTableCell>
        <StyledTableCell align="left">{row.oriUrlBase}</StyledTableCell>
        <StyledTableCell align="right">{new Date(row.receivedTime).toLocaleString()}</StyledTableCell>
        <StyledTableCell align="right">{row.duration}</StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
                Streaming History
            </Typography>
            <Table size="small" aria-label="purchases">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Timestemp</TableCell>
                        <TableCell>Url</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {row.history && row.history.map((historyRow) => (
                        <ItemRow key={String(historyRow.timestamp)} historyRow={historyRow}/>
                    ))}
                </TableBody>
            </Table>
            </Box>
        </Collapse>
        </TableCell>
    </TableRow></>)
}
import { useEffect, useState } from "react";
import { Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { StyledTableCell, StyledTableRow } from './StreamTable';

export default function ItemRow({historyRow}) {
    const [itemOpen, setItemOpen] = useState(false);
    return (
        <>
        <TableRow>
            <TableCell
                onClick={() => setItemOpen(!itemOpen)}>
                <IconButton
                    aria-label="expand row"
                    size="small"
                >
                    {itemOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">
                    {String(historyRow.timestamp)}
                </TableCell>
                <TableCell>
                    {historyRow.url}
                </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={itemOpen} timeout="auto" unmountOnExit>
                <Table size="small" aria-label="purchases">
                    <TableHead>
                        <StyledTableRow>
                            <TableCell sx={{borderBottom: 'none'}}></TableCell>
                            <StyledTableCell align="center">이벤트</StyledTableCell>
                            <StyledTableCell align="center">파일이름</StyledTableCell>
                            <StyledTableCell align="center">시작</StyledTableCell>
                            <StyledTableCell align="center">끝</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {historyRow.itemData.map( (item, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{borderBottom: 'none'}}></TableCell>
                                <TableCell align="center">{item.event_label}</TableCell>
                                <TableCell align="center">{String(item.filename)}</TableCell>
                                <TableCell align="center">{item.onset}</TableCell>
                                <TableCell align="center">{item.offset}</TableCell>
                            </TableRow>
                        ) )}
                    </TableBody>
                </Table>
            </Collapse>
            </TableCell>
        </TableRow>
        </>
    )
}
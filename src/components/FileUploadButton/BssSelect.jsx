import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useCtx } from "../../context/Context";

export default function BasicSelect() {
    const context = useCtx();
    const { bssNumPerson, handleNumPerson } = context;

    return (
        <Box sx={{ minWidth: {xs: 80, sm: 100}, marginLeft: { xs: 1, sm: 2 } }}>
            <FormControl fullWidth>
                <InputLabel id="bss-select-label">numPerson</InputLabel>
                <Select
                    labelId="bss-select-label"
                    id="bss-select"
                    value={bssNumPerson}
                    label="numPerson"
                    onChange={handleNumPerson}
                >
                    <MenuItem value={2} selected>2명</MenuItem>
                    <MenuItem value={3}>3명</MenuItem>
                    <MenuItem value={4}>4명</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
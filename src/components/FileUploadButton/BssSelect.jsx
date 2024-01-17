import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { shallow } from "zustand/shallow";
import { useStore } from "../../stores/useStore";

export default function BasicSelect() {
    const { bssNumPerson, handleNumPerson } = useStore(
        state => ({
            bssNumPerson: state.bssNumPerson, 
            handleNumPerson: state.handleNumPerson
        }), shallow
    );

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
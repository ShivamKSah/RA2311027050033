import React from "react";
import {
  Box,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  FormHelperText,
  Typography,
  Stack,
} from "@mui/material";
import { Log } from "logging-middleware/src";

interface PriorityInboxFilterProps {
  n: number;
  setN: (n: number) => void;
  filterType: string;
  setFilterType: (type: string) => void;
}

const PriorityInboxFilter: React.FC<PriorityInboxFilterProps> = ({
  n,
  setN,
  filterType,
  setFilterType,
}) => {
  const handleTypeChange = (event: SelectChangeEvent) => {
    const newType = event.target.value;
    setFilterType(newType);
    Log(
      "frontend",
      "info",
      "component",
      `Priority filter changed: type=${newType}, n=${n}`
    );
  };

  const handleNChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newN = parseInt(event.target.value, 10);
    setN(newN);
    Log(
      "frontend",
      "info",
      "component",
      `Priority filter changed: type=${filterType}, n=${newN}`
    );
  };

  const isNInvalid = isNaN(n) || n < 1 || n > 50;

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={3}
      alignItems="center"
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
          Filter by Type
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            value={filterType}
            onChange={handleTypeChange}
            sx={{ 
              borderRadius: 2,
              bgcolor: "background.paper",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(226, 232, 240, 0.8)",
              }
            }}
          >
            <MenuItem value="All">All Categories</MenuItem>
            <MenuItem value="Placement">Placements Only</MenuItem>
            <MenuItem value="Result">Exam Results</MenuItem>
            <MenuItem value="Event">Campus Events</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ minWidth: { xs: "100%", sm: 160 } }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
          Top N Results
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          value={isNaN(n) ? "" : n}
          onChange={handleNChange}
          error={isNInvalid}
          InputProps={{ 
            inputProps: { min: 1, max: 50 },
            sx: { borderRadius: 2 }
          }}
          helperText={isNInvalid ? "1-50 only" : ""}
        />
      </Box>
    </Stack>
  );
};

export default PriorityInboxFilter;

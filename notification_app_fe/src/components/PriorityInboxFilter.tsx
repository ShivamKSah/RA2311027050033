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
    <Box
      display="flex"
      gap={2}
      mb={3}
      flexDirection={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "stretch", sm: "flex-start" }}
    >
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="type-filter-label">Notification Type</InputLabel>
        <Select
          labelId="type-filter-label"
          value={filterType}
          label="Notification Type"
          onChange={handleTypeChange}
        >
          <MenuItem value="All">All Types</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>

      <FormControl error={isNInvalid} sx={{ minWidth: 150 }}>
        <TextField
          label="Top N"
          type="number"
          value={isNaN(n) ? "" : n}
          onChange={handleNChange}
          error={isNInvalid}
          InputProps={{ inputProps: { min: 1, max: 50 } }}
        />
        {isNInvalid && <FormHelperText>Must be between 1 and 50</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default PriorityInboxFilter;

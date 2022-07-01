import { Search } from '@mui/icons-material';
import { Box, Button, Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import useDebounce from 'hooks/useDebounce';
import { City, ListParams } from 'models';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { initFilterStudent } from '../studentSlice';

export interface StudentFiltersProps {
  filter: ListParams;
  cityList: City[];

  onChange?: (newFilters: ListParams) => void;
  onClear?: () => void;
  onSearchChange?: (newSearch: string) => void;
}

export default function StudentFilters({
  filter,
  cityList,
  onChange,
  onClear,
  onSearchChange,
}: StudentFiltersProps) {
  const [searchValue, setSearchValue] = useState(filter?.name_like ?? '');
  const [triggerSearchChange, setTriggerSearchChange] = useState(false);
  const debounceValue = useDebounce(searchValue, 500);

  useEffect(() => {
    if (!onSearchChange || !triggerSearchChange) return;

    onSearchChange(debounceValue.toString());
  }, [debounceValue, onSearchChange, triggerSearchChange]);

  // Handlers
  const handleSearchValueChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchValue(e.target.value);
    setTriggerSearchChange(true);
  };

  const handleCityChange = (e: SelectChangeEvent<HTMLSelectElement>) => {
    if (!onChange) return;

    const selectedValue = e.target.value;

    const newFilter = {
      ...filter,
      _page: 1,
      // Handle if select `all`
      city: selectedValue,
    };

    onChange(newFilter);
  };

  const handleSortChange = (e: SelectChangeEvent<string>) => {
    if (!onChange) return;

    const selectedValue = e.target.value;
    const [_sort, _order] = selectedValue.split('.');

    const newFilter = {
      ...filter,
      _sort: _sort,
      _order: _order as 'asc' | 'desc',
    };

    onChange(newFilter);
  };

  const handleClearFilter = () => {
    if (!onClear) return;

    if (JSON.stringify(filter) === JSON.stringify(initFilterStudent))
      return toast('No sort found!');

    setSearchValue('');
    setTriggerSearchChange(false);

    onClear();
  };

  return (
    <Box sx={{ marginLeft: '-8px' }}>
      <Grid container spacing={1}>
        {/* Search field */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ m: 1 }} size="small">
            <InputLabel htmlFor="searchByName">Search by name</InputLabel>
            <OutlinedInput
              id="searchByName"
              label="Search by name"
              endAdornment={<Search />}
              value={searchValue}
              onChange={handleSearchValueChange}
            />
          </FormControl>
        </Grid>

        {/* Filter by city */}
        <Grid item xs={12} md={6} lg={3}>
          <FormControl sx={{ m: 1, minWidth: 130 }} size="small" fullWidth>
            <InputLabel id="filterByCity">Filter by city</InputLabel>
            <Select
              labelId="filterByCity"
              value={filter.city ?? ''}
              label="Filter by city"
              onChange={handleCityChange}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>

              {cityList.map((city) => (
                <MenuItem key={city.code} value={city.code}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Sort */}
        <Grid item xs={12} md={6} lg={2}>
          <FormControl sx={{ m: 1, minWidth: 130 }} size="small" fullWidth>
            <InputLabel id="sortBy">Sort</InputLabel>
            <Select
              labelId="sortBy"
              value={filter._sort ? `${filter._sort}.${filter._order}` : ''}
              label="Sort"
              onChange={handleSortChange}
            >
              <MenuItem value="">
                <em>No sort</em>
              </MenuItem>

              <MenuItem value="name.asc">Name ASC</MenuItem>
              <MenuItem value="name.desc">Name DESC</MenuItem>
              <MenuItem value="mark.asc">Mark ASC</MenuItem>
              <MenuItem value="mark.desc">Mark DESC</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Clear all sort */}
        <Grid item xs={12} md={6} lg={1}>
          <Box sx={{ m: 1, width: '100%', paddingTop: '2px' }}>
            <Button variant="outlined" color="primary" fullWidth onClick={handleClearFilter}>
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

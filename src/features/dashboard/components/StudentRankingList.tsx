import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Student } from 'models';

export interface StudentRankingListProps {
  studentList: Student[];
  loading: boolean;
}

const columns = [
  { field: 'id', headerName: '#', width: 70, sortable: false, filterable: false },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'mark', headerName: 'Mark', flex: 1 },
];

export default function StudentRankingList({ studentList, loading }: StudentRankingListProps) {
  const rows = studentList.map((student, index) => ({
    id: index + 1,
    name: student.name,
    mark: student.mark,
  }));

  return (
    <Box>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        hideFooter
        hideFooterPagination
        loading={loading}
      />
    </Box>
  );
}

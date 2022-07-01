import { Box, Button, Slide } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TransitionProps } from '@mui/material/transitions';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { City, Student } from 'models';
import { forwardRef, useState } from 'react';
import { capitalizeString, getMarkColor } from 'utils';

export interface StudentTableProps {
  studentList: Student[];
  loading: boolean;
  cityMap: {
    [key: string]: City;
  };
  onEdit?: (student: Student) => void;
  onRemove?: (student: Student) => void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function StudentTable({ studentList, loading, cityMap, onEdit, onRemove }: StudentTableProps) {
  const [pageSize, setPageSize] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student>({} as Student);

  // Handlers
  const handleClickCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRemoveClick = (student: Student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const handleConfirmDeleteStudent = () => {
    onRemove?.(selectedStudent);
    setOpenDialog(false);
  };

  // Render cols data-grid
  const renderMark = (params: GridRenderCellParams<any>) => (
    <Box color={getMarkColor(params.value)} fontWeight="bold">
      {params.value}
    </Box>
  );

  const renderActionButtons = (params: GridRenderCellParams<Student>) => {
    const student = params.value;

    return (
      <Box>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          style={{ marginLeft: 16 }}
          onClick={() => onEdit?.(student as Student)}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          style={{ marginLeft: 16 }}
          onClick={() => handleRemoveClick(student as Student)}
        >
          Remove
        </Button>
      </Box>
    );
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', maxWidth: 230, flex: 1, sortable: false },
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'gender',
      headerName: 'Gender',
      maxWidth: 230,
      flex: 1,
    },
    {
      field: 'mark',
      headerName: 'Mark',
      maxWidth: 230,
      flex: 1,
      renderCell: renderMark,
    },
    {
      field: 'city',
      headerName: 'City',
      maxWidth: 230,
      flex: 1,
    },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 1,
      renderCell: renderActionButtons,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
    },
  ];

  const rows = studentList.map((student) => ({
    id: student.id,
    name: student.name,
    gender: capitalizeString(student.gender),
    mark: student.mark,
    city: cityMap[student.city]?.name,
    action: student,
  }));

  return (
    <Box>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        loading={loading}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 15]}
      />

      {/* Remove dialog */}
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClickCloseDialog}
        aria-describedby="alert-dialog-remove-student"
      >
        <DialogTitle>Remove a student ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-remove-student">
            Are you sure to remove student named "{selectedStudent?.name}". <br />
            This action can&apos;t be undo.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClickCloseDialog}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleConfirmDeleteStudent}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StudentTable;

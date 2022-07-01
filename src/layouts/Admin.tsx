import { Box } from '@mui/material';
import Dashboard from 'features/dashboard';
import StudentFeature from 'features/student';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

export interface AdminLayoutProps {}

export function AdminLayout(props: AdminLayoutProps) {
  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: '240px 1fr',
        gridTemplateAreas: `"header header" 
                          "sidebar main"`,
        minHeight: '100vh',
      })}
    >
      <Box
        sx={(theme) => ({ gridArea: 'header', borderBottom: `1px solid ${theme.palette.divider}` })}
      >
        <Header />
      </Box>

      <Box
        sx={(theme) => ({ gridArea: 'sidebar', borderRight: `1px solid ${theme.palette.divider}` })}
      >
        <Sidebar />
      </Box>

      <Box sx={(theme) => ({ gridArea: 'main', padding: theme.spacing(2, 3) })}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students/*" element={<StudentFeature />} />
        </Routes>
      </Box>
    </Box>
  );
}

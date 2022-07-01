import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/system';
import config from 'config';
import { NavLink } from 'react-router-dom';

const CustomNavLink = styled(NavLink)(({ theme }) => ({
  color: 'inherit',
  textDecoration: 'none',
  '&.active > li': {
    backgroundColor: '#ebe6e6',
  },
}));

const SIDEBAR = [
  {
    to: config.routes.dashboard,
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    to: config.routes.students,
    title: 'Students',
    icon: <PeopleAltIcon />,
  },
];

export default function Sidebar() {
  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="sidebar">
        <List>
          {SIDEBAR.map((item) => (
            <CustomNavLink key={item.title} to={item.to}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            </CustomNavLink>
          ))}
        </List>
      </nav>
    </Box>
  );
}

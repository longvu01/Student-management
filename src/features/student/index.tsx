import { useAppDispatch } from 'app/hooks';
import { cityActions } from 'features/city/citySlice';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import AddEditPage from './pages/AddEditPage';
import DetailPage from './pages/DetailPage';
import ListPage from './pages/ListPage';

export interface StudentProps {}

export default function StudentFeature(props: StudentProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(cityActions.fetchCityList());
  }, [dispatch]);

  return (
    <Routes>
      <Route index element={<ListPage />} />
      <Route path=":studentId" element={<DetailPage />} />
      <Route path="add" element={<AddEditPage />} />
      <Route path="edit/:studentId" element={<AddEditPage />} />
    </Routes>
  );
}

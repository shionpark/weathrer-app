import { Route, Routes } from 'react-router-dom';

import { DetailPage } from '@/pages/detail/DetailPage';
import { HomePage } from '@/pages/home/HomePage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/detail" element={<DetailPage />} />
    </Routes>
  );
}

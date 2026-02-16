import { Toaster } from 'sonner';

import { Providers } from './providers';
import { AppRouter } from './router';

export default function App() {
  return (
    <Providers>
      <AppRouter />
      <Toaster position="top-center" richColors />
    </Providers>
  );
}

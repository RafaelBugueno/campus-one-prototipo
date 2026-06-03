import { RouterProvider } from 'react-router-dom'; // 👈 Cambiado desde 'react-router'
import { router } from './routes';

export default function App() {
  return <RouterProvider router={router} />;
}

import { useEffect, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import {isAuthenticated} from '../../utils/auth';

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, []);

  return children;
}
  
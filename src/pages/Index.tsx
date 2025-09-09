import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      switch (currentUser.role) {
        case 'student':
          navigate('/student');
          break;
        case 'counselor':
          navigate('/counselor');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/login');
      }
    }
  }, [currentUser, navigate]);

  return null;
};

export default Index;

import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const capitalize = (s: string): string => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  let pageTitle = capitalize(location.pathname.substring(1));
  if (location.pathname === '/') {
    pageTitle = 'Welcome';
  } else if (location.pathname.includes('verify')) {
    pageTitle = 'Verify';
  }

  const handleLogout = () => {
    localStorage.removeItem('login_access_token');
    navigate('/login');
  };

  const renderLogout = () => {
    if (location.pathname === '/home') {
      return (
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    }
    return null;
  };

  return (
    <nav>
      <div>
        <span>{title || pageTitle}</span>
        {renderLogout()}
      </div>
    </nav>
  );
};

export default Header;

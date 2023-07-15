import logo from './logo.svg';
import './App.css';
import IndexPage from './Pages/IndexPage';
import HeaderPage from './Pages/HeaderPage';
import FooterPage from './Pages/FooterPage';
import { UserContext } from './UserContext';

function App() {
  return (
    <>
      <HeaderPage />
      <IndexPage />
      <FooterPage />
    </>
  );
}

export default App;

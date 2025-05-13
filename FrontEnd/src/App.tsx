import './Styles/App.scss';
import HistoryRouter from './Routes/HistoryRouter';
import browserHistory from './Routes/browserHistory';
import ScrollToTop from './Routes/ScrollToTop';
import Header from './Layouts/header/Header';
import { AppRoutes } from './Routes/AppRoutes';

function App() {
  return (
    <div className="App">
      <Header />
    </div>
  );
}

function AppWrapper() {
  return (
    <HistoryRouter history={browserHistory}>
      <ScrollToTop />
      <App />
    </HistoryRouter>
  );
}

export default AppWrapper;

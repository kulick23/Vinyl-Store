import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Styles/App.scss';
import HistoryRouter from './Routes/HistoryRouter';
import browserHistory from './Routes/browserHistory';
import ScrollToTop from './Routes/ScrollToTop';
import { Header, Footer } from './Layouts/index';
import { AppRoutes } from './Routes/AppRoutes';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Initialize language from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en';
    if (savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <NotificationProvider>
      <div className="App">
        <Header />
        <AppRoutes />
        <Footer />
      </div>
    </NotificationProvider>
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

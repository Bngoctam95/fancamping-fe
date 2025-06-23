import AppHeader from 'components/layout/app.header';
import AppFooter from 'components/layout/app.footer';
import { Outlet } from 'react-router-dom';
function Layout() {
    return (
        <div>
            <AppHeader />
            <Outlet />
            <AppFooter />
        </div>
    );
}

export default Layout;

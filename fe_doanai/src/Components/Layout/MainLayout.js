import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Top from '../Top/Top';

const MainLayout = () => {
    return (
        <>
            <Header />
            <main>
                {/* Outlet sẽ là nơi render các component con (Homepage, Introduce, v.v.) */}
                <Outlet />
            </main>
            <Footer />
            <Top />
        </>
    );
};
           


export default MainLayout;
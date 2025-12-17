import React, { useState, useEffect } from 'react';
import './Top.scss';
import { FaArrowUp } from "react-icons/fa6";


const HEADER_HEIGHT = 100; // Chiều cao thực tế của header nếu khác

const Top = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            // Khi header bị mất (scroll vượt qua header)
            if (scrollTop > HEADER_HEIGHT) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // Clean khi component unmount
    }, []);

    // Cuộn trang lên đầu + hiệu ứng
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Phần JSX của Top
    return (
        <div className="app-top">
            {showButton && (
                <button onClick={scrollToTop}>
                    <FaArrowUp />
                </button>
            )}
        </div>
    );
};

export default Top;
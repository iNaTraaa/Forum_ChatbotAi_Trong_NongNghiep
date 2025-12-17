// Thanh tỉ lệ phân tích
import React, { useState, useEffect } from 'react';
import './RecognitionBar.scss';

const RecognitionBar = ({ name, percentage }) => {
    const [animatedWidth, setAnimatedWidth] = useState(0);
    // Màu thanh đổi theo độ chính xác
    const getBarGradientColors = (p) => {
        if (p >= 85) return ['#81FBB8', '#28C76F']; 
        if (p >= 60) return ['#FFE259', '#FFA751'];
        return ['#FF9A8B', '#FF6A88'];            
    };
    const colors = getBarGradientColors(percentage);
    const gradientStyle = `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`;
    const statusColor = colors[1];

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedWidth(percentage);
        }, 100);
        return () => clearTimeout(timer);
    }, [percentage]);

    // Phần JSX của RecognitionBar
    return (
        <div className="recognition-container animated new-design">
            <p className="recognition-title">
                <strong>Đối tượng:</strong> {name}
            </p>
            <div className="recognition-bar-wrapper">
                <div
                    className="recognition-bar-fill"
                    style={{
                        width: `${animatedWidth}%`,
                        background: gradientStyle
                    }}
                >
                </div>
                <span className="recognition-percentage">{percentage}%</span>
            </div>
            <p className="recognition-status" style={{ color: statusColor }}>
                Độ chính xác: {percentage >= 85 ? 'Cao' : percentage >= 60 ? 'Trung bình' : 'Thấp'}
            </p>
        </div>
    );
};

export default RecognitionBar;
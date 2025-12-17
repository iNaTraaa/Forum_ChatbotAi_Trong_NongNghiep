
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaperclip } from "react-icons/fa";
import './Welcome.scss';
import hinhbackground from '../../assets/hinhlogin.jpg';
import { IoMdArrowRoundBack } from "react-icons/io";


// Các hàm quản lý trạng thái và tham chiếu trong components 
const Welcome = React.forwardRef(({ }, ref) => {
    const [question, setQuestion] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [isHomeButtonVisible, setIsHomeButtonVisible] = useState(false);
    // Khi đưa con trỏ chuột vào vùng bên trái 
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (e.clientX < 50) {
                setIsHomeButtonVisible(true);
            } else {
                setIsHomeButtonVisible(false);
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
    // Xử lý về trang chủ
    const handleGoHome = () => {
        navigate('/');
    };
  

    // Hàm xử lý hình ảnh 
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setSelectedImage({ file, previewUrl });
        }
    };

    // Hàm xóa hình ảnh
    const handleRemoveImage = () => {
        if (selectedImage) {
            URL.revokeObjectURL(selectedImage.previewUrl);
        }
        setSelectedImage(null);
    };

    // Xử lý khi người dùng gửi 
    const handleSubmit = (e) => {
        e.preventDefault();
        if (question.trim() || selectedImage) {
            navigate('/Chatbox', { 
                state: {
                    // Chatbox đang chờ `initialQuestion` và `initialImage`
                    initialQuestion: question,
                    initialImage: selectedImage // Gửi toàn bộ file, previewUrl 
                }
            });
        }
    };

   // Phần JSX của Welcome 
    return (
        <div
            className="welcome-container"
            ref={ref}
            style={{
                backgroundImage: `url(${hinhbackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
            }}
        >
            {/* Button trở về trang chủ */}
            {isHomeButtonVisible && (
                <button onClick={handleGoHome} className="home-button">
                    <IoMdArrowRoundBack size={24} />
                    <span>Trang chủ</span>
                </button>
            )}

            <div className="background-overlay"></div>
            <div className="content">
                <h1>DMT</h1>
            {/* Button trở về trang chủ */}
                {selectedImage && (
                    <div className="image-preview-container welcome-preview">
                        <img src={selectedImage.previewUrl} alt="Preview" className="image-preview" />
                        <button onClick={handleRemoveImage} className="remove-preview-btn">&times;</button>
                    </div>
                )}
            {/* Phần nhập liệu */}
                <form onSubmit={handleSubmit}>
                    <div className="search-bar">
                        <FaPaperclip className="input-icon" onClick={() => fileInputRef.current.click()} />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageSelect}
                        />
                        <input
                            type="text"
                            placeholder="Nhập câu hỏi của bạn"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                    </div>
                    {/* Nút "Gửi" ẩn, chỉ gửi khi ấn "Enter"*/}
                    <button type="submit" style={{ display: 'none' }}></button>
                </form>
            </div>
        </div>
    );
});

export default Welcome;
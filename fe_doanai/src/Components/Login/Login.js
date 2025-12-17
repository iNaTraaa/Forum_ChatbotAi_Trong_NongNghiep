
import './Login.scss';
import hinhlogin from '../../assets/login.jpg';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../../Service/UserService';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../store/authStore'; // <-- 1. IMPORT STORE

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Lấy action 'login' từ Store
    const { login } = useAuthStore();

    // Hàm xử lý đăng nhập 
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Vui lòng nhập email và mật khẩu');
            return;
        }
        setLoading(true);
        try {
            const response = await loginApi({ email, password });

            if (response?.data?.access_token && response?.data?.user) {
                // Gọi action 'login' và truyền dữ liệu vào  
                login(response.data.user, response.data.access_token);
                // Thông báo đăng nhập thành công
                toast.success('Đăng nhập thành công!');
                // Điều hướng về trang chủ
                navigate('/');

            } else {
                // Xử lý dữ liệu nếu không hợp lệ 
                setError('Dữ liệu trả về từ server không hợp lệ');
                toast.error('Dữ liệu trả về từ server không hợp lệ');
            }
        // Bắt lỗi trong quá trình đăng nhập
        } catch (err) {
            let errorMessage = 'Đăng nhập thất bại';
            if (err.response) {
                errorMessage = err.response.data?.message || 'Thông tin đăng nhập không đúng';
            } else if (err.request) {
                errorMessage = 'Không thể kết nối đến server';
            } else {
                errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại';
            }
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
       // Phần JSX của Login
        <div
            className="login-container"
            style={{
                backgroundImage: `url(${hinhlogin})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
            }}
        >
            <div className="login-form">
                <h2 className="form-title">Đăng Nhập</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="abc@gmail.com"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                    </button>
                    <div className="register-link" style={{ marginTop: '16px', textAlign: 'center' }}>
                        <span>Chưa có tài khoản? </span>
                        <button
                            className="register-btn"
                            style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                            onClick={() => navigate('/Signup')}
                        >
                            Đăng ký
                        </button>
                        </div>
                    <button
                        className="back-home-btn"
                        onClick={() => navigate('/')}
                    >
                        Quay về trang chủ
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
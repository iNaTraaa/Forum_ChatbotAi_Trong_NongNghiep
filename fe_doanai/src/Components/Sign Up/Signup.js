
import './Signup.scss';
import Login from 'Components/Login/Login';
import hinhlogin from '../../assets/login.jpg';
import { useNavigate } from 'react-router-dom';
import { signupApi } from '../../Service/UserService';
import { useState } from 'react';
import { toast } from 'react-toastify'; // Giả định bạn đã cài đặt react-toastify

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    // State để lưu trữ thông tin đăng ký
    const [formData, setFormData] = useState({
        first_Name: '',
        last_Name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    // Xử lý khi người dùng nhập thông tin vào form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    // Xử lý phần Đăng Kí 
    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);

        // Kiểm tra thông tin đã nhập đầy đủ chưa
        if (
            !formData.first_Name.trim() ||
            !formData.last_Name.trim() ||
            !formData.email.trim() ||
            !formData.password.trim()
        ) { // Nếu chưa nhập đầy đủ, hiển thị thông báo lỗi
            setError('Vui lòng nhập đầy đủ thông tin.');
            toast.error('Vui lòng nhập đầy đủ thông tin.');
            return;
        }
        setLoading(true);

        // Xử lý quá trình Đăng Kí
        try {
            const response = await signupApi(formData);
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                toast.success('Đăng ký thành công!');
                navigate('/Login');
            } else {
                setError('Đăng ký thất bại, vui lòng thử lại.');
                toast.error('Đăng ký thất bại');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    // Phần JSX của phần Signup
    return (
        <div
            className="signup-container"
            style={{
                backgroundImage: `url(${hinhlogin})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div className="signup-form" >
                <h2 className="form-title" style={{ textAlign: 'left', marginBottom: '40px' }}>Đăng Ký</h2>
                <form onSubmit={handleSignup}>
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="text"
                            name="first_Name"
                            placeholder="Họ"
                            value={formData.first_Name}
                            onChange={handleChange}
                            className="form-input"
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px' }}
                            required
                        />
                        <input
                            type="text"
                            name="last_Name"
                            placeholder="Tên"
                            value={formData.last_Name}
                            onChange={handleChange}
                            className="form-input"
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px' }}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px' }}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px' }}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}
                    <button
                        type="submit"
                        className="submit-btn"
                        style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Đăng Ký
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <span>Đã có tài khoản? </span>
                    <button
                        onClick={() => navigate('/Login')}
                        style={{ background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        Đăng Nhập
                    </button>
                </div>
                <button
                    className="back-home-btn"
                    onClick={() => navigate('/')}
                >
                    Quay về trang chủ
                </button>
            </div>
        </div>
    );
};

export default Signup;
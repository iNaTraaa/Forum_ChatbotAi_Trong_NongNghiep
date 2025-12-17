import './Footer.scss'
import logo from '../../assets/Logo.svg';



const Footer = () => {
    // Phần JSX của Footer
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <img src={logo} alt="Digital Microfarm Tech Logo" width="220" height="80" className="footer-logo-img" />
                    <span className="footer-logo-text">Digital Microfarm Tech</span>
                </div>

                <div className="footer-social">
                    <a href="#" aria-label="Facebook"><span role="img" aria-label="facebook">📘</span></a>
                    <a href="#" aria-label="LinkedIn"><span role="img" aria-label="linkedin">🔗</span></a>
                    <a href="#" aria-label="Twitter"><span role="img" aria-label="twitter">🐦</span></a>
                </div>
                <div className="footer-links">
                    <div className="link-column">
                        <h3>Liên kết</h3>
                        <a href="#">Trang chủ</a>
                        <a href="#">Dịch vụ</a>
                        <a href="#">Blog</a>
                    </div>
                    <div className="link-column">
                        <h3>Hỗ trợ</h3>
                        <a href="#">Câu hỏi</a>
                        <a href="#">Chính sách</a>
                        <a href="#">Bảo mật</a>
                    </div>
                    <div className="link-column">
                        <h3>Liên hệ</h3>
                        <a href="#">Facebook</a>
                        <a href="#">Instagram</a>
                        <a href="#">Twitter</a>
                    </div>
                    <div className="link-column">
                        <h3>Khám phá</h3>
                        <a href="#">Hướng dẫn</a>
                        <a href="#">Tài liệu</a>
                        <a href="#">Tin tức</a>
                    </div>
                    <div className="link-column">
                        <h3>Support</h3>
                        <a href="#">Email</a>
                        <a href="#">Hotline</a>
                        <a href="#">Địa chỉ</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <span>© Digital Microfarm Tech 2025. All rights reserved.</span>
            </div>
        </footer>
    );

}


export default Footer;
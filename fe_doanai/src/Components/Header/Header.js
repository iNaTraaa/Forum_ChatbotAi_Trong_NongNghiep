import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { toast } from 'react-toastify';
import './Header.scss';
import logo from '../../assets/Logo.svg';
import { useAuthStore } from '../../store/authStore';

function Header() {
    const navigate = useNavigate();
    
    // Lấy state từ store
    const { isAuthenticated, user, logout } = useAuthStore();

    const handleLogout = () => {
        logout(); 
        toast.info('Bạn đã đăng xuất thành công!');
        navigate('/'); 
    };

    const fullName = isAuthenticated && user
        ? `${user.first_Name?.trim() || ''} ${user.last_Name?.trim() || ''}`
        : '';

    // --- KIỂM TRA QUYỀN ADMIN ---
    // Chấp nhận cả 'admin' (thường) và 'Admin' (hoa) để an toàn
    const isAdmin = user && (user.role === 'admin' || user.role === 'Admin');

    return (
        <Navbar collapseOnSelect expand="lg" className="app-header bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src={logo} 
                        alt="Digital Microfarm Tech Logo"
                        width="150"
                        height="50"
                        className="d-inline-block align-top"
                    />{' '}
                    Digital Microfarm Tech
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto" style={{ paddingLeft: '10%' }}>
                        <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
                        <Nav.Link as={Link} to="/Introduce">Giới thiệu</Nav.Link>
                        <Nav.Link as={Link} to="/Welcome">Dịch vụ</Nav.Link>
                        <Nav.Link as={Link} to="/Forum">Diễn đàn</Nav.Link>
                        <Nav.Link as={Link} to="/Contact">Liên hệ</Nav.Link>
                    </Nav>
                    <Nav>
                        {isAuthenticated ? (
                            <NavDropdown title={`Chào, ${fullName || user?.email}`} id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/profile">
                                    Thông tin tài khoản
                                </NavDropdown.Item>
                                
                                {/* --- SỬA ĐỔI: MỞ TRANG ADMIN TRONG TAB MỚI --- */}
                                {isAdmin && (
                                    <NavDropdown.Item 
                                        href="/admin" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                       Dashboard Quản trị
                                    </NavDropdown.Item>
                                )}
                                {/* --------------------------------------------- */}

                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>
                                    Đăng xuất
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <div className="btn-header">
                                <Link to="/login">
                                    <button className="btnLogin">Đăng Nhập</button>
                                </Link>
                                <Link to="/signup">
                                    <button className="btnSigup">Đăng Kí</button>
                                </Link>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
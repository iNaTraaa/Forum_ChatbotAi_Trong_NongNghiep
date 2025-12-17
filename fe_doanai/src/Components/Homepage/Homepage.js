import imgHomepage from '../../assets/imgHomePage.png';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Homepage.scss'
import matcuoi from '../../assets/matcuoi.png'
import FaqComponent from './Faq';
import StartNow from '../StartNow/StartNow';
import logo from '../../assets/Logo.svg';


const Homepage = () => {
    // JSX của HomePage
    return (
        <Container style={{ padding: '40px 0' }} >
            {/* Nội dung mở đầu */}
            <Row>
                <Col sm={6}>
                    <div className='contentHp'>
                        <h1>Đồng hành cùng nhà nông </h1>
                        <p>Hỗ trợ chăm sóc cây trồng một cách chuyên nghiệp – chẩn đoán kịp thời, dễ dàng từ xa hoặc trực tiếp.</p>
                        <div className='button'>
                            <button className='btnTimHieuNgay'
                            onClick={() => window.location.href = '/Introduce'}
                            >Tìm hiểu ngay</button>
                            <button className='btnBatDau'
                                onClick={() => window.location.href = '/Welcome'}
                            >Bắt đầu ngay</button>
                        </div>
                    </div>
                </Col>
                <Col sm={6}>
                    <div className='imghp' style={
                        {borderRadius:'5px'}
                    }>
                        <img src={imgHomepage} style={{ borderRadius: '5%' }} />
                    </div>

                </Col>
            </Row>

            {/* Giới thiệu AI */}
            <Row>
                <Col sm={6}>
                    <div className='gthieuai'>
                        <div className="about-page">
                            <div className="about-content">
                                <div className="image-section">
                                    <img src={logo} alt="logo" className="logo" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col sm={6}>
                    <div className="text-section">
                        <span className="about-tag">About</span>
                        <h1 className="about-title">
                            Tôi là Digital Microfarm Tech – Trợ lý AI nông nghiệp của bạn
                        </h1>
                        <p className="about-description">
                            Tôi là trợ lý AI thông minh được thiết kế để hỗ trợ bạn trong việc quản lý, chăm sóc cây trồng, phân tích dữ liệu và tối ưu hóa năng suất nông nghiệp của bạn – hỗ trợ chẩn đoán bệnh cây nhanh chóng, chính xác, và hoàn toàn dựa trên dữ liệu thực tế từ khoa học nông nghiệp.
                        </p>
                        <div className="stats">
                            <div className="stat-item">
                                <span className="stat-number">150+</span>
                                <span className="stat-label">Nguồn dữ liệu nông nghiệp tin cậy</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Nguồn ứng dụng tin tức AI</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">1200+</span>
                                <span className="stat-label">Trường hợp được AI dự đoán nhận diện</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">1000+</span>
                                <span className="stat-label">Phương pháp sử dụng AI dự đoán xuất</span>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
           
            {/* Giúp cây trồng */}
            <div className='giupcaytrong' style={{ padding: '40px 0' }}>
                <h1>
                    Giúp cây trồng vững vàng phát triển – với chẩn đoán chính xác, tin cậy và bền vững
                </h1>
            </div>
            <div className='caygapvande' style={{ padding: '60px 0' }}>
                <div className="problem-page">
                    <div className="problem-header">
                        <h1>Cây của bạn đang gặp những vấn đề này?</h1>
                        <p className="problem-description">
                            Bạn có thể không nhận ra ngay, nhưng cây trồng của bạn có thể đang gặp các dấu hiệu bệnh lý. Hệ thống AI của chúng tôi giúp bạn nhận diện sớm và xử lý đúng cách – để cây phục hồi và phát triển mạnh mẽ hơn.
                        </p>
                    </div>
                    <Row className="problem-row">
                        <Col md={6} className="problem-col">
                            <div className="info-card">
                                <div className="icon">🌱</div>
                                <h3>Héo rũ do thiếu nước</h3>
                                <p>Đừng để cây chết khô vì thiếu nước, kiểm tra đất thường xuyên.</p>
                            </div>
                        </Col>
                        <Col md={6} className="problem-col">
                            <div className="info-card">
                                <div className="icon">🌿</div>
                                <h3>Còi cọc do thiếu dinh dưỡng</h3>
                                <p>Tìm hiểu xem cây cần loại dinh dưỡng nào, chăm sóc cây đúng cách.</p>
                            </div>
                        </Col>
                    </Row>
                    <Row className="problem-row">
                        <Col md={4} className="problem-col">
                            <div className="info-card">
                                <div className="icon">🌳</div>
                                <h3>Phát triển chậm do thời tiết</h3>
                                <p>Đừng lo, cây cần điều chỉnh theo thời tiết để phát triển tốt hơn.</p>
                            </div>
                        </Col>
                        <Col md={4} className="problem-col">
                            <div className="info-card">
                                <div className="icon">🍂</div>
                                <h3>Lá vàng do sâu bệnh</h3>
                                <p>Kiểm tra lá thường xuyên để phát hiện và xử lý kịp thời.</p>
                            </div>
                        </Col>
                        <Col md={4} className="problem-col">
                            <div className="info-card">
                                <div className="icon">🍃</div>
                                <h3>Thân bị rụt, thối do nấm</h3>
                                <p>Sử dụng biện pháp phòng ngừa để bảo vệ cây khỏi nấm mốc.</p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Hướng dẫn sử dụng */}
            <div className='howtouse'>
                <div className="info-section">
                    <h1 className="section-title">Làm thế nào để sử dụng ?</h1>
                    <Row className="info-row">
                        <Col md={6} className="info-col">
                            <div className="info-card">
                                <div className="card-icon">🌱</div>
                                <h3>Chẩn đoán nhanh</h3>
                                <p>Nhận diện vấn đề cây trồng trong vài giây với AI tiên tiến.</p>
                            </div>
                        </Col>
                        <Col md={6} className="info-col">
                            <div className="info-card">
                                <div className="card-icon">📊</div>
                                <h3>Phân tích dữ liệu</h3>
                                <p>Cung cấp báo cáo chi tiết dựa trên dữ liệu thực tế.</p>
                            </div>
                        </Col>
                    </Row>

            {/* Ưu điểm của trang */}
                    <Row className="info-row">
                        <Col md={4} className="info-col">
                            <div className="info-card">
                                <div className="card-icon">🌧️</div>
                                <h3>Dự báo thời tiết</h3>
                                <p>Hỗ trợ lập kế hoạch tưới tiêu dựa trên dự báo chính xác.</p>
                            </div>
                        </Col>
                        <Col md={4} className="info-col">
                            <div className="info-card">
                                <div className="card-icon">💧</div>
                                <h3>Quản lý nước</h3>
                                <p>Tối ưu hóa lượng nước để tiết kiệm tài nguyên.</p>
                            </div>
                        </Col>
                        <Col md={4} className="info-col">
                            <div className="info-card">
                                <div className="card-icon">🌞</div>
                                <h3>Hỗ trợ ánh sáng</h3>
                                <p>Đề xuất điều chỉnh ánh sáng cho cây phát triển tốt.</p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Niềm tin từ thực tế */}
            <div className='niemtin'>
                <Container fluid="md">
                    <Row>
                        <Col>
                            <h1>
                               Niềm tin từ thực tế
                            </h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="image-matcuoi">
                                <img src={matcuoi} alt="mat cuoi" className="matcuoiimg" />
                            </div>
                            <div className='infuser'>
                                <h3 style={{ color: 'green' }}>
                                    Nguyen Van A
                                </h3>
                                <h5>
                                    Nông dân
                                </h5>
                                
                            </div>
                        </Col>
                        <Col>
                            <div className="image-matcuoi">
                                <img src={matcuoi} alt="mat cuoi" className="matcuoiimg" />
                            </div>
                            <div className='infuser'>
                                <h3 style={{ color: 'green' }}>
                                    Nguyen Van B
                                </h3>
                                <h5>
                                    Nông dân    
                                </h5>
                               
                            </div>
                        </Col>
                        <Col>
                            <div className="image-matcuoi">
                                <img src={matcuoi} alt="mat cuoi" className="matcuoiimg" />
                            </div>
                            <div className='infuser'>
                                <h3 style={{ color: 'green' }}>
                                    Nguyen Van C
                                </h3>
                                <h5>
                                    Nông dân
                                </h5>
                                
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* FaqComponent (Phần câu hỏi thường gặp) */}
            <FaqComponent />
            {/* Phần liên hệ */}
            <div className='contact'>
                <div className="contact-section">
                    <span className="contact-label">
                        <button> CTA</button>
                    </span>
                    <h2>Liên hệ - An toàn và riêng tư</h2>
                    <p>
                        Chúng tôi cùng cập mốt không gian an toàn, riếng tư để trò chuyền, xú lý vấn
                        đề — không áp lực hay phán xét. Nếu bạn dà săn sáng bắt đầu, tôi luô săn
                        sàng dõng hanh cùng bạn.
                    </p>
                    <div className="button-group">
                        <button className="btn-send" onClick={() => {window.location.href='/Contact'}}>Gửi tin nhắn</button>
                        <button className="btn-schedule">Đặt lịch tư vấn miễn phí</button>
                    </div>
                </div>
            </div>
            <StartNow />
        </Container>

    );
}
export default Homepage;

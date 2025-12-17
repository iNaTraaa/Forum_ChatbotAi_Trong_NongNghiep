import hinhintro from '../../assets/hinhintro.png'
import hinhintro2 from '../../assets/hinhintro2.png';
import hinhintro3 from '../../assets/hinhintro3.png';
import './Introduce.scss';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import StartNow from '../StartNow/StartNow';
import Members from '../Members/Members';



const Introduce = () => {
    // Phần JSX của Introduce
    return (
        <Container style={{ paddingTop: '60px' }} >
            <StartNow />
            {/* Giới thiệu */}
            <div className='aboutIntro' style={{ paddingTop: '20px' }}>
                <Row>
                    <Col style={{ marginLeft: '60px' }}>
                        <h1>
                            Về Digital Microfarm Tech
                        </h1>
                        <p>
                            Tại FarmDoctor, chúng tôi là một nhóm lập trình viên nghiên cứu ứng dụng AI trong việc phát hiện bệnh thực vật và từ hình ảnh, AI sẽ đưa ra nguyên nhân và giải pháp.
                        </p>
                        <button className='btnconnect'
                            onClick={() => window.location.href = '/Forum'}>
                            Kết nối ngay
                        </button>
                    </Col>
                    <Col></Col>
                </Row>
            </div>
            {/* Tiếp cận */}
            <div className='tiepcan' style={{ paddingTop: '60px' }}>
                <Row>
                    <Col>
                        <img src={hinhintro} className='hinhintro' />
                    </Col>
                    <Col>
                        <h2>
                            Cách tiếp cân của chúng tôi
                        </h2>
                        <p style={{ paddingTop: '5px ' }}>
                            Chúng tôi tin rằng:
                        </p>
                        <h5>
                            Lấy sự đồng hành làm trung tâm – bạn và cây trồng của bạn luôn được lắng nghe và thấu hiểu
                        </h5>
                        <h5>
                            Phân tích chính xác, dựa trên dữ liệu thực tế và AI hiện đại – giúp phát hiện sớm và hỗ trợ xử lý bệnh cây hiệu quả
                        </h5>
                        <h5>
                            Bảo mật và an toàn – mọi thông tin hình ảnh và dữ liệu đều được xử lý riêng tư
                        </h5>
                        <h5>
                            Tư vấn phù hợp theo từng tình huống – không áp đặt, chỉ đề xuất giải pháp tốt nhất cho bạn
                        </h5>
                    </Col>
                </Row>
            </div>

            {/* Giải pháp */}
            <div className='giapphap' style={{ paddingTop: '100px' }}>
                <Row>
                    <Col style={{ marginLeft: '30px' }}>
                        <h2 >
                           Giải pháp dành cho bạn
                        </h2>
                        <div >
                            <p>
                                Digital Microfarm Tech
                            </p>
                            <p>
                                Nông dân cá nhân
                            </p>
                            <p>
                               Hợp tác xã nông nghiệp
                            </p>
                            <p>
                                Chuyên gia nông nghiệp
                            </p>
                            <p>
                                Trường học và trung tâm nghiên cứu cây trồng
                            </p>
                        </div>
                    </Col>
                    <Col>
                        <img src={hinhintro2} className='hinhintro2' />
                    </Col>
                </Row>
            </div>

            {/* Chính sách */}
            <div className='policy' style={{ paddingTop: '100px' }}>
                <Row>
                    <Col>
                        <img src={hinhintro3} className='hinhintro3' />
                    </Col>
                    <Col>
                        <div style={{ padding: '30px 0' }}>
                            <div className='giatri'>
                                <h3>
                                    Chính sách và minh bạch
                                </h3>
                                <p>
                                    Giá trị cốt lõi của chúng tôi                                  
                                </p>
                                <p>
                                    Đồng hành với những người nông dân
                                </p>
                                <p>
                                    Len lỏi nơi những vùng xa xăm của tổ quốc
                                </p>
                                <p> 
                                    Đưa ra những biện pháp hợp lý và nhanh chóng
                                </p>
                                <p>
                                    Cung cấp giải pháp công nghệ thông minh
                                </p>
                                <p>
                                    Phát triển bền vững
                                </p>
                                <p>
                                    Hoàn toàn miễn phí
                                </p>
                                <p>
                                    Không ngừng cải tiến
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <Members />
        </Container>
    );
}
export default Introduce;



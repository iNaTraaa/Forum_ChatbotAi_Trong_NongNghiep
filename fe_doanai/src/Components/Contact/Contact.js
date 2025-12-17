import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Contact.scss';
import StartNow from '../StartNow/StartNow';


const Contact = () => {
    // Phần JSX của Contact
    return (
        <Container>
            <Row>
                <Col>
                    <h2 style={{ padding: '60px 0' }}>
                        Liên hệ - An toàn và riêng tư
                    </h2>
                </Col>
                <Col>
                </Col>
            </Row>
            <div className='thongtinlienhe'>
                <Row>
                    <Col>
                        <div>
                            <p>Địa chỉ: 331 QL1A, An Phú Đông , Quận 12, TP.HCM</p>
                            <Row>
                                <Col>
                                    <p>Email: 2311553553@nttu.edu.vn</p>
                                </Col>
                                <Col>
                                    <p>SĐT: 0987654321</p>
                                </Col>
                            </Row>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.964698717598!2d106.66607737511233!3d10.771047359260856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzE5LjciTiAxMDbCsDQwJzAwLjAiRQ!5e0!3m2!1svi!2s!4v1690351234567!5m2!1svi!2s"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Location Map"
                            ></iframe>
                        </div>
                    </Col>
                    <Col>
                        <h3>Liên hệ với chúng tôi ngay</h3>
                        <p>Chào bạn đến với tôi ngay, muốn đặt câu hỏi, nhận góp ý từ bạn, hãy điền thông tin dưới đây để tôi hỗ trợ bạn một cách nhanh chóng và hiệu quả nhất — hãy thoải mái liên hệ, tôi tin rằng điều đó sẽ mang lại giá trị 100%.</p>
                        <form>
                            <div>
                                <label>Tên</label>
                                <input type="text" placeholder="Nguyễn Văn A" />
                            </div>
                            <div>
                                <label>Email</label>
                                <input type="email" placeholder="abc@gmail.com" />
                            </div>
                            <div>
                                <label>Nội dung</label>
                                <textarea placeholder="Nội dung"></textarea>
                            </div>
                            <button type="submit">Gửi tin nhắn</button>
                        </form>
                    </Col>
                </Row>
            </div>
            <StartNow />
        </Container>
    );
}

export default Contact;
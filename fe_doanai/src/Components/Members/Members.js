import './Members.scss';
import { Container, Row, Col } from 'react-bootstrap';
import matcuoi from '../../assets/matcuoi.png'; // Assuming you have an image named matcuoi.png in the assets folder



const Members = () => {
    return (
        <div className='niemtin'>

            <Container fluid="md">
                <Row>
                    <Col>
                        <h1>
                            Các thành viên trong nhóm   
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
                               Võ Lê Hải Đăng
                            </h3>
                            <h5>
                                Sinh viên
                            </h5>
                            <div className='decribe' style={{ padding: '5px 0' }}>
                                <p>
                                    Trưởng nhóm 
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div className="image-matcuoi">
                            <img src={matcuoi} alt="mat cuoi" className="matcuoiimg" />
                        </div>
                        <div className='infuser'>
                            <h3 style={{ color: 'green' }}>
                               Nguyễn Quang Minh
                            </h3>
                            <h5>
                                Sinh viên
                            </h5>
                            <div className='decribe' style={{ padding: '5px 0' }}>
                                <p>
                                  Phân Tích
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div className="image-matcuoi">
                            <img src={matcuoi} alt="mat cuoi" className="matcuoiimg" />
                        </div>
                        <div className='infuser'>
                            <h3 style={{ color: 'green' }}>
                                Đỗ Na Tra
                            </h3>
                            <h5>
                                Sinh viên
                            </h5>
                            <div className='decribe' style={{ padding: '5px 0' }}>
                                <p>
                                    Dev Web
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Row>
                    <Col style={{ paddingTop: '20px' }}>
                        <div className="image-matcuoi">
                            <img src={matcuoi} alt="mat cuoi" className="matcuoiimg" />
                        </div>
                        <div className='infuser'>
                            <h3 style={{ color: 'green' }}>
                               Trần Gia Vy
                            </h3>
                            <h5>
                                Sinh viên
                            </h5>
                            <div className='decribe' style={{ padding: '5px 0' }}>
                                <p>
                                    Thiết kế, Kiểm thử
                                </p>
                            </div>
                        </div>
                    </Col>
                     <Col>
                        <div className="image-matcuoi">
                            <img src={matcuoi} alt="mat cuoi" className="matcuoiimg" />
                        </div>
                        <div className='infuser'>
                            <h3 style={{ color: 'green' }}>
                               Trần Thị Thu Hiền
                            </h3>
                            <h5>
                                Sinh viên
                            </h5>
                            <div className='decribe' style={{ padding: '5px 0' }}>
                                <p>
                                    Phân tích dữ liệu 
                                </p>
                            </div>
                        </div>
                    </Col>
                    </Row>
                </Row>
            </Container>
        </div>
    );
}

export default Members;
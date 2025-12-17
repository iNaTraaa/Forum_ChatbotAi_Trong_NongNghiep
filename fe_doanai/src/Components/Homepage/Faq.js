import React, { useState } from 'react';
import './FaqComponent.scss'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const FaqComponent = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    // Mảng hiển thị danh sách câu hỏi thường gặp
    const faqs = [
        { question: 'hỏi gì đi', answer: 'Đây là câu trả lời cho câu hỏi 1.' },
        { question: 'hỏi 2', answer: 'Đây là câu trả lời cho câu hỏi 2.' },
        { question: 'hỏi 3', answer: 'Đây là câu trả lời cho câu hỏi 3.' },
    ];

    // Xử lý đóng mở Faq
    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };


    // Phần JSX của FaqComponent
    return (
        <div className="faq-container">
            <Row>
                <Col sm={6}>
                {/* Tiêu đề */}
                    <span className="faq-label">FAQ</span>
                    <h2>Có thể bạn sẽ thắc mắc...</h2>
                    <p>Với câu hỏi phổ biến mà người dùng thường gặp khi bắt đầu</p>
                </Col>
                <Col sm={6}>
                {/* Danh sách câu hỏi */}
                    <div className="faq-list">
                        {faqs.map((faq, index) => (
                            <div className="faq-item" key={index}>
                                <div
                                    className="faq-question"
                                    onClick={() => handleToggle(index)}
                                >
                                    <span>{faq.question}</span>
                                    <span className="faq-toggle">{activeIndex === index ? '-' : '+'}</span>
                                </div>
                                {activeIndex === index && (
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
        
        </div>
    );
};

export default FaqComponent;
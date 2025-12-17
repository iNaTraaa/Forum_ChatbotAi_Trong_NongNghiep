
import React, { useState, useRef, useEffect, forwardRef } from 'react';
import './Chatbox.scss';
import { FaPaperclip, FaHome } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import RecognitionBar from './RecognitionBar';
import axios from 'axios';

// --- Dịch sang tiếng anh sang tiếng việt các loại cây và cây trồng từ API Phân Loại và Phân Bệnh  ---
const QUICK_SUGGESTIONS = ["Phân tích cây ", "Phân tích bệnh cây sầu riêng", "Phân tích bệnh cây cà phê", "Phân tích cây điều ", "Phân tích cây chè ", "Phân tích cây lúa", "Giá cà phê hôm nay là bao nhiêu?",];
const DISEASE_KEYWORDS = { cafe: ["cà phê", "bệnh cà phê"], durian: ["sầu riêng", "bệnh sầu riêng"], rice: ["lúa", "bệnh lúa"], tea: ["chè", "trà", "bệnh chè", "bệnh trà"], cashew_hat_dieu: ["điều", "bệnh điều", "hạt điều"], };
const PLANT_NAME_MAP = { 'cafe': 'Cây cà phê', 'cashew_hat_dieu': 'Cây Điều', 'tea': 'Cây Chè (Trà)', 'rice': 'Cây Lúa', 'durian': 'Cây Sầu Riêng', };
const DISEASE_NAME_MAPS = {
    cafe: { 'Healthy': 'Khỏe mạnh', 'Miner(sau_duc_la)': 'Bệnh sâu đục lá', 'Phoma(chay_la_phoma)': 'Bệnh cháy lá Phoma', 'RedSpiderMite(nhen_do)': 'Bệnh nhện đỏ', 'Rust': 'Bệnh gỉ sắt' },
    durian: { 'healthy': 'Khỏe mạnh', 'ALGAL_LEAF_SPOT': 'Bệnh đốm lá do tảo', 'ALLOCARIDARA_ATTACK': 'Bệnh rầy sáp tấn công', 'LEAF_BLIGHT': 'Bệnh cháy lá', 'PHOMOPSIS_LEAF_SPOT': 'Bệnh đốm lá do nấm', 'HEALTHY_LEAF': 'Lá khỏe' },
    rice: { 'healthy': 'Khỏe mạnh', 'brown_spot': 'Bệnh đốm nâu', 'bacterial_leaf_blight': 'Bệnh bạc lá', 'leaf_blast': 'Bệnh đạo ôn' },
    tea: { 'healthy': 'Khỏe mạnh', 'algal_spot': 'Bệnh đốm tảo', 'brown_blight': 'Bệnh cháy lá nâu', 'gray_blight': 'Bệnh cháy lá xám', 'helopeltis': 'Bệnh rệp muội / mọp chè / chích hút', 'red_spot': 'Bệnh đốm đỏ' },
    cashew_hat_dieu: { 'Cashew healthy': 'Cây khỏe', 'Cashew anthracnose': 'Bệnh thán thư', 'Cashew gumosis': 'Bệnh chảy nhựa', 'Cashew leaf miner': 'Bệnh sâu đục lá', 'Cashew red rust': 'Bệnh rỉ sắt đỏ' },
};




// Danh sách các tên lớp được coi là "khỏe mạnh" (viết thường để dễ so sánh)
const HEALTHY_CLASSES = ['healthy', 'health', 'healthy_leaf', 'cashew healthy'];

// Các hàm quản lý trạng thái và tham chiếu trong components 
const Chatbox = forwardRef(({ }, ref) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [input, setInput] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pendingPrompt, setPendingPrompt] = useState(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const initialMessageSent = useRef(false);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Các hàm quản lý trạng thái và sự kiện trong components
    useEffect(() => { scrollToBottom(); }, [messages]);// Cuộn xuống dưới cùng khi có tin nhắn mới
    // Gửi tin nhắn khởi tạo nếu có tin nhắn nhập từ trang Welcome
    useEffect(() => {
        if (initialMessageSent.current) return;
        const { initialQuestion, initialImage } = location.state || {};
        if (initialQuestion || initialImage) {
            initialMessageSent.current = true;
            sendMessage(initialQuestion || '', initialImage);
            navigate(location.pathname, { replace: true, state: {} });
        } else if (messages.length === 0) {
            setMessages([{ text: 'Xin chào! Bạn cần tôi giúp gì?', sender: 'bot' }]); // Nếu không có tin nhắn từ trang Welcome, hiển thị lời chào của bot 
        }
    }, [location, navigate]);

    // Giải phóng URL (hình ảnh) khi component unmount hoặc ảnh thay đổi
    useEffect(() => {
        return () => {
            if (selectedImage && selectedImage.previewUrl) {
                URL.revokeObjectURL(selectedImage.previewUrl);
            }
        };
    }, [selectedImage]);

    // Xử lý khi chọn hình ảnh
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setPendingPrompt(null);
            return;
        }

        // Tạo đối tượng hình ảnh với URL xem trước
        const imageObject = { file, previewUrl: URL.createObjectURL(file) };
        if (pendingPrompt) {
            sendMessage(pendingPrompt, imageObject);
            setPendingPrompt(null);
        } else {
            if (selectedImage && selectedImage.previewUrl) {
                URL.revokeObjectURL(selectedImage.previewUrl);
            }
            setSelectedImage(imageObject);
        }
        e.target.value = null;
    };

    // Xử lý khi nhấn gợi ý nhanh yêu cầu hình ảnh
    const handleSuggestionWithImage = (promptText) => {
        if (isLoading) return;
        setPendingPrompt(promptText);
        fileInputRef.current.click();
    };
    // Xử lý xóa hình ảnh 
    const handleRemoveImage = () => setSelectedImage(null);
    // Xử lý thay đổi nội dung ô nhập
    const handleInputChange = (e) => {
        setInput(e.target.value);
        const textarea = textareaRef.current;
        if (textarea) { textarea.style.height = 'auto'; textarea.style.height = `${textarea.scrollHeight}px`; }
    };

    // --- CÁC HÀM GỌI API ---

    // 1. Gọi API phân loại cây
    const callPlantApi = async (prompt, imageFile) => {
        const apiUrl = 'http://localhost:6868/predict-plant';
        const formData = new FormData();
        if (imageFile) formData.append('image', imageFile);
        formData.append('description', prompt);
        try {
            const response = await axios.post(apiUrl, formData, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 });
            return response.data;
        } catch (error) {
            if (error.code === 'ERR_NETWORK') throw new Error('Lỗi kết nối tới server. Vui lòng kiểm tra API và CORS.');
            if (error.response) throw new Error(`Server API báo lỗi ${error.response.status}.`);
            throw new Error('Lỗi không xác định khi gọi API phân loại cây.');
        }
    };

    // 2. Gọi API phân loại bệnh
    const callDiseaseApi = async (prompt, imageFile, plantKey) => {
        if (!imageFile) return { type: 'error', text: `Vui lòng cung cấp hình ảnh để phân tích bệnh.` };
        const apiUrl = `http://localhost:6868/predict-disease/${plantKey}`;
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('description', prompt);
        try {
            const response = await axios.post(apiUrl, formData, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 });
            return response.data;
        } catch (error) {
            if (error.code === 'ERR_NETWORK') throw new Error('Lỗi kết nối tới server. Vui lòng kiểm tra API và CORS.');
            if (error.response) throw new Error(`Server API báo lỗi ${error.response.status}.`);
            throw new Error(`Lỗi không xác định khi gọi API bệnh cho cây ${plantKey}.`);
        }
    };


    // 3. Gọi API chat
    const callChatApi = async (prompt) => {
        const apiUrl = 'https://f32102ee6bbc.ngrok-free.app/chat';
        const dataPayload = {
            messages: [{ role: "user", content: prompt }]
        };
        try {
            const response = await axios.post(apiUrl, dataPayload, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 240000
            });
            // Xử lý phản hồi từ API
            const messagesArray = response.data.messages;
            if (Array.isArray(messagesArray)) {
                const assistantMessage = messagesArray.find(msg => msg.role === 'assistant');
                if (assistantMessage && assistantMessage.content) {
                    return assistantMessage.content;
                }
            }
            return "Không trích xuất được nội dung giải thích từ API.";
        } catch (error) {
            console.error("LỖI KHI GỌI API CHAT:", error);
            if (error.response) {
                return `API giải thích báo lỗi ${error.response.status}.`;
            }
            return "Không thể kết nối đến dịch vụ giải thích hiện tượng.";
        }
    };

    // --- CÁC HÀM LOGIC CHÍNH ---

    // Phần xử lý khi gửi tin nhắn
    const sendMessage = async (promptText, imageObject = null) => {
        if (isLoading || (!promptText.trim() && !imageObject)) return;

        const userMessage = { sender: 'user', text: promptText.trim(), image: imageObject ? imageObject.previewUrl : null };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);


        // Phần xử lý khi gửi hình ảnh 
        const imageFileToSend = imageObject ? imageObject.file : null;
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        if (imageObject) setSelectedImage(null);
        try {
            if (imageFileToSend) {
                const lowerCasePrompt = promptText.toLowerCase().trim();
                let targetPlantForDisease = null;
                for (const [plantKey, keywords] of Object.entries(DISEASE_KEYWORDS)) {
                    if (keywords.some(keyword => lowerCasePrompt.includes(keyword))) {
                        targetPlantForDisease = plantKey;
                        break;
                    }
                }

                // PHÂN TÍCH BỆNH
                if (targetPlantForDisease) {
                    // Gọi API chẩn đoán bệnh trước
                    const diseaseResult = await callDiseaseApi(promptText.trim(), imageFileToSend, targetPlantForDisease);

                    // Xử lý lỗi từ API chẩn đoán
                    if (!diseaseResult || !diseaseResult.type || !diseaseResult.type.startsWith('disease-')) {
                        const errorMessage = diseaseResult?.message || diseaseResult?.error || "Phản hồi từ server chẩn đoán bệnh không hợp lệ.";
                        setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
                        return;
                    }

                    // Chuẩn bị tin nhắn chẩn đoán (nhưng chưa hiển thị)
                    const plantKey = diseaseResult.type.split('-')[1];
                    const diseaseMap = DISEASE_NAME_MAPS[plantKey] || {};
                    const { predicted_class, confidence, probabilities } = diseaseResult;
                    const friendlyDiseaseName = diseaseMap[predicted_class] || predicted_class;
                    let diagnosisLines = [`**Phân tích bệnh: ${PLANT_NAME_MAP[plantKey] || plantKey}:**`, `Dự đoán tình trạng: **${friendlyDiseaseName}**`, `Độ tin cậy: **${confidence.toFixed(2)}%**`, ``, `**Chi tiết xác suất:**`];
                    for (const [diseaseKey, probability] of Object.entries(probabilities)) {
                        if (probability > 0) {
                            diagnosisLines.push(`- ${diseaseMap[diseaseKey] || diseaseKey}: ${probability.toFixed(2)}%`);
                        }
                    }
                    const diagnosisMessage = { sender: 'bot', text: diagnosisLines.join('\n'), recognitionData: { name: friendlyDiseaseName, percentage: Math.round(confidence) } };

                    // Kiểm tra xem cây có bệnh không
                    const isHealthy = HEALTHY_CLASSES.includes(predicted_class.toLowerCase());

                    if (!isHealthy) {
                        // Nếu có bệnh, gọi thêm API giải thích
                        const chatPrompt = `Hãy giải thích về ${friendlyDiseaseName}. Trả lời một cách khoa học và ngắn gọn.`;
                        const explanationText = await callChatApi(chatPrompt);
                        const explanationMessage = { sender: 'bot', text: explanationText, recognitionData: null };

                        // Hiển thị CẢ HAI tin nhắn cùng một lúc
                        setMessages(prev => [...prev, diagnosisMessage, explanationMessage]);
                    } else {
                        // Nếu cây khỏe mạnh, chỉ hiển thị tin nhắn chẩn đoán
                        setMessages(prev => [...prev, diagnosisMessage]);
                    }
                }
                // LUỒNG PHÂN LOẠI CÂY
                else {
                    const plantResult = await callPlantApi(promptText.trim(), imageFileToSend);
                    const { predicted_class, confidence, probabilities } = plantResult;
                    const friendlyPlantName = PLANT_NAME_MAP[predicted_class] || predicted_class;
                    let responseLines = [`Kết quả phân loại: **${friendlyPlantName}**`, `Độ chính xác: **${confidence.toFixed(2)}%**`, '', '**Chi tiết xác suất:**'];
                    for (const [plantKey, probability] of Object.entries(probabilities)) {
                        if (probability > 0) {
                            responseLines.push(`- ${PLANT_NAME_MAP[plantKey] || plantKey}: ${probability.toFixed(2)}%`);
                        }
                    }
                    const plantMessage = { sender: 'bot', text: responseLines.join('\n'), recognitionData: { name: friendlyPlantName, percentage: Math.round(confidence) } };
                    setMessages(prev => [...prev, plantMessage]);
                }
            }
            // LUỒNG CHAT THƯỜNG
            else {
                const chatResponseText = await callChatApi(promptText.trim());
                const botMessage = { sender: 'bot', text: chatResponseText };
                setMessages(prev => [...prev, botMessage]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { text: error.message, sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendFromInput = () => sendMessage(input, selectedImage);
    const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendFromInput(); } };



    // PHẦN JSX CỦA CHATBOX
    return (
        <div className="chatbot-container" ref={ref}>
            {/* Sidebar */}
            <div className="sidebar">
                <h2>DMT</h2>
                {/* Giợi ý nhanh */}
                <div className="quick-suggestions">
                    <h4>Gợi ý nhanh</h4>
                    {/* Danh sách giợi ý nhanh */}
                    <div className="suggestions-list">
                        {QUICK_SUGGESTIONS.map((suggestion, index) => {
                            const requiresImage = suggestion.includes("Phân tích");
                            return (
                                <button
                                    key={index}
                                    className="suggestion-item"
                                    onClick={() =>
                                        requiresImage
                                            ? handleSuggestionWithImage(suggestion)
                                            : sendMessage(suggestion)
                                    }
                                    disabled={isLoading}
                                >
                                    {suggestion}
                                </button>
                            );
                        })}
                    </div>
                </div>
                {/* <div className="history"></div> */}
            </div>
            {/* Khu vực chat chính */}
            <div className="chat-area">
                <div className="header"><button className="home-buttonn" onClick={() => navigate('/')}><FaHome /> Trang chủ</button></div>
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            <div className="bubble">
                                {msg.image && <img src={msg.image} alt="Nội dung đã gửi" className="message-image" />}
                                {msg.text && <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}></p>}
                                {msg.sender === 'bot' && msg.recognitionData && msg.recognitionData.percentage > 0 && (<RecognitionBar name={msg.recognitionData.name} percentage={msg.recognitionData.percentage} />)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message bot">
                            <div className="bubble">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                {/* Khu vực nhập tin nhắn */}
                <div className="chat-input-bar">
                    {selectedImage && (<div className="image-preview-container"><img src={selectedImage.previewUrl} alt="Preview" className="image-preview" /><button onClick={handleRemoveImage} className="remove-preview-btn">&times;</button></div>)}
                    <div className="chat-input">
                        <FaPaperclip className="input-icon" onClick={() => fileInputRef.current.click()} />
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                        />
                        <textarea ref={textareaRef} rows={1} placeholder="Nhập tin nhắn hoặc chọn ảnh..." value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} disabled={isLoading} />
                        <button className="btn-submit" onClick={handleSendFromInput} disabled={isLoading || (!input.trim() && !selectedImage)}>Gửi</button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Chatbox;
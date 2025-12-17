
import React, { useState, useRef } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import Welcome from '../Chatbox/Welcome.js';
import Chatbox from '../Chatbox/Chatbox.js';
import './Chatpage.scss'; 


function ChatPage() {
    const [isChatting, setIsChatting] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const welcomeRef = useRef(null);
    const chatboxRef = useRef(null);
    const nodeRef = isChatting ? chatboxRef : welcomeRef;
    // Hàm xử lý khi người dùng gửi câu hỏi 
    const handleQuestionSubmit = (data) => {
        setInitialData(data);
        setIsChatting(true);
    };

    //Thay đổi giá trị của biến này để đổi hiệu ứng.
    const animationClass = "fade"; // <-- Chọn ở đây: "fade", "slide-in-right", "zoom-in", "flip"
    const animationTimeout = 50; // Thay đổi cho phù hợp với transition trong Chatpage.scss
    
    // Phần JSX của Chatpage
    return (
        // Nếu dùng hiệu ứng lật, thêm className cho cha
        <div className={animationClass === 'flip' ? 'flip-container' : ''}>
            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={isChatting ? "Chatbox" : "Welcome"}
                    nodeRef={nodeRef} 
                    // Sử dụng các biến đã định nghĩa ở trên
                    timeout={animationTimeout}
                    classNames={animationClass}
                >
                    {isChatting ? (
                        <Chatbox ref={chatboxRef} initialData={initialData} />
                    ) : (
                        <Welcome ref={welcomeRef} onQuestionSubmit={handleQuestionSubmit} />
                    )}
                </CSSTransition>
            </SwitchTransition>
        </div>
    );
}

export default ChatPage;
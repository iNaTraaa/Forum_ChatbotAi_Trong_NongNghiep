import { useNavigate } from 'react-router-dom';
import  './StartNow.scss';
import Chatbox from 'Components/Chatbox/Chatbox';
import Welcome from 'Components/Chatbox/Welcome';

const StartNow = () => {
    const navigate = useNavigate();
    return(
        <button className="btnscreatepost" style={{ marginTop: '20px' }}
            onClick={() => navigate('/Welcome') }
        >
            Chat ngay
        </button>
    );
}

export default StartNow;
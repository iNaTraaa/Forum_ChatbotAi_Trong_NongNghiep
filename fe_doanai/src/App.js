
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './Components/Layout/MainLayout';
import Homepage from './Components/Homepage/Homepage';
import Forum from './Components/Forum/Forum';
import Introduce from './Components/Introduce/Introduce';
import Contact from './Components/Contact/Contact';
import Post from './Components/Post/Post';
import Login from './Components/Login/Login';
import Signup from './Components/Sign Up/Signup';
import Welcome from 'Components/Chatbox/Welcome';
import Chatbox from 'Components/Chatbox/Chatbox';
import PostDetail from 'Components/Forum/PostDetail/PostDetail';
import Admin from './Admin/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    
    <Router>
      <Routes>
        {/*Các trang có Layout chung  */}
        <Route path="/" element={<MainLayout />}>
  
          {/* Bên trong main layout */}
          <Route index element={<Homepage />} />
          <Route path="introduce" element={<Introduce />} />
          <Route path="forum" element={<Forum />} />
          <Route path="contact" element={<Contact />} />
          <Route path="post" element={<Post />} />
          <Route path="post/:id" element={<PostDetail />} />
        </Route>

        {/*Các trang riêng lẻ, không có layout chung */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Admin/*" element={<Admin />} />
        {/* Route cho trang Welcome. Khi nhấn vào trang dịch vụ sẽ chuyển sang trang Welcome */}
        <Route path="/welcome" element={<Welcome />} />

        {/* Route cho trang Chatbox. Trang này được gọi từ Welcome. */}
        <Route path="/chatbox" element={<Chatbox />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
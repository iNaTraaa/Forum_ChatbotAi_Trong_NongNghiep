import { createPost } from 'Service/UserService'; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Sửa lại đường dẫn import cho đúng với file api.js chung của dự án
import { toast } from 'react-toastify';
import './Post.scss';

const Post = () => {
    const navigate = useNavigate();

    // State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // State để hiển thị ảnh preview

    const [loading, setLoading] = useState(false);

    // Xử lý khi chọn ảnh
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file)); // Tạo URL ảo để xem trước
        }
    };

    // Xóa ảnh đã chọn
    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
        // Reset input file để có thể chọn lại ảnh cũ nếu muốn
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = '';
    };

    // Xử lý Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.warning('Vui lòng nhập tiêu đề bài viết.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', content); // Map content vào description theo backend cũ

        if (image) {
            formData.append('thumbnail', image);
        }

        setLoading(true);

        try {
            // Gọi API
            await createPost(formData);

            toast.success('Đăng bài viết thành công!');

            // Reset form
            setTitle('');
            setContent('');
            handleRemoveImage();
            navigate('/forum')

            
            // Chuyển hướng về trang diễn đàn sau 1s
            // setTimeout(() => {
            // navigate('/forum');
            // }, 1000);

        } catch (err) {
            console.error("Lỗi đăng bài:", err);
            const message = err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post-wrapper">
            <div className="create-post-card">
                <div className="post-header">
                    <h2>Tạo bài viết mới</h2>
                    <p>Chia sẻ kiến thức, câu hỏi hoặc ý tưởng của bạn với cộng đồng.</p>
                </div>

                <form className="post-form" onSubmit={handleSubmit}>
                    {/* Phần Tiêu đề */}
                    <div className="form-group">
                        <label htmlFor="post-title">Tiêu đề bài viết</label>
                        <input
                            id="post-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tiêu đề bài viết..."
                            className="form-input title-input"
                            autoFocus
                        />
                    </div>

                    {/* Phần Nội dung */}
                    <div className="form-group">
                        <label htmlFor="post-content">Nội dung chi tiết</label>
                        <textarea
                            id="post-content"
                            rows="8"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Mô tả chi tiết vấn đề của bạn..."
                            className="form-input content-input"
                        />
                    </div>

                    {/* Phần Upload Ảnh */}
                    <div className="form-group">
                        <label>Hình ảnh đính kèm (Thumbnail)</label>

                        {!previewUrl ? (
                            <div className="upload-box">
                                <input
                                    type="file"
                                    id="file-upload"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="file-input-hidden"
                                />
                                <label htmlFor="file-upload" className="upload-label">
                                    <div className="upload-icon">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0ab350" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                    </div>
                                    <span>Nhấn để tải ảnh lên hoặc kéo thả vào đây</span>
                                    <small>Hỗ trợ JPG, PNG, JPEG</small>
                                </label>
                            </div>
                        ) : (
                            <div className="image-preview-container">
                                <img src={previewUrl} alt="Preview" className="image-preview" />
                                <button type="button" className="remove-image-btn" onClick={handleRemoveImage} title="Xóa ảnh">
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate('/forum')}
                            disabled={loading}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner"></span>
                            ) : 'Đăng bài viết'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Post;
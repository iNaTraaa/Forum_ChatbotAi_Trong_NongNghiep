import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from 'store/authStore';
import { toast } from 'react-toastify';
import './Forum.scss';
import { getPosts, voteOnPost } from 'Service/UserService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faThumbsUp, faThumbsDown, faCommentAlt, faShare,
    faFire, faSun, faChartLine, faSearch, faTimes
} from '@fortawesome/free-solid-svg-icons';

const BACKEND_URL = 'http://localhost:3001';


const safeParseInt = (value) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
};

const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
};

// Lightbox hiển thị ảnh lớn khi click
const ImageLightbox = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;
    return (
        <div className="image-lightbox-overlay" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', cursor: 'zoom-out' }}>
            <button className="lightbox-close-button" onClick={onClose} style={{ position: 'absolute', top: '20px', right: '30px', background: 'transparent', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer', zIndex: 10000 }}>
                <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={imageUrl} alt="Enlarged view" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', cursor: 'default' }} />
            </div>
        </div>
    );
};


const ThreadCard = ({ post, onImageClick, onVote, onTitleClick }) => {
    let imageUrl = null;
    if (post.thumbnail) {
        if (post.thumbnail.startsWith('http')) {
            imageUrl = post.thumbnail;
        } else {
            const cleanPath = post.thumbnail.replace(/\\/g, '/');
            const hasPrefix = cleanPath.includes('uploads');
            const finalPath = hasPrefix ? cleanPath : `uploads/post/${cleanPath}`;
            imageUrl = `${BACKEND_URL}/${finalPath}`;
        }
    }

    const userName = post.user
        ? (post.user.first_Name ? `${post.user.first_Name} ${post.user.last_Name}` : post.user.username || post.user.email)
        : 'Người dùng ẩn';

    const currentVoteStatus = safeParseInt(post.userVoteStatus);
    const displayLikeCount = (post.likeCount !== undefined) ? safeParseInt(post.likeCount) : safeParseInt(post.score || 0);
    const displayCommentCount = safeParseInt(post.commentCount);

    return (
        <article className="forum-post-card">
            <div className="forum-post-header">
                <a href="#" className="forum-post-category"><strong>{post.category?.name || 'c/general'}</strong></a>
                <span className="forum-post-meta">• Đăng bởi {userName} • {formatTimeAgo(post.createdAt)}</span>
            </div>

            <div className="forum-post-body">
                <h1 className="forum-post-title" style={{ fontWeight: 'bold', color: '#0ab350' }}>
                    <a href={`/post/${post.id}`} onClick={(e) => { e.preventDefault(); if (onTitleClick) onTitleClick(post.id); }}>
                        {post.title}
                    </a>
                </h1>
                {imageUrl && (
                    <div className="forum-post-media" onClick={() => onImageClick(imageUrl)}>
                        <img src={imageUrl} alt="Post content" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                )}
            </div>

            <div className="forum-post-actions">
                <div className="forum-action-item vote-group">
                    {/* Nút Like */}
                    <div
                        className={`vote-btn ${currentVoteStatus === 1 ? 'active-up' : ''}`}
                        onClick={() => onVote(post.id, 1)}
                        style={{ color: currentVoteStatus === 1 ? '#0ab350' : 'inherit', cursor: 'pointer', marginRight: '8px' }}
                    >
                        <FontAwesomeIcon icon={faThumbsUp} />
                    </div>

                    {/* Số điểm */}
                    <span
                        className={`score ${currentVoteStatus === 1 ? 'score-up' : (currentVoteStatus === -1 ? 'score-down' : '')}`}
                        style={{ fontWeight: 'bold', margin: '0 8px', color: currentVoteStatus === 1 ? '#0ab350' : (currentVoteStatus === -1 ? '#dc3545' : 'inherit') }}
                    >
                        {displayLikeCount}
                    </span>

                    {/* Nút Dislike */}
                    <div
                        className={`vote-btn ${currentVoteStatus === -1 ? 'active-down' : ''}`}
                        onClick={() => onVote(post.id, -1)}
                        style={{ color: currentVoteStatus === -1 ? '#dc3545' : 'inherit', cursor: 'pointer', marginLeft: '8px' }}
                    >
                        <FontAwesomeIcon icon={faThumbsDown} />
                    </div>
                </div>

                <div className="forum-action-item" onClick={() => onTitleClick && onTitleClick(post.id)}>
                    <FontAwesomeIcon icon={faCommentAlt} className="action-icon" />
                    <span>{displayCommentCount > 0 ? `${displayCommentCount} Bình luận` : 'Bình luận'}</span>
                </div>
                <div className="forum-action-item"><FontAwesomeIcon icon={faShare} className="action-icon" /><span>Chia sẻ</span></div>
            </div>
        </article>
    );
};

const SortOptions = () => (
    <div className="forum-sort-options">
        <a href="#" className="active"><FontAwesomeIcon icon={faFire} /> Phổ biến</a>
        <a href="#"><FontAwesomeIcon icon={faSun} /> Mới</a>
        <a href="#"><FontAwesomeIcon icon={faChartLine} /> Top</a>
    </div>
);

const Sidebar = () => (
    <aside className="forum-sidebar">
        <div className="forum-sidebar-widget">
            <h3 className="forum-widget-title">Quy định của diễn đàn</h3>
            <ol>
                <li>Giữ thái độ văn minh, tôn trọng.</li>
                <li>Nội dung phải liên quan đến chủ đề.</li>
                <li>Không spam hoặc tự quảng cáo.</li>
                <li>Báo cáo các hành vi vi phạm.</li>
            </ol>
        </div>
        <div className="forum-sidebar-widget">
            <h3 className="forum-widget-title">Các danh mục nổi bật</h3>
            <ul className="forum-category-list">
                <li><a href="#">#1 c/KhoaHoc</a></li>
                <li><a href="#">#2 c/DauTu</a></li>
                <li><a href="#">#3 c/AmNhac</a></li>
            </ul>
        </div>
    </aside>
);


const Forum = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);
    const isAuthenticated = !!token;
// Fetch post
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getPosts();
                setPosts(data);
            } catch (err) {
                console.error(err);
                setError('Không thể tải bài viết. Vui lòng kiểm tra server.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [isAuthenticated]);

    const handleTitleClick = (postId) => navigate(`/post/${postId}`);

// Hàm xử lý vote
    const handleVote = async (postId, direction) => {
        // Kiểm tra đăng nhập
        if (!isAuthenticated) {
            toast.error('Bạn cần đăng nhập để đánh giá bài viết!');
            return;
        }

        // Tìm bài viết trong state hiện tại
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;
        const currentPost = posts[postIndex];
        const currentVoteStatus = safeParseInt(currentPost.userVoteStatus);
        let newVoteStatus;
        let scoreChange = 0;

        // Logic toggle: Nếu bấm lại nút đang sáng -> Hủy vote
        if (currentVoteStatus === direction) {
            newVoteStatus = 0;
            scoreChange = -direction; 
        } else {
            newVoteStatus = direction;
            scoreChange = direction - currentVoteStatus;
        }

        // Optimistic Update (Cập nhật UI ngay lập tức)
        // Tạo bản sao danh sách bài viết để update UI
        const newPosts = [...posts];
        newPosts[postIndex] = {
            ...currentPost,
            userVoteStatus: newVoteStatus,
            likeCount: (safeParseInt(currentPost.likeCount) || 0) + scoreChange
        };
        setPosts(newPosts);

        try {
            await voteOnPost(postId, direction);
            // Nếu API thành công, giao diện đã đúng rồi, không cần làm gì thêm
        } catch (err) {
            console.error("Lỗi khi vote:", err);
            toast.error("Có lỗi xảy ra, vui lòng thử lại.");

            // Rollback (Hoàn tác nếu API lỗi)
            // Khôi phục lại trạng thái cũ từ trước khi sửa
            const rollbackPosts = [...posts];
            rollbackPosts[postIndex] = currentPost;
            setPosts(rollbackPosts);
        }
    };

    const handleCreatePostClick = () => {
        if (isAuthenticated) {
            navigate('/Post');
        } else {
            toast.error('Bạn cần đăng nhập để viết bài mới!');
        }
    };

    const handleImageClick = (url) => setSelectedImageUrl(url);
    const handleCloseLightbox = () => setSelectedImageUrl(null);

    if (loading) return <div className="forum-status container" style={{ marginTop: '100px' }}>Đang tải bài viết...</div>;
    if (error) return <div className="forum-status error container" style={{ marginTop: '100px', color: 'red' }}>{error}</div>;

    return (
        <>
            <div className="forum-main-container container" style={{ marginTop: '80px' }}>
                <main className="forum-thread-list">

                    {/* Header */}
                    <div className="forum-header" style={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '20px',
                        minHeight: '40px'
                    }}>
                        <h1 style={{ margin: 0 }}>DMT Forum</h1>

                        {isAuthenticated && (
                            <div style={{ position: 'absolute', right: 0 }}>
                                <button
                                    onClick={handleCreatePostClick}
                                    className="create-post-button"
                                    style={{
                                        backgroundColor: '#0ab350',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}
                                >
                                    <PlusIcon /> Đăng bài viết
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="search-bar">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <input type="text" placeholder="Tìm kiếm trong diễn đàn..." />
                    </div>

                    <SortOptions />

                    {posts.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '20px' }}>Chưa có bài viết nào.</p>
                    ) : (
                        posts.map((post, index) => (
                            <ThreadCard
                                key={post.id || index}
                                post={post}
                                onImageClick={handleImageClick}
                                onVote={handleVote}
                                onTitleClick={handleTitleClick}
                            />
                        ))
                    )}
                </main>

                <Sidebar />
            </div>

            <ImageLightbox imageUrl={selectedImageUrl} onClose={handleCloseLightbox} />
        </>
    );
};

// Icon dấu cộng nhỏ
const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default Forum;
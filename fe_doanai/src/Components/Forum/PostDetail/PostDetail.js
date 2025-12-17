import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from 'store/authStore';
import { toast } from 'react-toastify';
import './PostDetail.scss';
import {
    getPostById,
    voteOnPost,
    getCommentsByPostId,
    createComment
} from 'Service/UserService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faThumbsUp, faThumbsDown, faCommentAlt, faShare,
    faArrowLeft, faGift, faBookmark, faTimes
} from '@fortawesome/free-solid-svg-icons';

const BACKEND_URL = 'http://localhost:3001';
const POST_IMAGES_URL_PREFIX = '/uploads/post/';
const safeParseInt = (val) => {
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 0 : parsed;
};

//  Format thời gian "time ago"
const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.round((now - date) / 1000);
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
};

// Lightbox
const ImageLightbox = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;
    return (
        <div
            className="image-lightbox-overlay"
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
                cursor: 'zoom-out'
            }}
        >
            <button
                className="lightbox-close-button"
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '30px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    zIndex: 10000,
                    transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>

            <div
                className="lightbox-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%'
                }}
            >
                <img
                    src={imageUrl}
                    alt="Enlarged view"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                        cursor: 'default'
                    }}
                />
            </div>
        </div>
    );
};


const SidebarWidget = () => (
    <div className="post-detail-sidebar">
        <div className="sidebar-widget">
            <h3>Giới thiệu cộng đồng</h3>
            <p style={{ fontSize: '14px', color: '#1c1c1c', lineHeight: '1.5', marginBottom: '10px' }}>
                Chào mừng bạn đến với DMT Forum - Nơi chia sẻ kiến thức và thảo luận về mọi chủ đề.
            </p>
            <div style={{ display: 'flex', gap: '10px', fontSize: '14px' }}>
                <div><strong>1.2k</strong><br /><span style={{ color: '#7c7c7c' }}>Thành viên</span></div>
                <div><strong>50</strong><br /><span style={{ color: '#7c7c7c' }}>Đang online</span></div>
            </div>
        </div>
        <div className="sidebar-widget">
            <h3>Quy tắc</h3>
            <ul>
                <li>1. Tôn trọng lẫn nhau</li>
                <li>2. Không spam/quảng cáo</li>
                <li>3. Nội dung chất lượng</li>
            </ul>
        </div>
    </div>
);


const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

// Load data from API
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Gọi API lấy chi tiết bài viết
                const postRes = await getPostById(id);
                setPost(postRes);
                // Gọi API lấy danh sách bình luận
                try {
                    const commentsRes = await getCommentsByPostId(id);
                    setComments(Array.isArray(commentsRes) ? commentsRes : []);
                } catch (cmtError) {
                    // Không crash trang nếu chưa có bình luận hoặc API lỗi nhẹ
                    console.warn("Chưa có bình luận:", cmtError);
                    setComments([]);
                }

            } catch (error) {
                console.error("Error loading post:", error);
                toast.error("Không thể tải bài viết (Kiểm tra ID hoặc kết nối).");
                setPost(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) loadData();
    }, [id, isAuthenticated]);

    // Xử lý Vote (Like/Dislike)
    const handleVote = async (direction) => {
        if (!isAuthenticated) {
            toast.error("Bạn cần đăng nhập để đánh giá bài viết!");
            return;
        }

        const originalPost = { ...post };

        // Tính toán Optimistic UI (Hiển thị trước khi server trả về)
        const currentStatus = safeParseInt(post.userVoteStatus);
        let likeCount = (post.likeCount !== undefined && post.likeCount !== null) ? safeParseInt(post.likeCount) : safeParseInt(post.score);
        let dislikeCount = safeParseInt(post.dislikeCount);
        let newStatus = currentStatus;

        if (currentStatus === direction) {
            newStatus = 0; // Hủy vote
            direction === 1 ? likeCount-- : dislikeCount--;
        } else if (currentStatus === 0) {
            newStatus = direction; // Vote mới
            direction === 1 ? likeCount++ : dislikeCount++;
        } else {
            newStatus = direction; // Đổi chiều
            if (direction === 1) { dislikeCount--; likeCount++; }
            else { likeCount--; dislikeCount++; }
        }

        if (likeCount < 0) likeCount = 0;
        if (dislikeCount < 0) dislikeCount = 0;

        setPost({ ...post, userVoteStatus: newStatus, likeCount, dislikeCount });

        try {
            // Gọi API Vote
            const serverData = await voteOnPost(id, direction);

            // Cập nhật lại với dữ liệu chuẩn từ server
            setPost(prev => ({
                ...prev,
                ...serverData,
                // Ưu tiên số từ server, nếu lỗi fallback về số tính toán
                likeCount: (serverData.likeCount !== undefined) ? serverData.likeCount : likeCount,
                dislikeCount: (serverData.dislikeCount !== undefined) ? serverData.dislikeCount : dislikeCount
            }));
        } catch (err) {
            setPost(originalPost); // Hoàn tác nếu lỗi
            toast.error("Lỗi kết nối khi vote.");
        }
    };

    // Xử lý gửi bình luận mới
    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;
        if (!isAuthenticated) {
            toast.error("Bạn cần đăng nhập để bình luận!");
            return;
        }

        try {
            // Gọi API Tạo Comment
            const savedComment = await createComment({
                content: newComment,
                postId: parseInt(id)
            });

            // Thêm comment mới lên đầu danh sách
            // Backend trả về object comment đầy đủ (kèm user) nên hiển thị được ngay
            setComments(prev => [savedComment, ...prev]);

            setNewComment('');
            toast.success("Đã gửi bình luận!");

        } catch (error) {
            console.error(error);
            toast.error("Không thể gửi bình luận.");
        }
    };

    if (loading) return <div className="post-detail-page"><div className="post-detail-container">Đang tải nội dung...</div></div>;
    if (!post) return <div className="post-detail-page"><div className="post-detail-container">Bài viết không tồn tại hoặc đã bị xóa.</div></div>;

    // Xử lý ảnh
    let imageUrl = null;
    if (post.thumbnail) {
        const path = post.thumbnail.includes('/') || post.thumbnail.includes('\\')
            ? post.thumbnail.replace(/\\/g, '/')
            : `${POST_IMAGES_URL_PREFIX}${post.thumbnail}`;
        imageUrl = path.startsWith('http') ? path : `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    }

    // Chuẩn bị dữ liệu hiển thị
    const currentVoteStatus = safeParseInt(post.userVoteStatus);
    const displayLikeCount = (post.likeCount !== undefined && post.likeCount !== null)
        ? safeParseInt(post.likeCount)
        : safeParseInt(post.score);
    const displayDislikeCount = safeParseInt(post.dislikeCount);


    return (
        <div className="post-detail-page">
            <div className="post-detail-container">
                <div className="post-detail-main">

                    {/* POST CARD */}
                    <div className="post-detail-card">
                        <button className="back-button" onClick={() => navigate(-1)}>
                            <FontAwesomeIcon icon={faArrowLeft} /> Quay lại diễn đàn
                        </button>

                        <div className="post-header">
                            <span className="subreddit-name">c/{post.category?.name || 'general'}</span>
                            <span>•</span>
                            <span className="post-author">Đăng bởi {post.user ? `${post.user.first_Name} ${post.user.last_Name}` : 'Người dùng ẩn'}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(post.createdAt)}</span>
                        </div>

                        <div className="post-content">
                            <h1>{post.title}</h1>
                            <div className="post-description">{post.description}</div>
                            {imageUrl && (
                                <div className="post-image-wrapper">
                                    {/* THÊM onClick để mở Lightbox */}
                                    <img
                                        src={imageUrl}
                                        alt={post.title}
                                        onClick={() => setSelectedImageUrl(imageUrl)}
                                        style={{ cursor: 'zoom-in' }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="post-actions-bar">
                            {/* VOTE GROUP */}
                            <div className="action-group vote-group" style={{ cursor: 'default' }}>
                                <div
                                    className={`vote-btn ${currentVoteStatus === 1 ? 'active-up' : ''}`}
                                    onClick={() => handleVote(1)}
                                    title="Thích"
                                    style={{ color: currentVoteStatus === 1 ? '#0ab350' : 'inherit', cursor: 'pointer', marginRight: '8px' }}
                                >
                                    <FontAwesomeIcon icon={faThumbsUp} />
                                </div>
                                <span
                                    className={`score ${currentVoteStatus === 1 ? 'score-up' : (currentVoteStatus === -1 ? 'score-down' : '')}`}
                                    style={{ fontWeight: 'bold', color: currentVoteStatus === 1 ? '#0ab350' : (currentVoteStatus === -1 ? '#dc3545' : 'inherit'), margin: '0 8px' }}
                                >
                                    {displayLikeCount}
                                </span>
                                <div
                                    className={`vote-btn ${currentVoteStatus === -1 ? 'active-down' : ''}`}
                                    onClick={() => handleVote(-1)}
                                    title="Không thích"
                                    style={{ color: currentVoteStatus === -1 ? '#dc3545' : 'inherit', cursor: 'pointer', marginLeft: '8px' }}
                                >
                                    <FontAwesomeIcon icon={faThumbsDown} />
                                </div>
                            </div>

                            <div className="action-group" style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={faCommentAlt} />
                                <span>{comments.length} Bình luận</span>
                            </div>

                            <div className="action-group" style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={faGift} />
                                <span>Tặng quà</span>
                            </div>

                            <div className="action-group" style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={faShare} />
                                <span>Chia sẻ</span>
                            </div>
                            <div className="action-group" style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={faBookmark} />
                                <span>Lưu</span>
                            </div>
                        </div>
                    </div>


                    <div className="comments-container">
                        <div className="comment-input-box">
                            <label>Bình luận dưới tên <span>{user ? `${user.first_Name} ${user.last_Name}` : 'Khách'}</span></label>
                            <textarea
                                placeholder="Bạn đang nghĩ gì?"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="comment-actions">
                                <button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                                    Bình luận
                                </button>
                            </div>
                        </div>

                        <div className="comments-list">
                            {comments.length === 0 && <div style={{ textAlign: 'center', color: '#888' }}>Chưa có bình luận nào. Hãy là người đầu tiên!</div>}

                            {comments.map((cmt, idx) => (
                                <div key={cmt.id || idx} className="comment-item">
                                    <div className="comment-header">
                                        <img
                                            className="user-avatar"
                                            src={cmt.user?.avatar ? `${BACKEND_URL}/${cmt.user.avatar}` : "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png"}
                                            alt="avatar"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png" }}
                                        />
                                        <span className="username">{cmt.user ? `${cmt.user.first_Name} ${cmt.user.last_Name}` : 'Người dùng ẩn'}</span>
                                        <span className="time">• {formatTimeAgo(cmt.createdAt)}</span>
                                    </div>
                                    <div className="comment-body">
                                        {cmt.content}
                                    </div>
                                    <div className="comment-footer">
                                        <button><FontAwesomeIcon icon={faThumbsUp} /> Thích</button>
                                        <button><FontAwesomeIcon icon={faCommentAlt} /> Phản hồi</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <SidebarWidget />
            </div>

            {/* THÊM COMPONENT LIGHTBOX VÀO CUỐI RETURN */}
            <ImageLightbox imageUrl={selectedImageUrl} onClose={() => setSelectedImageUrl(null)} />
        </div>
    );

};


export default PostDetail;
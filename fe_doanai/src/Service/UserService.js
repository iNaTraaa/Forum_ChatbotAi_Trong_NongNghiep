import axios from 'axios';
import { useAuthStore } from 'store/authStore';

// Tạo apiClient và cấu hình interceptor
const apiClient = axios.create({
    baseURL: 'http://localhost:3001', // Đặt baseURL chung
});

// Interceptor sẽ tự động gắn token vào mọi request gửi đi từ apiClient
// Điều này giúp Backend biết ai đang like bài viết (dù ở trang chủ)
apiClient.interceptors.request.use(
    (config) => {
        // 1. Ưu tiên lấy token từ AuthStore (State quản lý tập trung)
        let token = useAuthStore.getState().token;

        // 2. FALLBACK QUAN TRỌNG: 
        // Khi Reload trang, Store có thể chưa kịp khởi tạo xong.
        // Lúc này ta lấy "nóng" từ localStorage để đảm bảo không bị mất Token.
        if (!token) {
            // Cách 1: Lấy key trực tiếp nếu bạn lưu thủ công
            token = localStorage.getItem('access_token') || localStorage.getItem('token');

            // Cách 2: Lấy từ 'auth-storage' nếu bạn dùng Zustand Persist (Dữ liệu dạng JSON)
            // Đây là lý do chính khiến nhiều bạn reload bị mất trạng thái đăng nhập
            if (!token) {
                const authStorage = localStorage.getItem('auth-storage');
                if (authStorage) {
                    try {
                        const parsedStorage = JSON.parse(authStorage);
                        // Token nằm lồng bên trong state
                        if (parsedStorage.state && parsedStorage.state.token) {
                            token = parsedStorage.state.token;
                        }
                    } catch (error) {
                        console.error("Lỗi khi parse auth-storage:", error);
                    }
                }
            }
        }

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- PHẦN AUTH ---

export const loginApi = async ({ email, password }) => {
    return apiClient.post('/auth/login', { email, password });
};

// Lấy thông tin người dùng sau khi đăng nhập + không reload lại trang 
export const getMeApi = async () => {
    return apiClient.get('/auth/me');
};

export const signupApi = async ({ first_Name, last_Name, email, password }) => {
    return apiClient.post('/auth/register', { first_Name, last_Name, email, password });
};

// --- PHẦN POST (BÀI VIẾT) ---

// Hàm lấy danh sách bài viết
export const getPosts = async () => {
    try {
        const response = await apiClient.get('/post');
        return response.data; // Trả về data để Forum.js sử dụng ngay
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

// Hàm xử lý tạo bài Post
export const createPost = async (formData) => {
    try {
        const response = await apiClient.post('/post', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

// Lấy chi tiết một bài viết theo ID
export const getPostById = async (postId) => {
    const response = await apiClient.get(`/post/${postId}`);
    return response.data;
};

// BỔ SUNG: Hàm để vote một bài viết
// Quan trọng: Phải trả về response.data để Frontend cập nhật số like mới nhất
export const voteOnPost = async (postId, direction) => {
    const response = await apiClient.post(`/post/${postId}/vote`, { direction });
    return response.data;
};

// BỔ SUNG: Hàm xóa một bài viết
export const deletePost = async (postId) => {
    const response = await apiClient.delete(`/post/${postId}`);
    return response.data;
};

// BỔ SUNG: Hàm cập nhật một bài viết
export const updatePost = async (postId, postData) => {
    const response = await apiClient.patch(`/post/${postId}`, postData);
    return response.data;
};

/**
 * =================================
 * COMMENTS API
 * =================================
 */

export const getCommentsByPostId = async (postId) => {
    const response = await apiClient.get(`/comment/post/${postId}`);
    return response.data;
};

export const createComment = async (data) => {
    // data gồm: { content: "...", postId: 1 }
    const response = await apiClient.post('/comment', data);
    return response.data;
};

export const deleteComment = async (commentId) => {
    const response = await apiClient.delete(`/comment/${commentId}`);
    return response.data;
};

export default apiClient;
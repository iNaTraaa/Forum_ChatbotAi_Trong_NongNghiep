import apiClient from "Service/UserService";

// Ghi nhận lượt truy cập (Gọi ở App.js)
export const logTraffic = async () => {
    const response = await apiClient.get('/admin/log-traffic');
    return response.data;
};

// Lấy dữ liệu thống kê Dashboard (Users, Posts, Traffic Chart)
export const getDashboardStats = async (period = 'week') => {
    const response = await apiClient.get(`/admin/stats?period=${period}`);
    return response.data;
};

// Quản lý người dùng
// Lấy danh sách tất cả người dùng
export const getAllUsers = async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
};

// Xóa người dùng
export const deleteUser = async (id) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
};

// Cập nhật quyền (Role)
export const updateUserRole = async (id, role) => {
    const response = await apiClient.patch(`/admin/users/${id}/role`, { role });
    return response.data;
};


// Quản lý bài viết
// Lấy danh sách bài viết (Góc nhìn Admin)
export const getAllPostsAdmin = async () => {
    const response = await apiClient.get('/admin/posts');
    return response.data;
};

// Xóa bài viết (Quyền Admin)
export const deletePostAdmin = async (id) => {
    const response = await apiClient.delete(`/admin/posts/${id}`);
    return response.data;
};
import React, { useState, useEffect, useMemo } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
    LayoutDashboard, FileText, Users, Search, Bell, Settings, LogOut,
    Trash2, Edit, Plus, MoreVertical, CheckCircle, XCircle, Filter
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
    getDashboardStats,
    getAllUsers,
    deleteUser,
    updateUserRole,
    getAllPostsAdmin,
    deletePostAdmin
} from './AdminService';

const Card = ({ title, value, subValue, icon: Icon, colorClass }) => (
    <div className="stat-card">
        <div className={`icon-wrapper ${colorClass}`}>
            <Icon size={24} />
        </div>
        <div className="content">
            <h3>{value}</h3>
            <p>{title}</p>
            {subValue && <span className="sub-value">{subValue}</span>}
        </div>
    </div>
);


export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        traffic: [], totalUsers: 0, totalPosts: 0, recentPosts: []
    });

    const [isAdmin, setIsAdmin] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAdminRole = () => {
            let token = null;

            // Ưu tiên lấy từ 'auth-storage' (Zustand Persist)
            const authStorage = localStorage.getItem('auth-storage');
            if (authStorage) {
                try {
                    const parsed = JSON.parse(authStorage);
                    if (parsed.state && parsed.state.token) {
                        token = parsed.state.token;
                        console.log("✅ AdminDashboard: Lấy được token từ auth-storage");
                    }
                } catch (e) {
                    console.error("Lỗi parse auth-storage:", e);
                }
            }

            // Fallback: LocalStorage key thường
            if (!token) {
                token = localStorage.getItem('access_token') || localStorage.getItem('token');
            }

            if (!token) {
                toast.error("Vui lòng đăng nhập để truy cập Admin!");
                setTimeout(() => navigate('/'), 100);
                return;
            }

            try {
                // Giải mã JWT Token
                const base64Url = token.split('.')[1];
                if (!base64Url) throw new Error("Token sai định dạng");

                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decodedToken = JSON.parse(jsonPayload);
                const role = decodedToken.role;

                console.log("Role trong token:", role);

                // Kiểm tra quyền Admin (Chấp nhận cả 'admin' và 'Admin')
                if (role && (role.toLowerCase() === 'admin')) {
                    setIsAdmin(true);
                } else {
                    // toast.error(`Truy cập bị từ chối. Role của bạn: ${role}`);
                    navigate('/');
                }
            } catch (error) {
                console.error("Token lỗi:", error);
                toast.error("Phiên đăng nhập không hợp lệ.");
                navigate('/');
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkAdminRole();
    }, [navigate]);

// Tải dữ liệu dashboard, users, posts
    const loadDashboardData = async () => {
        try {
            const data = await getDashboardStats('week');
            setStats(data);
        } catch (error) {
            console.error("Lỗi tải stats:", error);
        }
    };

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Lỗi tải users:", error);
        }
    };

    const loadPosts = async () => {
        try {
            const data = await getAllPostsAdmin();
            setPosts(data);
        } catch (error) {
            console.error("Lỗi tải posts:", error);
        }
    };

// Chỉ gọi API khi đã xác thực là Admin
    useEffect(() => {
        if (!isAdmin) return;

        if (activeTab === 'dashboard') {
            loadDashboardData();
            loadPosts();
        }
        if (activeTab === 'users') loadUsers();
        if (activeTab === 'posts') loadPosts();
    }, [activeTab, isAdmin]);


 // Xử lý dữ liệu barhcart số bài viết mới trong 7 ngày
    const postChartData = useMemo(() => {
        const normalizeDate = (date) => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d;
        };

        const last7Days = [];
        const today = new Date();

// Lấy 7 ngày gần nhất
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            last7Days.push(d);
        }

        return last7Days.map(date => {
            const targetDate = normalizeDate(date);
            const count = posts.filter(post => {
                if (!post.createdAt) return false;
                const postDate = normalizeDate(post.createdAt);
                return postDate.getTime() === targetDate.getTime();
            }).length;

            const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            const label = `${daysOfWeek[date.getDay()]} (${date.getDate()}/${date.getMonth() + 1})`;

            return { name: label, posts: count };
        });
    }, [posts]);

// Tác vụ xóa bài viết
    const handleDeletePost = async (id) => {
        if (!window.confirm('CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn bài viết khỏi Database!')) return;
        try {
            await deletePostAdmin(id);
            toast.success('Đã xóa bài viết thành công');
            setPosts(posts.filter(p => p.id !== id));
        } catch (error) {
            toast.error('Lỗi server: Không thể xóa bài viết');
        }
    };
// Tác vụ xóa người dùng
    const handleDeleteUser = async (id) => {
        if (!window.confirm('CẢNH BÁO: Xóa tài khoản sẽ xóa luôn các bài viết của họ. Tiếp tục?')) return;
        try {
            await deleteUser(id);
            toast.success('Đã xóa người dùng khỏi Database');
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            toast.error('Lỗi server: Không thể xóa người dùng');
        }
    };
// Tác vụ cập nhật vai trò người dùng
    const handleUpdateRole = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            toast.success(`Đã cập nhật quyền thành ${newRole}`);
            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));
        } catch (error) {
            toast.error("Lỗi server: Không thể cập nhật quyền");
        }
    };

    const handleLogout = () => {
        // Xóa tất cả các loại token
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');

        toast.info("Đã đăng xuất");
        window.location.href = '/';
    };

// Filter bài viết và người dùng theo từ khóa tìm kiếm
    const filteredPosts = posts.filter(post =>
        (post.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.user?.first_Name || post.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUsers = users.filter(user =>
        (user.first_Name || user.last_Name || user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

// Render loading
    if (isCheckingAuth) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f1f5f9', color: '#64748b' }}>
                <h3>Đang xác thực quyền Admin...</h3>
            </div>
        );
    }

    if (!isAdmin) return null;


    const renderDashboard = () => (
        <div className="dashboard-view fade-in">
            <div className="stats-grid">
                <Card title="Tổng bài viết" value={stats.totalPosts} subValue="Realtime DB" icon={FileText} colorClass="bg-blue" />
                <Card title="Người dùng" value={stats.totalUsers} subValue="Realtime DB" icon={Users} colorClass="bg-green" />
                <Card title="Lượt truy cập"
                    value={stats.traffic?.reduce((acc, cur) => acc + cur.pageViews, 0) || 0}
                    subValue="Tuần này" icon={Search} colorClass="bg-purple" />
                <Card title="Tương tác" value="Tracking" subValue="..." icon={CheckCircle} colorClass="bg-orange" />
            </div>

            <div className="charts-container">
                <div className="chart-box main-chart">
                    <div className="chart-header">
                        <h3>Lưu lượng truy cập (7 ngày qua)</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={stats.traffic || []}>
                            <defs>
                                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="visitors" name="Khách" stroke="#8884d8" fillOpacity={1} fill="url(#colorVisitors)" />
                            <Area type="monotone" dataKey="pageViews" name="Lượt xem" stroke="#82ca9d" fillOpacity={0.3} fill="#82ca9d" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-box side-chart">
                    <div className="chart-header">
                        <h3>Số bài viết mới (7 ngày qua)</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={postChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="posts" name="Số bài viết" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const renderPosts = () => (
        <div className="posts-view fade-in">
            <div className="toolbar">
                <div className="search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="actions">
                    <button className="btn btn-outline"><Filter size={16} /> Lọc</button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tiêu đề</th>
                            <th>Tác giả</th>
                            <th>Ngày đăng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map(post => (
                            <tr key={post.id}>
                                <td>#{post.id}</td>
                                <td>
                                    <div className="post-title">{post.title}</div>
                                </td>
                                <td>
                                    {post.user ? `${post.user.first_Name || ''} ${post.user.last_Name || ''}` : 'Ẩn danh'}
                                </td>
                                <td>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="icon-btn edit"><Edit size={16} /></button>
                                        <button className="icon-btn delete" onClick={() => handleDeletePost(post.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="users-view fade-in">
            <div className="toolbar">
                <div className="search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Tìm tên hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-info">
                                        <div className="avatar">
                                            {user.first_Name ? user.first_Name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="user-name">
                                            {user.first_Name} {user.last_Name}
                                        </div>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        className="role-select"
                                        value={user.role || 'user'}
                                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="editor">Editor</option>
                                        <option value="user">User</option>
                                    </select>
                                </td>
                                <td>
                                    <span className={`dot ${user.status === 1 ? 'active' : 'inactive'}`}></span>
                                    {user.status === 1 ? 'Active' : 'Inactive'}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="icon-btn delete" onClick={() => handleDeleteUser(user.id)}>Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="admin-container">
            <style>{`
        :root {
          --bg-dark: #1e293b;
          --bg-light: #f1f5f9;
          --surface: #ffffff;
          --primary: #3b82f6;
          --text-main: #334155;
          --text-light: #64748b;
          --border: #e2e8f0;
          --danger: #ef4444;
          --success: #10b981;
          --warning: #f59e0b;
        }

        .admin-container {
          display: flex;
          height: 100vh;
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-light);
          color: var(--text-main);
          overflow: hidden;
        }

        .sidebar {
          width: 250px;
          background-color: var(--bg-dark);
          color: white;
          display: flex;
          flex-direction: column;
          transition: width 0.3s;
        }
        
        .brand {
          padding: 20px;
          font-size: 1.5rem;
          font-weight: bold;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-menu {
          list-style: none;
          padding: 0;
          margin-top: 20px;
        }

        .nav-item {
          padding: 15px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #94a3b8;
          transition: 0.2s;
        }

        .nav-item:hover, .nav-item.active {
          background-color: rgba(255,255,255,0.1);
          color: white;
          border-right: 4px solid var(--primary);
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .topbar {
          height: 60px;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
        }

        .page-title { font-size: 1.2rem; font-weight: 600; }
        .user-profile { display: flex; gap: 15px; align-items: center; }

        .content-area {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .fade-in { animation: fadeIn 0.3s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: var(--surface);
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .icon-wrapper {
          width: 50px; height: 50px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: white;
        }
        .bg-blue { background: var(--primary); }
        .bg-green { background: var(--success); }
        .bg-purple { background: #8b5cf6; }
        .bg-orange { background: var(--warning); }

        .stat-card h3 { margin: 0; font-size: 1.5rem; }
        .stat-card p { margin: 0; color: var(--text-light); font-size: 0.9rem; }
        .sub-value { font-size: 0.8rem; color: var(--success); }

        .charts-container {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .chart-box {
          background: var(--surface);
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .main-chart { flex: 2; min-width: 400px; }
        .side-chart { flex: 1; min-width: 300px; }

        .toolbar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          background: var(--surface);
          padding: 15px;
          border-radius: 8px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-light);
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid var(--border);
        }
        .search-bar input {
          border: none; background: transparent; outline: none;
        }

        .table-container {
          background: var(--surface);
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          overflow-x: auto;
        }

        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 15px; text-align: left; border-bottom: 1px solid var(--border); }
        th { background: #f8fafc; font-weight: 600; color: var(--text-light); }
        
        .badge { padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; }
        .badge.published, .badge.active { background: #dcfce7; color: #166534; }
        .badge.draft, .badge.inactive { background: #f1f5f9; color: #475569; }
        .badge.pending { background: #fef9c3; color: #854d0e; }
        .badge.banned { background: #fee2e2; color: #991b1b; }

        .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px; }
        .dot.active { background: var(--success); }
        .dot.inactive { background: var(--text-light); }
        .dot.banned { background: var(--danger); }

        .btn {
          padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer;
          display: flex; align-items: center; gap: 8px; font-weight: 500;
        }
        .btn-primary { background: var(--primary); color: white; }
        .btn-outline { background: white; border: 1px solid var(--border); }
        
        .icon-btn {
          padding: 6px; border-radius: 4px; border: none; cursor: pointer; background: transparent; color: var(--text-light);
        }
        .icon-btn:hover { background: var(--bg-light); }
        .icon-btn.delete:hover { color: var(--danger); background: #fee2e2; }
        .icon-btn.edit:hover { color: var(--primary); background: #dbeafe; }

        .user-info { display: flex; align-items: center; gap: 10px; }
        .avatar {
          width: 36px; height: 36px; background: var(--primary); color: white;
          border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;
        }
        .user-name { font-weight: 500; }
        .user-email { font-size: 0.8rem; color: var(--text-light); }
        .role-select { padding: 5px 10px; border-radius: 4px; border: 1px solid var(--border); background: white; cursor: pointer; }

      `}</style>

            {/* Sidebar */}
            <div className="sidebar">
                <div className="brand">
                    <Settings /> AdminPanel
                </div>
                <ul className="nav-menu">
                    <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <LayoutDashboard size={20} /> Tổng quan
                    </li>
                    <li className={`nav-item ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
                        <FileText size={20} /> Bài viết
                    </li>
                    <li className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        <Users size={20} /> Tài khoản
                    </li>
                    <li className="nav-item" onClick={handleLogout} style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <LogOut size={20} /> Đăng xuất
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="topbar">
                    <div className="page-title">
                        {activeTab === 'dashboard' && 'Tổng quan hệ thống'}
                        {activeTab === 'posts' && 'Quản lý bài viết'}
                        {activeTab === 'users' && 'Danh sách người dùng'}
                    </div>
                    <div className="user-profile">
                        <Bell size={20} />
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: 14 }}>AD</div>
                    </div>
                </div>

                <div className="content-area">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'posts' && renderPosts()}
                    {activeTab === 'users' && renderUsers()}
                </div>
            </div>
        </div>
    );
}
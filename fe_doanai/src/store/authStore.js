
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Sử dụng middleware `persist` để tự động lưu vào localStorage
export const useAuthStore = create(
    persist(
        (set) => ({
            // State
            token: null,
            user: null,
            isAuthenticated: false,

            // Actions (hàm để thay đổi state)
            login: (userData, accessToken) => set({
                user: userData,
                token: accessToken,
                isAuthenticated: true
            }), 
            logout: () => set({
                user: null,
                token: null,
                isAuthenticated: false
            }),
        }),
        {
            name: 'auth-storage', // Tên key trong localStorage
            storage: createJSONStorage(() => localStorage), // (optional) by default the 'localStorage' is used
        }
    )
);
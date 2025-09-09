import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
    username: string;
}

export interface LoginState {
    user: User | null;
    isLoginModalOpen: boolean;
    loginMessage: string | null;
}

const initialState: LoginState = {
    user: null,
    isLoginModalOpen: false,
    loginMessage: null,
};

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        setLoginModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isLoginModalOpen = action.payload;
        },
        setLoginMessage: (state, action: PayloadAction<string | null>) => {
            state.loginMessage = action.payload;
        },
        login: (state, action: PayloadAction<string>) => {
            state.user = { username: action.payload };
            state.isLoginModalOpen = false;
            state.loginMessage = null;
        },
        logout: (state) => {
            state.user = null;
        },
        openLoginModal: (state, action: PayloadAction<string | null>) => {
            state.isLoginModalOpen = true;
            state.loginMessage = action.payload || null;
        },
        closeLoginModal: (state) => {
            state.isLoginModalOpen = false;
            state.loginMessage = null;
        },
    }
});

export const { 
    setUser,
    setLoginModalOpen,
    setLoginMessage,
    login,
    logout,
    openLoginModal,
    closeLoginModal
} = loginSlice.actions;

export default loginSlice.reducer;

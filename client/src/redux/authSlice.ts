import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface AuthState{
    user:{id:number;username:string;role:string; token: string} | null;
    isAuthenticated: boolean;
}
const storedUser = localStorage.getItem("user")

const initialState: AuthState = {
    user:storedUser? JSON.parse(storedUser):null,
    isAuthenticated:false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state,action:PayloadAction<{id: number; token: string; username:string;role:string}>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
        },
    }
});

export const {login,logout} = authSlice.actions;
export default authSlice.reducer;
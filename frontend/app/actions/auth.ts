"use server";

import { cookies } from "next/headers";
import { AuthResponse } from "@/types/api";
import { ApiClient } from "@/lib/api";

export async function loginAction(formData: FormData) {
    try {
        const response = await ApiClient.post<AuthResponse>("/auth/login", formData);
        
        const cookieStore = await cookies();
        cookieStore.set("token", response.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return { success: true };
    } catch (error: any) {
        console.error("Login Action Error:", error);
        let errorMsg = "Invalid credentials";
        if (error?.data?.detail) {
            errorMsg = typeof error.data.detail === "string" ? error.data.detail : JSON.stringify(error.data.detail);
        } else if (error?.message) {
            errorMsg = error.message;
        }
        return { success: false, error: errorMsg };
    }
}

export async function registerAction(data: any) {
    try {
        await ApiClient.post("/auth/register", data);
        return { success: true };
    } catch (error: any) {
        console.error("Register Action Error:", error);
        let errorMsg = "Registration failed";
        if (error?.data?.detail) {
            errorMsg = typeof error.data.detail === "string" ? error.data.detail : JSON.stringify(error.data.detail);
        } else if (error?.message) {
            errorMsg = error.message;
        }
        return { success: false, error: errorMsg };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return { success: true };
}

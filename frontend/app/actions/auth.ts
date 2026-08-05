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
        return { success: false, error: error?.data?.detail || "Invalid credentials" };
    }
}

export async function registerAction(data: any) {
    try {
        await ApiClient.post("/auth/register", data);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error?.data?.detail || "Registration failed" };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return { success: true };
}

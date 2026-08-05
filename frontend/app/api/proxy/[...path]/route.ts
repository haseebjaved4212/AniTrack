import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function ANY(req: NextRequest, { params }: { params: { path: string[] } }) {
    const { path } = await params; // Unpack dynamic route path
    const endpoint = "/" + path.join("/");
    
    // Pass query string along
    const url = new URL(req.url);
    const backendUrl = `${BASE_URL}${endpoint}${url.search}`;

    const fetchOptions: RequestInit = {
        method: req.method,
        headers: new Headers(req.headers),
        // Don't duplicate host header
    };

    const headers = fetchOptions.headers as Headers;
    headers.delete("host");
    headers.delete("cookie");

    // Retrieve httpOnly cookie and attach it as Bearer token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
        fetchOptions.body = await req.arrayBuffer();
    }

    try {
        const response = await fetch(backendUrl, fetchOptions);
        
        // Pass response back to client
        const responseHeaders = new Headers(response.headers);
        responseHeaders.delete("content-encoding");

        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (e: any) {
        return NextResponse.json({ error: "Proxy error", details: e.message }, { status: 500 });
    }
}

// Next.js requires exporting explicit HTTP methods
export const GET = ANY;
export const POST = ANY;
export const PUT = ANY;
export const PATCH = ANY;
export const DELETE = ANY;
export const OPTIONS = ANY;

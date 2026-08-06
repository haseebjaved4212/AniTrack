import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function handleProxy(req: NextRequest, path: string[]) {
    const endpoint = "/" + path.join("/");
    
    // Pass query string along
    const backendUrl = `${BASE_URL}${endpoint}${req.nextUrl.search}`;
    
    const headers = new Headers(req.headers);
    // Don't forward the host header
    headers.delete("host");
    
    // Inject the Bearer token if we have the cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    try {
        const response = await fetch(backendUrl, {
            method: req.method,
            headers,
            body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.blob(),
            // Don't follow redirects automatically if we want to handle them
            redirect: "manual", 
        });

        const data = await response.text();
        
        return new NextResponse(data, {
            status: response.status,
            headers: {
                "Content-Type": response.headers.get("Content-Type") || "application/json",
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { detail: "Proxy error to backend", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ path: string[] }> }
) {
    const params = await props.params;
    return handleProxy(request, params.path);
}

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ path: string[] }> }
) {
    const params = await props.params;
    return handleProxy(request, params.path);
}

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ path: string[] }> }
) {
    const params = await props.params;
    return handleProxy(request, params.path);
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ path: string[] }> }
) {
    const params = await props.params;
    return handleProxy(request, params.path);
}

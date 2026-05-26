export async function POST(request) {
    try {
        const body = await request.json();
        const res  = await fetch("http://localhost:5000/cart/add", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(body),
        });
        const data = await res.json();
        return Response.json(data);
    } catch {
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    try {
        const res  = await fetch(`http://localhost:5000/cart/${email}`);
        const data = await res.json();
        return Response.json(data);
    } catch {
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
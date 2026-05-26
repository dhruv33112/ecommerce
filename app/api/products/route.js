export async function GET() {
    try {
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();
        return Response.json(data);
    } catch {
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
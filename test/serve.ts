import { join } from "path";

const root = join(import.meta.dir, "..");

Bun.serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url);
        const path = url.pathname === "/" ? "/test/index.html" : url.pathname;
        return new Response(Bun.file(join(root, path)));
    },
});

console.log("http://localhost:3000");

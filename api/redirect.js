export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).send("ID is missing");
    }

    const firebaseURL = `https://campaign-link-gen-default-rtdb.asia-southeast1.firebasedatabase.app/campaigns/${id}.json`;

    try {
        const response = await fetch(firebaseURL);
        const data = await response.json();

        if (data) {
            // মেটা ট্যাগ এবং রিডাইরেক্ট HTML
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${data.title || "Offer"}</title>
                    <meta property="og:title" content="${data.title || "Special Offer"}" />
                    <meta property="og:description" content="${data.description || "Click to see details"}" />
                    <meta property="og:image" content="${data.imageUrl || ""}" />
                    <meta property="og:type" content="website" />
                    <script>
                        window.location.replace("${data.targetUrl}");
                    </script>
                </head>
                <body style="background:#1a1a1a; color:white; text-align:center; padding-top:50px; font-family:sans-serif;">
                    <p>Redirecting you...</p>
                </body>
                </html>
            `;
            res.setHeader('Content-Type', 'text/html');
            return res.status(200).send(html);
        } else {
            return res.status(404).send("Link not found in database.");
        }
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
}

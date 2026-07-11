experts default async function handler(req, res) {
    const { id } = req.query;
    
    // আপনার ডাটাবেস URL
    const firebaseURL = `https://campaign-link-gen-default-rtdb.asia-southeast1.firebasedatabase.app/campaigns/${id}.json`;

    try {
        const response = await fetch(firebaseURL);
        const data = await response.json();

        if (data) {
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>${data.title}</title>
                    <meta property="og:title" content="${data.title}" />
                    <meta property="og:description" content="${data.description}" />
                    <meta property="og:image" content="${data.imageUrl}" />
                    <meta property="og:type" content="website" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <script>
                        setTimeout(function(){
                            window.location.href = "${data.targetUrl}";
                        }, 800);
                    </script>
                </head>
                <body style="background:#1a1a1a; color:white; text-align:center; font-family:sans-serif; padding-top:50px;">
                    <div style="margin: 20px auto; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <h3>Redirecting to offer...</h3>
                    <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
                </body>
                </html>
            `);
        } else {
            res.status(404).send("Campaign Link Not Found");
        }
    } catch (error) {
        res.status(500).send("Database Connection Error");
    }
}

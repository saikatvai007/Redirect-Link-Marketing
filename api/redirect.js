export default async function handler(req, res) {
    const { id } = req.query;
    const userAgent = req.headers['user-agent'] || '';

    // ফেসবুক ও অন্যান্য বট চেনার লজিক
    const isBot = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|googlebot|slackbot|discordbot/i.test(userAgent);

    const firebaseURL = `https://campaign-link-gen-default-rtdb.asia-southeast1.firebasedatabase.app/campaigns/${id}.json`;

    try {
        const response = await fetch(firebaseURL);
        const data = await response.json();

        if (data) {
            res.setHeader('Content-Type', 'text/html');

            // সাধারণ মেটা ট্যাগ যা সবাই (মানুষ + বট) দেখবে
            let html = `
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
            `;

            if (!isBot) {
                // শুধু মানুষ হলে রিডাইরেক্ট স্ক্রিপ্ট যোগ হবে
                html += `
                    <script>
                        window.location.replace("${data.targetUrl}");
                    </script>
                `;
            }

            html += `
                </head>
                <body style="background:#1a1a1a; color:white; text-align:center; font-family:sans-serif; padding-top:50px;">
                    <h3>Loading content...</h3>
                </body>
                </html>
            `;

            return res.status(200).send(html);
        } else {
            return res.status(404).send("Link Not Found");
        }
    } catch (error) {
        return res.status(500).send("Server Error");
    }
}

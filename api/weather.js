
export default async function handler(req, res) {
    const city = String(req.query.city || "").trim();
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!city) {
        return res.status(400).json({
            message: "Please provide a city name."
        });
    }

    if (!apiKey) {
        return res.status(500).json({
            message: "Weather API is not configured."
        });
    }

    try {
        const url = new URL(
            "https://api.openweathermap.org/data/2.5/weather"
        );

        url.searchParams.set("q", city);
        url.searchParams.set("units", "metric");
        url.searchParams.set("appid", apiKey);

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                message: data.message || "Unable to get weather."
            });
        }

        return res.status(200).json(data);
    } catch {
        return res.status(502).json({
            message: "Could not connect to the weather service."
        });
    }
}

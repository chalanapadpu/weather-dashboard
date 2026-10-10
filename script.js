

const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const message = document.getElementById("message");
const weatherCard = document.getElementById("weather-card");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        message.textContent = "Please enter a city name.";
        return;
    }



    await getWeather(city);
});

async function getWeather(city) {
    searchBtn.disabled = true;
    message.textContent = "Loading weather data...";
    weatherCard.hidden = true;

    try {
        const response = await fetch(
            `/api/weather?city=${encodeURIComponent(city)}`
        );
        // Handle HTTP errors, including invalid cities and API keys.
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Check the spelling.");
            }

            if (response.status === 401) {
                throw new Error(
                    "Invalid or inactive API key. Check your API key."
                );
            }

            if (response.status === 429) {
                throw new Error("API limit reached. Try again later.");
            }

            throw new Error(
                `Weather request failed (${response.status}).`
            );
        }

        // Convert the JSON response into a JavaScript object.
        const data = await response.json();

        // Read values from the nested JSON object.
        document.getElementById("city-name").textContent =
            `${data.name}, ${data.sys.country}`;

        document.getElementById("temperature").textContent =
            `${Math.round(data.main.temp)}°C`;

        document.getElementById("description").textContent =
            data.weather[0].description;

        document.getElementById("humidity").textContent =
            `${data.main.humidity}%`;

        document.getElementById("wind").textContent =
            `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

        document.getElementById("feels-like").textContent =
            `${Math.round(data.main.feels_like)}°C`;

        const icon = document.getElementById("weather-icon");
        icon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        icon.alt = data.weather[0].description;

        weatherCard.hidden = false;
        message.textContent = "Weather updated successfully!";

    } catch (error) {
        if (error instanceof TypeError) {
            message.textContent =
                "Network error. Check your internet connection and try again.";
        } else {
            message.textContent = error.message;
        }
    } finally {
        searchBtn.disabled = false;
    }
}

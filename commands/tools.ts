import type { Tool } from "openai/resources/responses/responses.mjs";

export const tools: Tool[] = [
  {
    type: "function",
    name: "getCurrentTemperature",
    description: "Get the current temperature for a specific location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g., San Francisco, CA",
        },
        unit: {
          type: "string",
          enum: ["Celsius", "Fahrenheit"],
          description:
            "The temperature unit to use. Infer this from the user's location.",
        },
      },
      required: ["location", "unit"],
    },
    strict: false,
  }
]

export async function getWeather(location: string) {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl)
    const geoData: any = await geoResponse.json()

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Couldnt find co ordinates")
    }

    const place = geoData.results[0]
    const { latitude, longitude, name, country } = place
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData: any = await weatherResponse.json();
    const currentTemp = weatherData.current_weather.temperature;

    return `The current weather in ${location} is ${currentTemp}`
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

import type { Tool } from "openai/resources/responses/responses.mjs";
import { appendFile } from "node:fs/promises"


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


export async function writeFile(fileName: string, content: string, mode: string) {

  const file = Bun.file(fileName)
  if (await file.exists()) {
    if (mode === "append") {
      await appendFile(fileName, content)
    } else if (mode === "overwrite") {
      await Bun.write(fileName, content)
    }
  } else {
    Bun.write(file, content)
  }

  return "Success"
}

export async function readFile(fileName: string) {
  const file = Bun.file(fileName)
  const text = await file.text()

  return text
}

export async function deleteFile(fileName: string, content: string) {

  const file = Bun.file(fileName)
  const text = await file.text()
  if (content === "") {
    await file.delete()
  } else {
    const result = text.replaceAll(content, "")
    Bun.write(fileName, result)
  }

  return "Succces"
}


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
  },
  {
    type: "function",
    name: "writeFile",
    description: "Create or edit the files",
    parameters: {
      type: "object",
      properties: {
        file: {
          type: "string",
          description: "The name of the file",
        },
        content: {
          type: "string",
          description: "The content that needs to be written or edited in the file"
        },
        mode: {
          type: "string",
          enum: ["append", "overwrite"],
          description: "If the user wants to edit the file then overwrite it, and if the user wants to add contents then apped it to the file."
        },
      },
      required: ["file", "content"]
    },
    strict: false,
  },
  {
    type: "function",
    name: "readFile",
    description: "Read the file",
    parameters: {
      type: "object",
      properties: {
        file: {
          type: "string",
          description: "The name of the file which you have to read",
        },
      },
      required: ["file"]
    },
    strict: false,
  },
  {
    type: "function",
    name: "deleteFile",
    description: "The file or the content which needs to be deleted",
    parameters: {
      type: "object",
      properties: {
        file: {
          type: "string",
          description: "The name of the file in which the content needs to be deleted, and if NO CONTENT is provided, delete the entire file",
        },
        content: {
          type: "string",
          description: "To delete the contents of the file, call readFile tool and read the content that needs to be deleted in the file"
        },
      },
      required: ["file", "content"]
    },
    strict: false,
  }
]

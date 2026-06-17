import { Command } from 'commander'
import OpenAI from "openai"
import type { Tool } from 'openai/resources/responses/responses.mjs'

const client = new OpenAI()

export const agentCommand = new Command("agent")
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action((options) => {
    agentLoop(options.prompt)
    console.log("User prompt is ..." + options.prompt)
  })


const tools: Tool[] = [
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

async function getWeather(location: string) {
  try {
    console.log(`Searching for ${location}`)

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl)
    const geoData: any = await geoResponse.json()

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Couldnt find co ordinates")
    }

    const place = geoData.results[0]
    const { latitude, longitude, name, country } = place

    console.log(`Found ${name}, ${country} (Lat: ${latitude}, Lon: ${longitude}). Fetching weather...`);

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData: any = await weatherResponse.json();
    const currentTemp = weatherData.current_weather.temperature;

    console.log(`\n--- Results ---`);
    return `The current weather in ${location} is ${currentTemp}`
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

async function agentLoop(prompt: string) {
  let input: any = [
    { role: "user", content: prompt }
  ]

  let response = await client.responses.create({
    model: "gpt-4o",
    tools,
    input
  })
  input.push(...response.output)


  while (true) {
    let hasMoreCalls = true

    while (hasMoreCalls) {
      for (const item of response.output) {
        if (item.type !== "function_call") continue;

        if (item.name === "getCurrentTemperature") {
          const { location } = JSON.parse(item.arguments)
          const weather = await getWeather(location)

          input.push({
            type: "function_call_output",
            call_id: item.call_id,
            output: weather
          })
        }
      }

      console.log("Final input:");
      console.log(JSON.stringify(input, null, 2));

      response = await client.responses.create({
        model: "gpt-4o",
        instructions: "Read the question and answer accordingly, use Tools if required.",
        tools,
        input,
      });

      for (const item of response.output) {
        if (item.type !== "function_call") {
          hasMoreCalls = false
        }
      }
      console.log(response.output)
    }
    console.log("Final output:");
    console.log(response.output_text);
    break;
  }
}

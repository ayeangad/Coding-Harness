import OpenAI from "openai"
import { tools, getWeather } from "./tools"

const client = new OpenAI()

export async function agentLoop(prompt: string) {
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

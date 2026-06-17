import OpenAI from "openai"
import { tools, getWeather, writeFile, readFile, deleteFile } from "./tools"

const client = new OpenAI()

const file = Bun.file("context")
let initialContext: any[] = []

if (await file.exists()) {
  const text = await file.text()
  initialContext = JSON.parse(text)
}
export async function agentLoop(prompt: string) {

  let input: any = initialContext
  input.push({ role: "user", content: prompt })

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

        if (item.name === "writeFile") {
          const { file, content, mode } = JSON.parse(item.arguments)
          const writtenFile = await writeFile(file, content, mode)

          input.push({
            type: "function_call_output",
            call_id: item.call_id,
            output: writtenFile
          })
        }

        if (item.name === "readFile") {
          const { file } = JSON.parse(item.arguments)
          const doneReading = await readFile(file)

          input.push({
            type: "function_call_output",
            call_id: item.call_id,
            output: doneReading
          })
        }

        if (item.name === "deleteFile") {
          const { file, content } = JSON.parse(item.arguments)
          const deletedFile = await deleteFile(file, content)

          input.push({
            type: "function_call_output",
            call_id: item.call_id,
            output: deletedFile
          })
        }
      }

      response = await client.responses.create({
        model: "gpt-4o",
        instructions: "Read the question and answer accordingly, use Tools if required.",
        tools,
        input,
      });

      input.push(...response.output)

      for (const item of response.output) {
        if (item.type !== "function_call") {
          hasMoreCalls = false
        }
      }
    }
    console.log(response.output_text);
    const newContext = JSON.stringify(input)
    Bun.write("context", newContext)
    break;
  }
}

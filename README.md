# Coding Harness

A TypeScript CLI that wraps a LLM model agent loop with file system and weather tools. Give it a prompt, it decides which tools to call, executes them, and returns a final answer.

Built with Bun + Commander.

---

## Prerequisites

- [Bun](https://bun.sh) v1.3+
- An OpenAI API key

---

## Installation

```bash
git clone https://github.com/ayeangad/Coding-Harness.git
cd Coding-Harness
bun install
```

---

## Configuration

### 1. Login with your provider and API key

```bash
bun run cli.ts providers login -p openai -a <your-api-key>
```

This saves your provider and API key to `~/.coding-harness/config.json`.

### 2. (Optional) Set a default provider

```bash
bun run cli.ts providers setprovider -p openai
```

### 3. (Optional) Logout

Clears the saved config.

```bash
bun run cli.ts providers logout
```

> **Note:** The agent loop currently reads the API key from the `OPENAI_API_KEY` environment variable. If you prefer to set it manually instead of using the login command:
> ```bash
> export OPENAI_API_KEY=your_key_here
> ```

---

## Commands

### `agent`

Runs the GPT-4o (but can run any OpenAI model) agent loop with a prompt. The agent can use tools to read/write files and fetch weather.

```bash
bun run cli.ts agent -p "read config.json and summarize it"
bun run cli.ts agent --prompt "what is the weather in Mumbai?"
bun run cli.ts agent -p "create a file called notes.txt and write 3 ideas for a startup"
```

**Available tools:**

| Tool | Description |
|---|---|
| `readFile` | Reads a file from disk |
| `writeFile` | Writes or appends content to a file |
| `deleteFile` | Deletes a file |
| `getCurrentTemperature` | Fetches current weather for a location |

---

### `models`

Lists supported LLM models from the model registry.

```bash
bun run cli.ts models              # list all models
bun run cli.ts models -m openai    # list OpenAI models only
bun run cli.ts models -m anthropic # list Anthropic models only
```

---

### `providers`

Manage your provider config. Credentials are saved to `~/.coding-harness/config.json`.

```bash
bun run cli.ts providers login -p openai -a <your-api-key>   # save provider + API key
bun run cli.ts providers setprovider -p openai               # set default provider only
bun run cli.ts providers logout                              # clear saved config
```

---

## Project Structure

```
cli.ts                  # entry point, registers all commands
commands/
  agent.ts              # agent command
  agent-loop.ts         # core loop: prompt → tool calls → final output
  model.ts              # models command
  providers/
    index.ts            # registers provider subcommands
    login.ts            # saves provider + API key to ~/.coding-harness/config.json
    logout.ts           # clears config
    setProvider.ts      # updates default provider in config
data/
  llm-models.ts         # model registry (OpenAI + Anthropic)
```

---

## Stack

- [Bun](https://bun.sh) — runtime and package manager
- [Commander](https://github.com/tj/commander.js) — CLI framework
- [OpenAI Node SDK](https://github.com/openai/openai-node) — GPT-4o agent via `client.responses.create`
- TypeScript

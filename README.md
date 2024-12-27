# We Have Agents At Home 🤖

This is an attempt to create an AI agent 'from scratch' to better understand the underlying principles of the [ReAct](https://arxiv.org/abs/2210.03629) pattern without using a framework like [LangGraph](https://www.langchain.com/langgraph) or [CrewAI](https://www.crewai.com/).

It was inspired by (and partially based on) Simon Willison's [A simple Python implementation of the ReAct pattern for LLMs](https://til.simonwillison.net/llms/python-react-pattern) but rewritten in TypeScript.

I also wanted to be able to call this from my phone so I used [Hono](https://hono.dev/) to create an API to call the agent and deployed it via [SST](https://sst.dev/).

This is an evolving project and is subject to change. If you like it in it's current form, fork it.

## 🚀 Features

- RAG with intelligent search capabilities via Tavily and Wikipedia
- Easy deployment to AWS
- Response caching system for well, whatever. I have my reasons.
- Built with TypeScript and Hono framework

## 📋 Prerequisites

- Deno, Bun or Node.js
- AWS account and configured credentials
- Anthropic API key
- Tavily API key

## 🛠️ Setup

1. Clone the repository:
```bash
git clone https://github.com/brianprost/we-have-agents-at-home.git
cd we-have-agents-at-home
```

2. Install dependencies:
```bash
deno install
```

3. Set up environment variables:
Create a `.env` file with the following variables:
```
ANTHROPIC_API_KEY=your_anthropic_api_key
TAVILY_API_KEY=your_tavily_api_key
```

## 🚀 Development

To run the project locally:
```bash
deno task dev
```

## 📦 Deployment

To deploy to AWS:
```bash
deno task deploy
```

## 🏗️ Project Structure

- `main.ts` - Main application entry point
- `sst.config.ts` - SST configuration and infrastructure setup
- `db.ts` - Database operations and cache management
- `env.ts` - Environment variable configuration

## 🔧 Built With

- [SST](https://sst.dev/)
- [Hono](https://hono.dev/)
- [Anthropic Claude](https://www.anthropic.com/)
- [Tavily](https://tavily.com/)
- [DynamoDB](https://aws.amazon.com/dynamodb/)
- [TypeScript](https://www.typescriptlang.org/)

## 📄 License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

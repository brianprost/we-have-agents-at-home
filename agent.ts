import { parseXML } from "./xml.ts";
import Anthropic from "@anthropic-ai/sdk";
import { tavily } from "@tavily/core";
import env from "./env.ts";

const tvly = tavily({ apiKey: env.TAVILY_API_KEY });
class ChatBot {
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
  anthropic: Anthropic;

  constructor(system: string) {
    this.system = system;
    this.messages = [];
    this.anthropic = new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
    });
  }

  async call(message: string) {
    this.messages.push({ role: "user", content: message });
    const result = await this.execute();
    this.messages.push({ role: "assistant", content: result });
    return result;
  }

  async execute(): Promise<string> {
    const message = await this.anthropic.messages.create({
      model: "claude-3-5-haiku-latest",
      messages: this.messages,
      system: this.system,
      max_tokens: 2048,
      temperature: 0.9,
    });

    const result = message.content[0] as { type: "text"; text: string };
    return result.text;
  }
}

const knownActions = new Map([
  ["wikipedia", wikipedia],
  ["calculate", calculate],
  ["search", search],
  ["answer", answer],
]);

const systemPrompt =
  `You are an AI agent designed to answer questions through a process of thinking, acting, and observing. Your goal is to provide accurate and helpful answers to user queries.

You will operate in a loop of ANALYSIS, ACTION, PAUSE, and OBSERVATION. Here's how the process works:

1. ANALYSIS: Break down the query, list potential actions, and justify your chosen action.
2. ACTION: Choose and execute one, AND ONLY ONE, of the available actions (listed below).
3. PAUSE: After executing an action, you will pause and wait for an observation.
4. OBSERVATION: You will receive the result of your action.
5. ANSWER: Once you have enough information, formulate your final answer.

Available actions:

1. calculate:
   Use this to perform mathematical calculations.
   Format: <ACTION>calculate</ACTION><PARAMETERS>[mathematical expression]</PARAMETERS>
   Example: <ACTION>calculate</ACTION><PARAMETERS>4 * 7 / 3</PARAMETERS>

2. wikipedia:
   Use this to search Wikipedia for information.
   Format: <ACTION>wikipedia</ACTION><PARAMETERS>[search term]</PARAMETERS>
   Example: <ACTION>wikipedia</ACTION><PARAMETERS>Deno</PARAMETERS>

3. search:
   Use this to search the internet for information.
   Format: <ACTION>search</ACTION><PARAMETERS>[search term]</PARAMETERS>
   Example: <ACTION>search</ACTION><PARAMETERS>Deno</PARAMETERS>

4. answer:
   Use this to answer the query directly.
   Format: <ACTION>answer</ACTION><PARAMETERS>[answer text]</PARAMETERS>
   Example: <ACTION>answer</ACTION><PARAMETERS>Hello, world!</PARAMETERS>

Important guidelines:
- The current date is ${
    new Date().toISOString()
  }. Use this for any date-related queries.
- Some queries may require up-to-date information. Always check the internet for the latest information.
- Be reasonable about the limits of how up to date your training data is. It is entirely likely that the user's query will be about events that have happened since the last date of your training.
- Always use Wikipedia when possible to look up **factual** information.
- Be thorough in your thinking process and consider all relevant aspects of the query.
- There are dire consequences to using more than one action.

Output format:
Your response should follow this structure:

<ANALYSIS>
1. Observation ANALYSIS: [Analyze how the observation relates to the query]
2. Next steps: [Determine if the query is fully answered or if more actions are needed]
</ANALYSIS>

<ACTION>[Action name]<PARAMETERS>[Action parameters]</PARAMETERS></ACTION>

Remember, your goal is to provide accurate and helpful answers to the user's query. Take your time to think through the problem and use the available actions wisely.`
    .trim();

async function query(question: string, maxTurns = 10) {
  console.log(`\n\nQuery: ${question}\n\n`);
  let i = 0;
  const bot = new ChatBot(systemPrompt);
  let nextPrompt = question;

  while (i < maxTurns) {
    i++;
    const result = await bot.call(nextPrompt);
    console.log(result);

    const action = parseXML("ACTION", result);

    if (action) {
      const actionInput = parseXML("PARAMETERS", result);

      console.log(`🤖 running ${action} ${actionInput}`);
      if (!knownActions.has(action)) {
        throw new Error(`Unknown action: ${action}`);
      }

      if (action === "answer") {
        return actionInput;
      }

      const observation = await knownActions.get(action)!(actionInput);
      console.log("Observation:", observation);
      nextPrompt = `Observation: ${observation}`;
    } else {
      return result;
    }
  }
}

async function wikipedia(q: string): Promise<string> {
  console.log(`\n\nDoing a Wikipedia search\n\n`);
  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${
      encodeURIComponent(
        q,
      )
    }&format=json`,
  );
  const data = await response.json();
  return data.query.search[0].snippet;
}

async function search(q: string): Promise<string> {
  console.log(`\n\nDoing a web search\n\n`);
  const response = await tvly.search(q, {});
  return JSON.stringify(response.results);
}

function calculate(q: string): Promise<string> {
  console.log(`\n\nCalculating\n\n`);
  return eval(q);
}

function answer(q: string): Promise<string> {
  console.log(`\n\nAnswering\n\n`);
  return new Promise((resolve) => resolve(q));
}

export { ChatBot, query };

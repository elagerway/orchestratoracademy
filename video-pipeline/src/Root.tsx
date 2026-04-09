import React from "react";
import { Composition, staticFile } from "remotion";
import { BrandIntro } from "./compositions/BrandIntro";
import { ModuleVideo } from "./compositions/ModuleVideo";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="BrandIntro"
        component={BrandIntro}
        durationInFrames={Math.round(1.5 * 25)}
        fps={25}
        width={1920}
        height={1080}
      />
      <Composition
        id="M8L1-Code1"
        component={ModuleVideo}
        durationInFrames={1063}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1063,
              voiceoverUrl: staticFile("Module 8/Lesson 1/voiceover-code1.mp3"),
              lines: [
                { type: "comment" as const, text: "# What happens when you send a message to Claude" },
                { type: "command" as const, text: "curl https://api.anthropic.com/v1/messages", delay: 30 },
                { type: "output" as const, text: "  -H \"x-api-key: sk-ant-...\"", delay: 20 },
                { type: "output" as const, text: "  -H \"content-type: application/json\"", delay: 10 },
                { type: "output" as const, text: "  -d '{", delay: 15 },
                { type: "output" as const, text: "    \"model\": \"claude-sonnet-4-20250514\",", delay: 10 },
                { type: "output" as const, text: "    \"max_tokens\": 256,", delay: 10 },
                { type: "output" as const, text: "    \"messages\": [{", delay: 10 },
                { type: "output" as const, text: "      \"role\": \"user\",", delay: 10 },
                { type: "output" as const, text: "      \"content\": \"What is an AI Orchestrator?\"", delay: 10 },
                { type: "output" as const, text: "    }]", delay: 10 },
                { type: "output" as const, text: "  }'", delay: 15 },
                { type: "comment" as const, text: "", delay: 30 },
                { type: "comment" as const, text: "# Response from Claude", delay: 20 },
                { type: "output" as const, text: "✓ 200 OK", delay: 25 },
                { type: "output" as const, text: "{", delay: 15 },
                { type: "output" as const, text: "  \"content\": [{", delay: 10 },
                { type: "output" as const, text: "    \"text\": \"An AI Orchestrator designs and", delay: 10 },
                { type: "output" as const, text: "     coordinates multiple AI systems to work", delay: 10 },
                { type: "output" as const, text: "     together toward a common goal.\"", delay: 10 },
                { type: "output" as const, text: "  }],", delay: 10 },
                { type: "output" as const, text: "  \"model\": \"claude-sonnet-4-20250514\",", delay: 10 },
                { type: "output" as const, text: "  \"usage\": { \"input_tokens\": 18, \"output_tokens\": 31 }", delay: 10 },
                { type: "output" as const, text: "}", delay: 15 },
              ],
            },
          ],
        }}
      />
      <Composition
        id="M8L1-Code2"
        component={ModuleVideo}
        durationInFrames={1012}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1012,
              voiceoverUrl: staticFile("Module 8/Lesson 1/voiceover-code2.mp3"),
              lines: [
                { type: "comment" as const, text: "# The four API actions" },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "command" as const, text: "GET /v1/customers/123/orders", delay: 30 },
                { type: "output" as const, text: "✓ Retrieve data — fetch this customer's order history", delay: 20 },
                { type: "comment" as const, text: "", delay: 30 },
                { type: "command" as const, text: "POST /v1/messages", delay: 40 },
                { type: "output" as const, text: "✓ Create something new — send a message to Claude", delay: 20 },
                { type: "comment" as const, text: "", delay: 30 },
                { type: "command" as const, text: "PUT /v1/customers/123", delay: 40 },
                { type: "output" as const, text: "✓ Update existing data — change this customer's email", delay: 20 },
                { type: "comment" as const, text: "", delay: 30 },
                { type: "command" as const, text: "DELETE /v1/subscriptions/456", delay: 40 },
                { type: "output" as const, text: "✓ Remove something — cancel this subscription", delay: 20 },
                { type: "comment" as const, text: "", delay: 40 },
                { type: "comment" as const, text: "# A real orchestration workflow", delay: 30 },
                { type: "command" as const, text: "POST /v1/messages  →  analyze customer email sentiment", delay: 40 },
                { type: "command" as const, text: "GET  /v1/orders     →  look up their order history", delay: 30 },
                { type: "command" as const, text: "POST /v1/messages  →  draft a personalized response", delay: 30 },
                { type: "output" as const, text: "✓ Three API calls, one workflow — that is orchestration", delay: 25 },
              ],
            },
          ],
        }}
      />
      <Composition
        id="M8L2-Code1"
        component={ModuleVideo}
        durationInFrames={856}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 856,
              voiceoverUrl: staticFile("Module 8/Lesson 2/voiceover-code1.mp3"),
              lines: [
                { type: "comment" as const, text: "# API Key — your identity badge" },
                { type: "output" as const, text: "sk-ant-api03-m5Aw8BK536h...LFx5nwAA", delay: 30 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "comment" as const, text: "# Include it in every request header" },
                { type: "command" as const, text: "curl https://api.anthropic.com/v1/messages", delay: 30 },
                { type: "output" as const, text: "  -H \"x-api-key: $ANTHROPIC_API_KEY\"", delay: 20 },
                { type: "output" as const, text: "  -H \"content-type: application/json\"", delay: 15 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "comment" as const, text: "# The key tells the API:" },
                { type: "output" as const, text: "✓ Who you are — which account", delay: 25 },
                { type: "output" as const, text: "✓ What you can do — your permissions", delay: 20 },
                { type: "output" as const, text: "✓ Who to bill — usage tied to your account", delay: 20 },
              ],
            },
          ],
        }}
      />
      <Composition
        id="M8L2-Code2"
        component={ModuleVideo}
        durationInFrames={1337}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1337,
              voiceoverUrl: staticFile("Module 8/Lesson 2/voiceover-code2.mp3"),
              lines: [
                { type: "comment" as const, text: "# Environment variables — the safe way" },
                { type: "command" as const, text: "export ANTHROPIC_API_KEY=\"sk-ant-api03-...\"", delay: 30 },
                { type: "comment" as const, text: "", delay: 15 },
                { type: "comment" as const, text: "# In your code, read from environment" },
                { type: "command" as const, text: "api_key = os.environ[\"ANTHROPIC_API_KEY\"]", delay: 30 },
                { type: "output" as const, text: "✓ Key stays on your machine, never in code", delay: 25 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "comment" as const, text: "# .env file — all keys in one place" },
                { type: "output" as const, text: "ANTHROPIC_API_KEY=sk-ant-api03-...", delay: 25 },
                { type: "output" as const, text: "OPENAI_API_KEY=sk-proj-abc789...", delay: 15 },
                { type: "output" as const, text: "STRIPE_SECRET_KEY=sk_test_...", delay: 15 },
                { type: "output" as const, text: "✓ Added to .gitignore — never uploaded", delay: 20 },
                { type: "comment" as const, text: "", delay: 25 },
                { type: "comment" as const, text: "# Common error codes" },
                { type: "output" as const, text: "401 Unauthorized  → key is wrong or missing", delay: 30 },
                { type: "output" as const, text: "403 Forbidden     → valid key, no permission", delay: 20 },
                { type: "output" as const, text: "429 Too Many      → slow down, rate limited", delay: 20 },
              ],
            },
          ],
        }}
      />
      <Composition
        id="M8L3-Code1"
        component={ModuleVideo}
        durationInFrames={1286}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1286,
              voiceoverUrl: staticFile("Module 8/Lesson 3/voiceover-code1.mp3"),
              lines: [
                { type: "comment" as const, text: "# Your first API call to Claude" },
                { type: "command" as const, text: "curl https://api.anthropic.com/v1/messages \\", delay: 30 },
                { type: "output" as const, text: "  -H \"x-api-key: $ANTHROPIC_API_KEY\" \\", delay: 15 },
                { type: "output" as const, text: "  -H \"content-type: application/json\" \\", delay: 10 },
                { type: "output" as const, text: "  -H \"anthropic-version: 2023-06-01\" \\", delay: 10 },
                { type: "output" as const, text: "  -d '{", delay: 10 },
                { type: "output" as const, text: "    \"model\": \"claude-sonnet-4-20250514\",", delay: 10 },
                { type: "output" as const, text: "    \"max_tokens\": 256,", delay: 10 },
                { type: "output" as const, text: "    \"messages\": [{", delay: 10 },
                { type: "output" as const, text: "      \"role\": \"user\",", delay: 10 },
                { type: "output" as const, text: "      \"content\": \"What is an AI Orchestrator?\"", delay: 10 },
                { type: "output" as const, text: "    }]", delay: 10 },
                { type: "output" as const, text: "  }'", delay: 15 },
                { type: "comment" as const, text: "", delay: 30 },
                { type: "output" as const, text: "✓ 200 OK", delay: 25 },
                { type: "output" as const, text: "{", delay: 15 },
                { type: "output" as const, text: "  \"content\": [{", delay: 10 },
                { type: "output" as const, text: "    \"text\": \"An AI Orchestrator designs,", delay: 10 },
                { type: "output" as const, text: "     coordinates, and manages multiple AI", delay: 10 },
                { type: "output" as const, text: "     systems to work together toward a", delay: 10 },
                { type: "output" as const, text: "     common business goal.\"", delay: 10 },
                { type: "output" as const, text: "  }],", delay: 10 },
                { type: "output" as const, text: "  \"model\": \"claude-sonnet-4-20250514\",", delay: 10 },
                { type: "output" as const, text: "  \"usage\": {", delay: 10 },
                { type: "output" as const, text: "    \"input_tokens\": 18,", delay: 10 },
                { type: "output" as const, text: "    \"output_tokens\": 31  ← billed", delay: 10 },
                { type: "output" as const, text: "  }", delay: 10 },
                { type: "output" as const, text: "}", delay: 15 },
              ],
            },
          ],
        }}
      />
      <Composition
        id="M8L3-Code2"
        component={ModuleVideo}
        durationInFrames={1318}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1318,
              voiceoverUrl: staticFile("Module 8/Lesson 3/voiceover-code2.mp3"),
              lines: [
                { type: "comment" as const, text: "# Experiment — change the question" },
                { type: "command" as const, text: "\"content\": \"Explain quantum computing simply\"", delay: 25 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "comment" as const, text: "# Experiment — try a different model" },
                { type: "command" as const, text: "\"model\": \"claude-haiku-4-5-20251001\"  ← faster, cheaper", delay: 30 },
                { type: "command" as const, text: "\"model\": \"claude-opus-4-20250514\"     ← most capable", delay: 25 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "comment" as const, text: "# Experiment — longer response" },
                { type: "command" as const, text: "\"max_tokens\": 1000", delay: 25 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "comment" as const, text: "# Experiment — add a system prompt" },
                { type: "command" as const, text: "\"system\": \"You are a helpful cooking assistant\"", delay: 30 },
                { type: "comment" as const, text: "", delay: 30 },
                { type: "comment" as const, text: "# Common errors" },
                { type: "output" as const, text: "401 Unauthorized     → API key is wrong", delay: 30 },
                { type: "output" as const, text: "invalid_api_key      → extra spaces or line breaks", delay: 20 },
                { type: "output" as const, text: "model_not_found      → check for typos", delay: 20 },
                { type: "output" as const, text: "command not found     → use Mac/Linux terminal", delay: 20 },
              ],
            },
          ],
        }}
      />
      {/* ── M9L1: The OpenAI API ── */}
      <Composition
        id="M9L1-Code1"
        component={ModuleVideo}
        durationInFrames={1636}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1636,
              voiceoverUrl: staticFile("Module 9/Lesson 1/voiceover-code1.mp3"),
              lines: [
                { type: "comment" as const, text: "# OpenAI Chat Completions endpoint" },
                { type: "command" as const, text: "curl https://api.openai.com/v1/chat/completions", delay: 30 },
                { type: "output" as const, text: "  -H \"Authorization: Bearer $OPENAI_API_KEY\"", delay: 20 },
                { type: "output" as const, text: "  -H \"Content-Type: application/json\"", delay: 10 },
                { type: "output" as const, text: "  -d '{", delay: 15 },
                { type: "output" as const, text: "    \"model\": \"gpt-4o\",", delay: 10 },
                { type: "output" as const, text: "    \"messages\": [", delay: 10 },
                { type: "output" as const, text: "      {\"role\": \"system\", \"content\": \"You are a helpful assistant.\"},", delay: 10 },
                { type: "output" as const, text: "      {\"role\": \"user\", \"content\": \"Explain quantum computing.\"}",  delay: 10 },
                { type: "output" as const, text: "    ],", delay: 10 },
                { type: "output" as const, text: "    \"temperature\": 0.3,", delay: 15 },
                { type: "output" as const, text: "    \"max_tokens\": 1024", delay: 10 },
                { type: "output" as const, text: "  }'", delay: 15 },
                { type: "comment" as const, text: "", delay: 30 },
                { type: "comment" as const, text: "# Key parameters" },
                { type: "output" as const, text: "temperature: 0    → deterministic, same answer every time", delay: 25 },
                { type: "output" as const, text: "temperature: 0.7  → some variety, good for content", delay: 20 },
                { type: "output" as const, text: "temperature: 1.0  → creative, unpredictable", delay: 20 },
                { type: "output" as const, text: "max_tokens: 1024  → caps response length (saves cost)", delay: 20 },
                { type: "output" as const, text: "stream: true      → tokens flow back in real time", delay: 20 },
              ],
            },
          ],
        }}
      />
      <Composition
        id="M9L1-Code2"
        component={ModuleVideo}
        durationInFrames={1931}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1931,
              voiceoverUrl: staticFile("Module 9/Lesson 1/voiceover-code2.mp3"),
              lines: [
                { type: "comment" as const, text: "# Model routing strategy" },
                { type: "output" as const, text: "┌─────────────────────────────────────────────┐", delay: 20 },
                { type: "output" as const, text: "│  Tier 1 — gpt-4o-mini (60-70% of calls)    │", delay: 25 },
                { type: "output" as const, text: "│  Classification, intent, yes/no, routing    │", delay: 20 },
                { type: "output" as const, text: "├─────────────────────────────────────────────┤", delay: 15 },
                { type: "output" as const, text: "│  Tier 2 — gpt-4o (25-30% of calls)         │", delay: 25 },
                { type: "output" as const, text: "│  Content generation, analysis, summaries    │", delay: 20 },
                { type: "output" as const, text: "├─────────────────────────────────────────────┤", delay: 15 },
                { type: "output" as const, text: "│  Tier 3 — gpt-4o (5% of calls)             │", delay: 25 },
                { type: "output" as const, text: "│  Complex reasoning, critical decisions      │", delay: 20 },
                { type: "output" as const, text: "└─────────────────────────────────────────────┘", delay: 15 },
                { type: "comment" as const, text: "", delay: 30 },
                { type: "comment" as const, text: "# Function calling — connect AI to real actions" },
                { type: "output" as const, text: "tools: [", delay: 20 },
                { type: "output" as const, text: "  { name: \"lookup_order\",", delay: 15 },
                { type: "output" as const, text: "    description: \"Get customer order history\",", delay: 10 },
                { type: "output" as const, text: "    parameters: { customer_id: \"string\" } },", delay: 10 },
                { type: "output" as const, text: "  { name: \"send_email\",", delay: 15 },
                { type: "output" as const, text: "    description: \"Send email to customer\",", delay: 10 },
                { type: "output" as const, text: "    parameters: { to: \"string\", body: \"string\" } }", delay: 10 },
                { type: "output" as const, text: "]", delay: 15 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "output" as const, text: "✓ AI decides which tool to call", delay: 25 },
                { type: "output" as const, text: "✓ Returns structured request for you to execute", delay: 20 },
                { type: "output" as const, text: "✓ 5-10x cost savings with tiered routing", delay: 20 },
              ],
            },
          ],
        }}
      />

      {/* ── M9L2: The Anthropic API ── */}
      <Composition
        id="M9L2-Code1"
        component={ModuleVideo}
        durationInFrames={1679}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1679,
              voiceoverUrl: staticFile("Module 9/Lesson 2/voiceover-code1.mp3"),
              lines: [
                { type: "comment" as const, text: "# Anthropic Messages endpoint" },
                { type: "command" as const, text: "curl https://api.anthropic.com/v1/messages", delay: 30 },
                { type: "output" as const, text: "  -H \"x-api-key: $ANTHROPIC_API_KEY\"", delay: 20 },
                { type: "output" as const, text: "  -H \"anthropic-version: 2023-06-01\"", delay: 10 },
                { type: "output" as const, text: "  -H \"content-type: application/json\"", delay: 10 },
                { type: "output" as const, text: "  -d '{", delay: 15 },
                { type: "output" as const, text: "    \"model\": \"claude-sonnet-4-20250514\",", delay: 10 },
                { type: "output" as const, text: "    \"max_tokens\": 1024,", delay: 10 },
                { type: "output" as const, text: "    \"system\": \"You are a senior financial analyst.\",", delay: 15 },
                { type: "output" as const, text: "    \"messages\": [{", delay: 10 },
                { type: "output" as const, text: "      \"role\": \"user\",", delay: 10 },
                { type: "output" as const, text: "      \"content\": \"Analyze Q3 revenue trends.\"", delay: 10 },
                { type: "output" as const, text: "    }]", delay: 10 },
                { type: "output" as const, text: "  }'", delay: 15 },
                { type: "comment" as const, text: "", delay: 30 },
                { type: "comment" as const, text: "# Key difference: system prompt is top-level, not in messages" },
                { type: "comment" as const, text: "# Claude model tiers" },
                { type: "output" as const, text: "Opus    → most capable, complex reasoning", delay: 25 },
                { type: "output" as const, text: "Sonnet  → balanced, production workhorse", delay: 20 },
                { type: "output" as const, text: "Haiku   → fastest, cheapest, classification", delay: 20 },
                { type: "comment" as const, text: "", delay: 15 },
                { type: "output" as const, text: "Context window: 200,000 tokens", delay: 25 },
                { type: "output" as const, text: "✓ Entire documents in one request", delay: 20 },
              ],
            },
          ],
        }}
      />
      <Composition
        id="M9L2-Code2"
        component={ModuleVideo}
        durationInFrames={1763}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1763,
              voiceoverUrl: staticFile("Module 9/Lesson 2/voiceover-code2.mp3"),
              lines: [
                { type: "comment" as const, text: "# Claude tool use" },
                { type: "output" as const, text: "tools: [{", delay: 20 },
                { type: "output" as const, text: "  name: \"get_weather\",", delay: 15 },
                { type: "output" as const, text: "  description: \"Get current weather for a location\",", delay: 10 },
                { type: "output" as const, text: "  input_schema: {", delay: 10 },
                { type: "output" as const, text: "    type: \"object\",", delay: 10 },
                { type: "output" as const, text: "    properties: { location: { type: \"string\" } },", delay: 10 },
                { type: "output" as const, text: "    required: [\"location\"]", delay: 10 },
                { type: "output" as const, text: "  }", delay: 10 },
                { type: "output" as const, text: "}]", delay: 15 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "comment" as const, text: "# Claude returns → tool_use content block" },
                { type: "comment" as const, text: "# Your code executes → sends tool_result back" },
                { type: "comment" as const, text: "# Claude continues → with the real data" },
                { type: "comment" as const, text: "", delay: 25 },
                { type: "comment" as const, text: "# Common API errors" },
                { type: "output" as const, text: "400 → malformed request, check JSON structure", delay: 25 },
                { type: "output" as const, text: "401 → invalid API key or missing version header", delay: 20 },
                { type: "output" as const, text: "429 → rate limited, use exponential backoff", delay: 20 },
                { type: "output" as const, text: "529 → API overloaded, same retry logic", delay: 20 },
                { type: "comment" as const, text: "", delay: 15 },
                { type: "output" as const, text: "⚠ Always set max_tokens explicitly", delay: 25 },
                { type: "output" as const, text: "  1024-2048 tokens is enough for most tasks", delay: 20 },
              ],
            },
          ],
        }}
      />

      {/* ── M9L3: Comparing AI APIs ── */}
      <Composition
        id="M9L3-Code1"
        component={ModuleVideo}
        durationInFrames={1631}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1631,
              voiceoverUrl: staticFile("Module 9/Lesson 3/voiceover-code1.mp3"),
              lines: [
                { type: "comment" as const, text: "# Provider comparison" },
                { type: "output" as const, text: "┌──────────────┬──────────────┬──────────────┐", delay: 20 },
                { type: "output" as const, text: "│              │  OpenAI      │  Anthropic   │", delay: 15 },
                { type: "output" as const, text: "├──────────────┼──────────────┼──────────────┤", delay: 10 },
                { type: "output" as const, text: "│ Reasoning    │ gpt-4o       │ claude opus  │", delay: 25 },
                { type: "output" as const, text: "│ Balanced     │ gpt-4o       │ claude sonnet│", delay: 20 },
                { type: "output" as const, text: "│ Fast/cheap   │ gpt-4o-mini  │ claude haiku │", delay: 20 },
                { type: "output" as const, text: "├──────────────┼──────────────┼──────────────┤", delay: 10 },
                { type: "output" as const, text: "│ Context      │ 128K tokens  │ 200K tokens  │", delay: 25 },
                { type: "output" as const, text: "│ Multimodal   │ text+img+aud │ text+images  │", delay: 20 },
                { type: "output" as const, text: "│ Instructions │ good         │ precise      │", delay: 20 },
                { type: "output" as const, text: "│ Speed (fast) │ ~0.8s        │ ~0.6s        │", delay: 20 },
                { type: "output" as const, text: "└──────────────┴──────────────┴──────────────┘", delay: 15 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "output" as const, text: "Google Gemini: text + images + audio + video", delay: 25 },
                { type: "output" as const, text: "→ Most versatile for multimodal workflows", delay: 20 },
              ],
            },
          ],
        }}
      />
      <Composition
        id="M9L3-Code2"
        component={ModuleVideo}
        durationInFrames={1952}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1952,
              voiceoverUrl: staticFile("Module 9/Lesson 3/voiceover-code2.mp3"),
              lines: [
                { type: "comment" as const, text: "# Three-tier model routing strategy" },
                { type: "output" as const, text: "", delay: 10 },
                { type: "output" as const, text: "TIER 1 — Fast & Cheap  (60-70% of calls)", delay: 30 },
                { type: "output" as const, text: "  claude haiku  /  gpt-4o-mini", delay: 15 },
                { type: "output" as const, text: "  → classification, intent, routing, yes/no", delay: 20 },
                { type: "output" as const, text: "", delay: 15 },
                { type: "output" as const, text: "TIER 2 — Balanced  (25-30% of calls)", delay: 30 },
                { type: "output" as const, text: "  claude sonnet  /  gpt-4o", delay: 15 },
                { type: "output" as const, text: "  → content, analysis, summarization", delay: 20 },
                { type: "output" as const, text: "", delay: 15 },
                { type: "output" as const, text: "TIER 3 — Maximum  (5% of calls)", delay: 30 },
                { type: "output" as const, text: "  claude opus", delay: 15 },
                { type: "output" as const, text: "  → complex reasoning, critical decisions", delay: 20 },
                { type: "comment" as const, text: "", delay: 25 },
                { type: "output" as const, text: "Result: 5-10x cost reduction", delay: 30 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "comment" as const, text: "# Rate limit handling" },
                { type: "output" as const, text: "429 error → exponential backoff", delay: 25 },
                { type: "output" as const, text: "  wait 1s → 2s → 4s → 8s", delay: 20 },
                { type: "output" as const, text: "Provider A rate limited → fallback to Provider B", delay: 25 },
                { type: "output" as const, text: "✓ Request queuing for sustained throughput", delay: 20 },
              ],
            },
          ],
        }}
      />
      {/* ── M10L1: What is MCP? ── */}
      <Composition
        id="M10L1-Code1"
        component={ModuleVideo}
        durationInFrames={1664}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1664,
              voiceoverUrl: staticFile("Module 10/Lesson 1/voiceover-code1.mp3"),
              lines: [
                { type: "comment" as const, text: "# The problem MCP solves" },
                { type: "output" as const, text: "Before MCP:", delay: 20 },
                { type: "output" as const, text: "  5 AI apps × 10 tools = 50 custom integrations", delay: 30 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "output" as const, text: "With MCP:", delay: 20 },
                { type: "output" as const, text: "  5 clients + 10 servers = 15 implementations", delay: 30 },
                { type: "comment" as const, text: "", delay: 25 },
                { type: "comment" as const, text: "# How MCP works" },
                { type: "output" as const, text: "1. MCP Server wraps a tool (database, API, filesystem)", delay: 25 },
                { type: "output" as const, text: "   → exposes capabilities through standard protocol", delay: 20 },
                { type: "output" as const, text: "2. MCP Client (in Claude Code) connects to servers", delay: 25 },
                { type: "output" as const, text: "   → discovers available tools automatically", delay: 20 },
                { type: "output" as const, text: "3. AI model sees tools and uses them in conversations", delay: 25 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "command" as const, text: "claude mcp add supabase -- npx -y @supabase/mcp-server", delay: 30 },
                { type: "output" as const, text: "✓ Claude can now query your database", delay: 25 },
                { type: "output" as const, text: "✓ Run migrations via natural language", delay: 20 },
                { type: "output" as const, text: "✓ Manage your project directly", delay: 20 },
              ],
            },
          ],
        }}
      />
      <Composition
        id="M10L1-Code2"
        component={ModuleVideo}
        durationInFrames={1814}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1814,
              voiceoverUrl: staticFile("Module 10/Lesson 1/voiceover-code2.mp3"),
              lines: [
                { type: "comment" as const, text: "# MCP ecosystem — available servers" },
                { type: "output" as const, text: "Databases:    Supabase, PostgreSQL, SQLite", delay: 25 },
                { type: "output" as const, text: "Version ctrl: GitHub, GitLab", delay: 20 },
                { type: "output" as const, text: "Cloud:        AWS, Google Cloud", delay: 20 },
                { type: "output" as const, text: "Comms:        Slack, email", delay: 20 },
                { type: "output" as const, text: "Files:        local filesystem, Google Drive", delay: 20 },
                { type: "output" as const, text: "Web:          browser automation, search, scraping", delay: 20 },
                { type: "output" as const, text: "Dev tools:    Docker, Kubernetes, CI/CD", delay: 20 },
                { type: "comment" as const, text: "", delay: 25 },
                { type: "comment" as const, text: "# MCP vs direct API integration" },
                { type: "output" as const, text: "Direct API:", delay: 20 },
                { type: "output" as const, text: "  → learn each API's auth, endpoints, format, errors", delay: 20 },
                { type: "output" as const, text: "  → custom code for every integration", delay: 15 },
                { type: "comment" as const, text: "", delay: 15 },
                { type: "output" as const, text: "MCP:", delay: 20 },
                { type: "output" as const, text: "  → server handles all complexity", delay: 20 },
                { type: "output" as const, text: "  → AI uses consistent interface regardless of backend", delay: 20 },
                { type: "output" as const, text: "  → like USB for AI — one protocol, every tool", delay: 25 },
              ],
            },
          ],
        }}
      />

      {/* ── M10L2: MCP Architecture ── */}
      <Composition
        id="M10L2-Code1"
        component={ModuleVideo}
        durationInFrames={1602}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1602,
              voiceoverUrl: staticFile("Module 10/Lesson 2/voiceover-code1.mp3"),
              lines: [
                { type: "comment" as const, text: "# MCP three-layer architecture" },
                { type: "output" as const, text: "", delay: 10 },
                { type: "output" as const, text: "┌─────────────────────────────────┐", delay: 15 },
                { type: "output" as const, text: "│  HOST (Claude Code / Desktop)   │", delay: 25 },
                { type: "output" as const, text: "│  → manages user experience      │", delay: 20 },
                { type: "output" as const, text: "│  → coordinates communication    │", delay: 15 },
                { type: "output" as const, text: "│                                 │", delay: 10 },
                { type: "output" as const, text: "│  ┌─────────┐ ┌─────────┐       │", delay: 15 },
                { type: "output" as const, text: "│  │ CLIENT 1│ │ CLIENT 2│  ...  │", delay: 20 },
                { type: "output" as const, text: "│  └────┬────┘ └────┬────┘       │", delay: 15 },
                { type: "output" as const, text: "└───────┼──────────┼─────────────┘", delay: 10 },
                { type: "output" as const, text: "        │          │", delay: 10 },
                { type: "output" as const, text: "   ┌────┴────┐ ┌──┴──────┐", delay: 15 },
                { type: "output" as const, text: "   │ SERVER  │ │ SERVER  │", delay: 20 },
                { type: "output" as const, text: "   │Supabase │ │ GitHub  │", delay: 20 },
                { type: "output" as const, text: "   └─────────┘ └─────────┘", delay: 15 },
                { type: "comment" as const, text: "", delay: 15 },
                { type: "output" as const, text: "Each client ↔ one server (1:1)", delay: 25 },
                { type: "output" as const, text: "Host can have multiple clients simultaneously", delay: 20 },
              ],
            },
          ],
        }}
      />
      <Composition
        id="M10L2-Code2"
        component={ModuleVideo}
        durationInFrames={1739}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1739,
              voiceoverUrl: staticFile("Module 10/Lesson 2/voiceover-code2.mp3"),
              lines: [
                { type: "comment" as const, text: "# Transport: stdio (local)" },
                { type: "output" as const, text: "{", delay: 15 },
                { type: "output" as const, text: "  \"mcpServers\": {", delay: 10 },
                { type: "output" as const, text: "    \"filesystem\": {", delay: 10 },
                { type: "output" as const, text: "      \"command\": \"npx\",", delay: 10 },
                { type: "output" as const, text: "      \"args\": [\"-y\", \"@modelcontextprotocol/server-filesystem\"]", delay: 10 },
                { type: "output" as const, text: "    }", delay: 10 },
                { type: "output" as const, text: "  }", delay: 10 },
                { type: "output" as const, text: "}", delay: 15 },
                { type: "comment" as const, text: "→ Server runs as local process, communicates via stdin/stdout", delay: 20 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "comment" as const, text: "# Transport: HTTP + SSE (remote)" },
                { type: "output" as const, text: "→ Server runs on remote machine or cloud", delay: 20 },
                { type: "output" as const, text: "→ Uses Server-Sent Events for streaming", delay: 20 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "comment" as const, text: "# Connection lifecycle" },
                { type: "output" as const, text: "1. Initialize  → exchange protocol version", delay: 25 },
                { type: "output" as const, text: "2. Negotiate   → server declares capabilities", delay: 20 },
                { type: "output" as const, text: "3. Operate     → AI discovers and uses tools", delay: 20 },
                { type: "output" as const, text: "4. Shutdown    → clean disconnect", delay: 20 },
              ],
            },
          ],
        }}
      />

      {/* ── M10L3: MCP Capabilities ── */}
      <Composition
        id="M10L3-Code1"
        component={ModuleVideo}
        durationInFrames={1701}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 1701,
              voiceoverUrl: staticFile("Module 10/Lesson 3/voiceover-code1.mp3"),
              lines: [
                { type: "comment" as const, text: "# MCP capability: Resources (read-only data)" },
                { type: "output" as const, text: "{", delay: 15 },
                { type: "output" as const, text: "  uri: \"supabase://tables/customers\",", delay: 15 },
                { type: "output" as const, text: "  name: \"Customer table\",", delay: 10 },
                { type: "output" as const, text: "  mimeType: \"application/json\"", delay: 10 },
                { type: "output" as const, text: "}", delay: 10 },
                { type: "output" as const, text: "→ database tables, config files, API docs, profiles", delay: 25 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "comment" as const, text: "# MCP capability: Tools (actions)" },
                { type: "output" as const, text: "{", delay: 15 },
                { type: "output" as const, text: "  name: \"execute_sql\",", delay: 15 },
                { type: "output" as const, text: "  description: \"Execute a SQL query against the database\",", delay: 10 },
                { type: "output" as const, text: "  inputSchema: {", delay: 10 },
                { type: "output" as const, text: "    properties: { query: { type: \"string\" } },", delay: 10 },
                { type: "output" as const, text: "    required: [\"query\"]", delay: 10 },
                { type: "output" as const, text: "  }", delay: 10 },
                { type: "output" as const, text: "}", delay: 10 },
                { type: "output" as const, text: "→ SQL queries, GitHub issues, Slack messages, deploys", delay: 25 },
              ],
            },
          ],
        }}
      />
      <Composition
        id="M10L3-Code2"
        component={ModuleVideo}
        durationInFrames={2123}
        fps={25}
        width={1920}
        height={1080}
        defaultProps={{
          segments: [
            {
              type: "code-screen" as const,
              durationInFrames: 2123,
              voiceoverUrl: staticFile("Module 10/Lesson 3/voiceover-code2.mp3"),
              lines: [
                { type: "comment" as const, text: "# MCP capability: Prompts (reusable templates)" },
                { type: "output" as const, text: "Database server prompts:", delay: 20 },
                { type: "output" as const, text: "  → \"Analyze this table's schema\"", delay: 20 },
                { type: "output" as const, text: "  → \"Generate a migration for adding a column\"", delay: 20 },
                { type: "output" as const, text: "  → \"Explain this query's performance\"", delay: 20 },
                { type: "output" as const, text: "→ Pre-built prompt engineering for specific domains", delay: 25 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "comment" as const, text: "# MCP capability: Sampling (AI feedback loop)" },
                { type: "output" as const, text: "Code review server:", delay: 20 },
                { type: "output" as const, text: "  1. Read pull request       (tool/resource)", delay: 25 },
                { type: "output" as const, text: "  2. Ask AI to analyze code  (sampling)", delay: 20 },
                { type: "output" as const, text: "  3. Format review comment   (tool)", delay: 20 },
                { type: "output" as const, text: "→ Requires explicit user consent", delay: 20 },
                { type: "comment" as const, text: "", delay: 20 },
                { type: "comment" as const, text: "# Capability discovery" },
                { type: "output" as const, text: "Client connects → server declares capabilities", delay: 25 },
                { type: "output" as const, text: "AI model discovers tools dynamically", delay: 20 },
                { type: "output" as const, text: "→ Connect to any server without knowing what it offers", delay: 25 },
                { type: "output" as const, text: "→ Composable: mix and match servers freely", delay: 20 },
              ],
            },
          ],
        }}
      />
    </>
  );
};

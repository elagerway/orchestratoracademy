import React from "react";
import { Composition } from "remotion";
import { ModuleVideo, type ModuleVideoProps } from "./compositions/ModuleVideo";

export const Root: React.FC = () => {
  const defaultProps: ModuleVideoProps = {
    segments: [
      {
        type: "talking-head",
        durationInFrames: 900, // 30 seconds
        src: "https://placeholder.heygen.com/intro.mp4",
      },
      {
        type: "code-screen",
        durationInFrames: 2700, // 90 seconds
        lines: [
          { type: "command", text: "pip install anthropic" },
          { type: "output", text: "Successfully installed anthropic-0.40.0" },
          { type: "command", text: "python" },
          { type: "command", text: "from anthropic import Anthropic" },
          { type: "command", text: 'client = Anthropic(api_key="sk-...")' },
          { type: "comment", text: "# Send a message to Claude" },
          {
            type: "command",
            text: 'message = client.messages.create(\n    model="claude-sonnet-4-20250514",\n    max_tokens=1024,\n    messages=[{"role": "user", "content": "Hello, Claude!"}]\n)',
          },
          { type: "command", text: "print(message.content[0].text)" },
          {
            type: "output",
            text: "Hello! How can I help you today?",
          },
        ],
        voiceoverUrl: undefined,
      },
      {
        type: "talking-head",
        durationInFrames: 450, // 15 seconds
        src: "https://placeholder.heygen.com/transition.mp4",
      },
      {
        type: "code-screen",
        durationInFrames: 1800, // 60 seconds
        lines: [
          { type: "comment", text: "# Building a simple orchestrator" },
          {
            type: "command",
            text: 'def orchestrate(task: str) -> str:\n    """Route tasks to the right tool."""\n    if "search" in task:\n        return search_web(task)\n    elif "code" in task:\n        return generate_code(task)\n    else:\n        return ask_claude(task)',
          },
          { type: "command", text: 'result = orchestrate("search for Python tutorials")' },
          { type: "output", text: "Searching the web for: Python tutorials..." },
          { type: "output", text: "Found 5 results. Here are the top picks:" },
        ],
        voiceoverUrl: undefined,
      },
      {
        type: "talking-head",
        durationInFrames: 600, // 20 seconds
        src: "https://placeholder.heygen.com/outro.mp4",
      },
    ],
    transitionDurationInFrames: 15,
  };

  const totalDuration = defaultProps.segments.reduce(
    (sum, s) => sum + s.durationInFrames,
    0
  );

  return (
    <>
      <Composition
        id="ModuleVideo"
        component={ModuleVideo}
        durationInFrames={totalDuration}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />
      <Composition
        id="ModuleVideoFull"
        component={ModuleVideo}
        durationInFrames={9000}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />
    </>
  );
};

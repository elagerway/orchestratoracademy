-- Seed: Assessment Questions for All 4 Courses
-- Run after seed.sql and seed_premium_courses.sql

-- ============================================================================
-- ASSESSMENT 1: AI Orchestration Foundations
-- ============================================================================

insert into public.assessments (course_id, title, description, questions, passing_score, time_limit_minutes)
values (
  (select id from public.courses where slug = 'ai-orchestration-foundations'),
  'AI Orchestration Foundations Certification Exam',
  'Test your understanding of AI orchestration fundamentals, the orchestrator role, AI models, prompt engineering, workflow design, and ethics.',
  '[
    {
      "id": "q1",
      "question": "What is the primary role of an AI Orchestrator?",
      "options": [
        "Writing code for machine learning models from scratch",
        "Designing, coordinating, and managing multiple AI systems to work together toward a common goal",
        "Replacing all human workers with AI agents",
        "Selling AI software licenses to enterprise clients"
      ],
      "correct": 1
    },
    {
      "id": "q2",
      "question": "In the RACE framework for prompt engineering, what does the ''C'' stand for?",
      "options": [
        "Command",
        "Clarity",
        "Context",
        "Constraint"
      ],
      "correct": 2
    },
    {
      "id": "q3",
      "question": "Why do modern AI applications use multi-model architectures instead of a single model?",
      "options": [
        "Using multiple models is always cheaper than using one model",
        "No single AI model does everything well, so specialized models are combined for different tasks",
        "Regulations require companies to use at least three different AI providers",
        "A single model cannot process more than 100 words at a time"
      ],
      "correct": 1
    },
    {
      "id": "q4",
      "question": "Which of the following is a key ethical principle for AI Orchestrators?",
      "options": [
        "AI systems should always be disguised as human to improve engagement",
        "Users should know when they are interacting with AI (transparency)",
        "Sensitive personal data should be shared with all AI providers for best results",
        "Human oversight slows down workflows and should be eliminated"
      ],
      "correct": 1
    },
    {
      "id": "q5",
      "question": "What does the ''Temperature'' parameter control when configuring an AI model?",
      "options": [
        "The speed at which the model generates tokens",
        "The maximum length of the response",
        "The randomness and creativity of the output",
        "The cost per API call"
      ],
      "correct": 2
    },
    {
      "id": "q6",
      "question": "When designing an AI workflow, what is the recommended first step?",
      "options": [
        "Choose the most expensive AI model available",
        "Start with the desired business outcome and work backwards",
        "Build all steps at once and test the complete system",
        "Skip planning and iterate quickly in production"
      ],
      "correct": 1
    },
    {
      "id": "q7",
      "question": "Which factor is NOT typically considered when an orchestrator selects an AI model for a task?",
      "options": [
        "The capability required for the task",
        "Cost per token or API call",
        "The model creator''s stock price",
        "Data privacy and handling requirements"
      ],
      "correct": 2
    },
    {
      "id": "q8",
      "question": "What is ''chain-of-thought prompting''?",
      "options": [
        "Linking multiple AI models together in a pipeline",
        "Asking the AI to think step by step before giving a final answer",
        "Sending the same prompt to multiple models and comparing outputs",
        "Writing prompts that contain exactly five sentences"
      ],
      "correct": 1
    },
    {
      "id": "q9",
      "question": "What is the purpose of building ''human-in-the-loop'' checkpoints in an AI workflow?",
      "options": [
        "To slow down the workflow so it costs less per run",
        "To ensure high-stakes decisions receive human review before proceeding",
        "To collect personal data from users at each step",
        "To satisfy a technical requirement of all AI frameworks"
      ],
      "correct": 1
    },
    {
      "id": "q10",
      "question": "Which orchestration framework is best suited for building multi-agent teams that collaborate like human teams?",
      "options": [
        "LangChain",
        "Magpipe",
        "CrewAI",
        "Docker"
      ],
      "correct": 2
    }
  ]'::jsonb,
  70,
  30
);


-- ============================================================================
-- ASSESSMENT 2: CrewAI Mastery
-- ============================================================================

insert into public.assessments (course_id, title, description, questions, passing_score, time_limit_minutes)
values (
  (select id from public.courses where slug = 'crewai-mastery'),
  'CrewAI Mastery Certification Exam',
  'Test your mastery of multi-agent systems, CrewAI architecture, tool integration, crew patterns, and production best practices.',
  '[
    {
      "id": "q1",
      "question": "In CrewAI, what are the three core building blocks of every multi-agent system?",
      "options": [
        "Models, Prompts, and Outputs",
        "Agents, Tasks, and Crews",
        "Nodes, Edges, and State",
        "Inputs, Processors, and Outputs"
      ],
      "correct": 1
    },
    {
      "id": "q2",
      "question": "What is the purpose of an agent''s ''backstory'' in CrewAI?",
      "options": [
        "It is a required legal disclaimer for AI systems",
        "It sets the agent''s API key and model configuration",
        "It provides context and personality that primes the language model to produce consistent, role-appropriate output",
        "It defines which other agents the agent can communicate with"
      ],
      "correct": 2
    },
    {
      "id": "q3",
      "question": "What is the key difference between sequential and hierarchical crew processes?",
      "options": [
        "Sequential crews use AI models while hierarchical crews use rule-based systems",
        "In sequential, tasks run in a fixed order you define; in hierarchical, a manager agent dynamically delegates and coordinates tasks",
        "Sequential crews can only have two agents while hierarchical crews can have unlimited agents",
        "There is no practical difference; they produce identical results"
      ],
      "correct": 1
    },
    {
      "id": "q4",
      "question": "When building a custom tool in CrewAI, which class must your tool extend?",
      "options": [
        "ToolWrapper",
        "CrewTool",
        "BaseTool",
        "AgentTool"
      ],
      "correct": 2
    },
    {
      "id": "q5",
      "question": "What does the ''context'' parameter on a CrewAI Task do?",
      "options": [
        "Sets the system prompt for the agent executing the task",
        "References other tasks whose output should be passed as input to this task",
        "Defines the maximum number of retries for the task",
        "Specifies which LLM model to use for this task only"
      ],
      "correct": 1
    },
    {
      "id": "q6",
      "question": "Why is it an anti-pattern to give a CrewAI agent too many tools?",
      "options": [
        "CrewAI has a hard limit of 3 tools per agent",
        "More tools increases the decisions the agent must make, raising the chance of confusion and incorrect tool selection",
        "Each tool adds 10 seconds of latency to every task",
        "Tools from different categories will conflict and cause runtime errors"
      ],
      "correct": 1
    },
    {
      "id": "q7",
      "question": "In CrewAI, what happens when a task encounters an error during execution?",
      "options": [
        "The entire crew immediately terminates with no output",
        "The error is silently ignored and the next task begins",
        "CrewAI retries the task, passing error context to the agent so it can try a different approach",
        "The task is automatically reassigned to a different agent"
      ],
      "correct": 2
    },
    {
      "id": "q8",
      "question": "Which task decomposition strategy involves multiple agents working on different aspects in parallel, then one agent synthesizing the results?",
      "options": [
        "Pipeline Decomposition",
        "Iterative Refinement",
        "Fan-Out / Fan-In",
        "Specialist Routing"
      ],
      "correct": 2
    },
    {
      "id": "q9",
      "question": "What is the recommended approach when building a complex multi-agent crew?",
      "options": [
        "Build all agents and tasks at once, then test the complete system",
        "Build and test incrementally, starting with one agent and adding complexity step by step",
        "Copy an existing crew template and only change the topic variable",
        "Start with hierarchical mode and switch to sequential only if there are errors"
      ],
      "correct": 1
    },
    {
      "id": "q10",
      "question": "Which of the following best describes the ''Complement Principle'' in agent role design?",
      "options": [
        "Every agent should have a complimentary backstory that praises other agents",
        "The best crews have agents with complementary roles, such as one that creates and another that reviews",
        "Agents should all share the same role to ensure consistency",
        "Each agent must complement the user''s original prompt with additional context"
      ],
      "correct": 1
    }
  ]'::jsonb,
  70,
  30
);


-- ============================================================================
-- ASSESSMENT 3: LangGraph Advanced
-- ============================================================================

insert into public.assessments (course_id, title, description, questions, passing_score, time_limit_minutes)
values (
  (select id from public.courses where slug = 'langgraph-advanced'),
  'LangGraph Advanced Certification Exam',
  'Test your knowledge of graph-based workflows, state management, checkpointing, conditional routing, human-in-the-loop patterns, and production deployment.',
  '[
    {
      "id": "q1",
      "question": "What fundamental limitation of linear prompt chains does LangGraph solve?",
      "options": [
        "Chains cannot use language models larger than GPT-3",
        "Chains can only go forward and cannot branch, loop, or run steps in parallel",
        "Chains are limited to processing text and cannot handle images",
        "Chains cannot connect to external APIs or databases"
      ],
      "correct": 1
    },
    {
      "id": "q2",
      "question": "In LangGraph, what is a ''node''?",
      "options": [
        "A connection between two processing steps",
        "The data that flows through the workflow",
        "A processing step implemented as a function that receives state and returns a state update",
        "A configuration file that defines the graph structure"
      ],
      "correct": 2
    },
    {
      "id": "q3",
      "question": "What is the purpose of a ''conditional edge'' in LangGraph?",
      "options": [
        "To connect nodes that only exist in certain environments",
        "To automatically retry a node if it fails",
        "To choose the next node dynamically based on the current state using a routing function",
        "To limit the number of times a node can execute"
      ],
      "correct": 2
    },
    {
      "id": "q4",
      "question": "What does checkpointing enable in a LangGraph workflow?",
      "options": [
        "Automatic unit testing of every node in the graph",
        "Saving state at each node so the workflow can resume from where it left off after a failure",
        "Encrypting all data that passes through the graph",
        "Limiting the total cost of LLM calls per execution"
      ],
      "correct": 1
    },
    {
      "id": "q5",
      "question": "In LangGraph state management, what does the ''add_messages'' reducer do?",
      "options": [
        "It validates that all messages are properly formatted before processing",
        "It replaces the entire message list with the new value",
        "It appends new messages to the existing list instead of replacing it",
        "It sends messages to an external logging service"
      ],
      "correct": 2
    },
    {
      "id": "q6",
      "question": "How does a LangGraph ''interrupt'' work in a human-in-the-loop pattern?",
      "options": [
        "It terminates the workflow and sends an error to the user",
        "It pauses the workflow, saves the state, and waits for human input before continuing",
        "It switches from one LLM provider to another mid-workflow",
        "It creates a duplicate of the workflow that runs in parallel"
      ],
      "correct": 1
    },
    {
      "id": "q7",
      "question": "When designing a LangGraph state schema, why is it recommended to keep the structure flat rather than deeply nested?",
      "options": [
        "LangGraph does not support nested data types in state",
        "Flat structures are easier to update, debug, and reason about across nodes",
        "Nested structures cause the graph to run 10x slower",
        "Python TypedDict does not support nested dictionaries"
      ],
      "correct": 1
    },
    {
      "id": "q8",
      "question": "What is the recommended checkpoint backend for production LangGraph deployments?",
      "options": [
        "MemorySaver",
        "LocalFileSaver",
        "PostgresSaver",
        "JSONSaver"
      ],
      "correct": 2
    },
    {
      "id": "q9",
      "question": "Which graph pattern involves a workflow looping back to an earlier node until a quality threshold is met?",
      "options": [
        "Linear pattern",
        "Fan-Out / Fan-In pattern",
        "Branching pattern",
        "Loop (iterative refinement) pattern"
      ],
      "correct": 3
    },
    {
      "id": "q10",
      "question": "When deploying a LangGraph workflow via LangGraph Cloud, what is a key advantage over self-hosting?",
      "options": [
        "It is always free regardless of usage volume",
        "It provides managed infrastructure, automatic scaling, and built-in checkpointing without operational overhead",
        "It allows you to use models that are not available through self-hosting",
        "It guarantees zero latency on all API calls"
      ],
      "correct": 1
    }
  ]'::jsonb,
  70,
  30
);


-- ============================================================================
-- ASSESSMENT 4: AI Communications with Magpipe
-- ============================================================================

insert into public.assessments (course_id, title, description, questions, passing_score, time_limit_minutes)
values (
  (select id from public.courses where slug = 'ai-communications-magpipe'),
  'AI Communications Certification Exam',
  'Test your knowledge of AI-powered communications, the Magpipe platform, voice agents, chat agents, phone automation, SMS workflows, and knowledge bases.',
  '[
    {
      "id": "q1",
      "question": "In the Magpipe platform, what is the correct sequence when a customer calls a voice agent?",
      "options": [
        "Text-to-speech -> Language model -> Speech-to-text -> Audio stream",
        "Speech-to-text -> Language model -> Text-to-speech -> Audio stream",
        "Language model -> Speech-to-text -> Text-to-speech -> Audio stream",
        "Audio stream -> Text-to-speech -> Language model -> Speech-to-text"
      ],
      "correct": 1
    },
    {
      "id": "q2",
      "question": "What is a ''custom function'' in Magpipe?",
      "options": [
        "A JavaScript function that styles the chat widget",
        "A programmable action that extends an agent''s capabilities beyond conversation, such as looking up orders or scheduling appointments",
        "A function that customizes the voice pitch and speed of the agent",
        "A billing feature that calculates custom pricing for API usage"
      ],
      "correct": 1
    },
    {
      "id": "q3",
      "question": "Why should a voice agent identify itself as AI at the beginning of a call?",
      "options": [
        "It is a technical requirement of all telephony providers",
        "AI voice agents cannot impersonate humans due to model limitations",
        "Transparency builds trust, and customers who feel deceived will not trust the system",
        "It reduces the cost of each API call by 50%"
      ],
      "correct": 2
    },
    {
      "id": "q4",
      "question": "What does TCPA compliance require for business SMS messages?",
      "options": [
        "Messages must be sent only in English",
        "Explicit written consent, an opt-out mechanism in every message, and no messages before 8am or after 9pm in the recipient''s time zone",
        "A maximum of 10 messages per customer per year",
        "All messages must be reviewed by a human before sending"
      ],
      "correct": 1
    },
    {
      "id": "q5",
      "question": "What is ''containment rate'' in the context of AI phone automation?",
      "options": [
        "The percentage of calls that last less than 60 seconds",
        "The percentage of calls resolved by the AI without needing a human transfer",
        "The ratio of inbound to outbound calls handled by the system",
        "The maximum number of concurrent calls the system can handle"
      ],
      "correct": 1
    },
    {
      "id": "q6",
      "question": "How does RAG (Retrieval-Augmented Generation) improve an AI agent''s responses?",
      "options": [
        "It trains a new model specifically for your business data",
        "It searches a knowledge base for relevant information and includes it in the AI''s context when generating a response",
        "It randomly selects responses from a pre-written script library",
        "It records all conversations and replays similar past responses"
      ],
      "correct": 1
    },
    {
      "id": "q7",
      "question": "When structuring content for a knowledge base, why is Q&A format recommended?",
      "options": [
        "It reduces the storage cost of the knowledge base by 50%",
        "The question pattern aligns strongly with how customers phrase their queries, improving retrieval accuracy",
        "AI models can only process text that is formatted as questions and answers",
        "It is required by Magpipe''s knowledge base system and other formats are rejected"
      ],
      "correct": 1
    },
    {
      "id": "q8",
      "question": "What is the recommended maximum speaking length for a voice agent response?",
      "options": [
        "5 seconds",
        "15 seconds, offering to explain more if the customer needs detail",
        "60 seconds to ensure complete information delivery",
        "There is no recommended limit; longer responses are always better"
      ],
      "correct": 1
    },
    {
      "id": "q9",
      "question": "What advantage does SMS have over email for customer communications?",
      "options": [
        "SMS messages can include unlimited images and video attachments",
        "SMS has a 98% open rate compared to approximately 20% for email, and 90% of texts are read within 3 minutes",
        "SMS is completely free to send while email requires paid infrastructure",
        "SMS messages are automatically translated into the recipient''s language"
      ],
      "correct": 1
    },
    {
      "id": "q10",
      "question": "When a voice agent encounters a question it cannot answer, what is the best practice?",
      "options": [
        "Repeat the question back to the customer and remain silent",
        "Make up a plausible answer based on general knowledge",
        "Acknowledge the limitation and offer a clear path forward, such as transferring to a human specialist",
        "End the call immediately and log the question for later review"
      ],
      "correct": 2
    }
  ]'::jsonb,
  70,
  30
);

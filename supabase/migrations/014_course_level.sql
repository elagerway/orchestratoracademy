-- Add level column to courses for progression tracking
ALTER TABLE courses ADD COLUMN IF NOT EXISTS level text DEFAULT 'intermediate';

-- Set levels
UPDATE courses SET level = 'entry' WHERE slug = 'ai-orchestration-foundations';
UPDATE courses SET level = 'intermediate' WHERE slug IN ('claude-code-superpowers', 'supercharging-context-memory');
UPDATE courses SET level = 'advanced' WHERE slug IN ('crewai-mastery', 'langgraph-advanced', 'ai-communications-magpipe', 'multi-agent-paperclip', 'autonomous-self-improving-agents', 'ai-agent-security-governance');

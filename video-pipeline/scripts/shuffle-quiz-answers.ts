import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

type Question = {
  id?: string;
  question: string;
  options: string[];
  correct: number;
};

// Fisher-Yates shuffle with tracking of where each element ends up
function shuffleWithIndexMap<T>(arr: T[]): { shuffled: T[]; indexMap: number[] } {
  const shuffled = arr.slice();
  const indexMap = arr.map((_, i) => i); // indexMap[originalIdx] = newIdx
  const positions = arr.map((_, i) => i); // positions[i] = current physical index

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    // track where originals went
    const origAtI = positions.indexOf(i);
    const origAtJ = positions.indexOf(j);
    [positions[origAtI], positions[origAtJ]] = [positions[origAtJ], positions[origAtI]];
  }
  // positions[originalIdx] = final index
  for (let k = 0; k < arr.length; k++) indexMap[k] = positions[k];
  return { shuffled, indexMap };
}

async function run() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data: quizzes, error } = await sb.from("module_quizzes").select("id, questions");
  if (error) throw error;
  if (!quizzes) throw new Error("no quizzes");

  let totalQuestions = 0;
  let updated = 0;

  for (const quiz of quizzes) {
    const original = quiz.questions as Question[];
    if (!Array.isArray(original)) continue;

    const next = original.map((q) => {
      totalQuestions++;
      const { shuffled, indexMap } = shuffleWithIndexMap(q.options);
      const newCorrect = indexMap[q.correct];
      return { ...q, options: shuffled, correct: newCorrect };
    });

    const { error: upErr } = await sb
      .from("module_quizzes")
      .update({ questions: next })
      .eq("id", quiz.id);
    if (upErr) throw new Error(`quiz ${quiz.id}: ${upErr.message}`);
    updated++;
  }

  // Verify new distribution
  const { data: after } = await sb.from("module_quizzes").select("questions");
  const dist: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  for (const q of after || []) {
    for (const qq of (q.questions as Question[]) || []) {
      dist[qq.correct] = (dist[qq.correct] || 0) + 1;
    }
  }
  console.log(`Shuffled ${totalQuestions} questions across ${updated} quizzes.`);
  console.log("New distribution:");
  for (const [k, v] of Object.entries(dist)) {
    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    console.log(`  ${String.fromCharCode(65 + Number(k))}: ${v} (${Math.round((v / total) * 100)}%)`);
  }
}

run().catch((e) => { console.error(e); process.exit(1); });

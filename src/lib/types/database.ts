export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  role: "student" | "admin";
  assessment_score: number | null;
  maturity_level: number | null;
  company_name: string | null;
  company_role: string | null;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  is_free: boolean;
  price: number | null;
  order: number;
  created_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  slug: string;
  content_type: "video" | "text" | "interactive" | "quiz";
  content: string;
  video_url: string | null;
  order: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface UserEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
}

// Joined types for queries
export interface CourseWithModules extends Course {
  modules: ModuleWithLessons[];
}

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export interface CourseWithProgress extends Course {
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  plan: "free" | "pro" | "team";
  status: "active" | "canceled" | "past_due" | "incomplete" | "trialing";
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  stripe_payment_id: string;
  amount: number;
  currency: string;
  status: "succeeded" | "pending" | "failed" | "refunded";
  created_at: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
}

export interface Assessment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  passing_score: number;
  time_limit_minutes: number | null;
  created_at: string;
}

export interface AssessmentAttempt {
  id: string;
  user_id: string;
  assessment_id: string;
  answers: number[];
  score: number;
  passed: boolean;
  attempted_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  assessment_score: number;
  issued_at: string;
}

export interface ModuleQuiz {
  id: string;
  module_id: string;
  questions: AssessmentQuestion[];
  xp_reward: number;
  created_at: string;
}

export interface ModuleQuizResult {
  id: string;
  user_id: string;
  module_quiz_id: string;
  score: number;
  total: number;
  passed: boolean;
  xp_earned: number;
  completed_at: string;
}

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface TeamAssessment {
  id: string;
  user_id: string;
  tool_checks: Record<string, boolean>;
  api_checks: Record<string, boolean>;
  repo_analysis: Record<string, unknown>;
  maturity_score: number;
  gap_report: string;
  raw_results: Record<string, unknown>;
  created_at: string;
}

export interface LabVerification {
  id: string;
  user_id: string;
  lesson_id: string;
  lab_type: "api_response" | "terminal_output" | "config_content" | "file_hash";
  evidence: string;
  verified: boolean;
  verification_details: Record<string, unknown>;
  xp_earned: number;
  created_at: string;
}

export interface DeployCompletion {
  id: string;
  user_id: string;
  project_name: string;
  use_case: string;
  scaffold_type: string;
  technologies: string[];
  assessment_id: string | null;
  completed_courses: string[];
  created_at: string;
}

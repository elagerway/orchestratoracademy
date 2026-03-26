export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  role: "student" | "admin";
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

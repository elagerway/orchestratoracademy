export interface LabChallenge {
  lessonSlug: string;
  labType: "api_response" | "terminal_output" | "config_content" | "file_hash";
  title: string;
  instructions: string;
  hint: string;
  xpReward: number;
}

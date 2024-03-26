import { z } from 'zod';
// Type inferred from Zod schema
export type ProjectContext = z.infer<typeof ProjectContextSchema>;

// Define your Zod schema for the project context event
const ProjectContextSchema = z.object({
  projectName: z.string(),
  projectContext: z.string(),
  techOverview: z.string(),
  // Add more fields as necessary
});

export const validateProjectContext = (event: ProjectContext): ProjectContext => {
  // Validate the event using the ProjectContextSchema
  const result = ProjectContextSchema.parse(event); // This will throw if validation fails

  return result; // result is typed as ProjectContext
};


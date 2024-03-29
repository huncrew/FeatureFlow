import { z } from 'zod';
// Type inferred from Zod schema
export type ProjectContext = z.infer<typeof ProjectContextSchema>;

const StepSchema = z.object({
  title: z.string(),
  objective: z.string(),
  exampleCode: z.string(),
});

const ProjectContextSchema = z.object({
  user: z.string(),
  projectTitle: z.string(),
  projectContext: z.string(),
  techContext: z.string(),
  steps: z.array(StepSchema), // Include the steps as part of the project context
});

export const validateProjectContext = (event: ProjectContext): ProjectContext => {
  // Validate the event using the ProjectContextSchema
  const result = ProjectContextSchema.parse(event); // This will throw if validation fails

  return result; // result is typed as ProjectContext
};


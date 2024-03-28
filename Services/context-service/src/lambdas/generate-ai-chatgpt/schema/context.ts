import { z } from 'zod';

// Define the schema for a step
const StepSchema = z.object({
  title: z.string(),
  objective: z.string(),
  exampleCode: z.string(),
  stepNumber: z.number(),
});

// Define the schema for the full event which includes the step
const EventSchema = z.object({
  projectTitle: z.string(),
  projectOverview: z.string(),
  techContext: z.string(),
  featureObjective: z.string(),
  step: StepSchema, // Not an array, since we're validating a single step event
});

// Infer the TypeScript type from the Zod schema
export type Event = z.infer<typeof EventSchema>;

// Function to validate the event
export const validateEvent = (event: any): Event => {
  const result = EventSchema.parse(event); // This will throw if validation fails
  return result; // result is typed as Event (inferred from EventSchema)
};

import { z } from "zod";

export const ScreenerAnswerSchema = z.object({
  value: z.number(),
  questionId: z.string()
});

export const CalculateScreenerResultRequestSchema = z.object({
  answers: z.array(ScreenerAnswerSchema)
});

export type CalculateScreenerResultRequest = z.infer<
  typeof CalculateScreenerResultRequestSchema
>;
export type ScreenerAnswer = z.infer<typeof ScreenerAnswerSchema>;

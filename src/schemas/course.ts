import { z } from 'zod';

export const moduleItemSchema = z.object({
  slug: z.string().min(1),
  order_index: z.number().int().positive(),
  title: z.string().min(1),
  video_timestamp: z.string().regex(/^\[\d{2}:\d{2}:\d{2}\]$/, {
    message: 'video_timestamp phải có định dạng [HH:MM:SS]',
  }),
});

export const courseSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  source_url: z.string().url(),
  channel_name: z.string().min(1),
  modules: z.array(moduleItemSchema).min(1),
});

export const challengeItemSchema = z.object({
  order_index: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  mode_required: z.enum(['junior', 'senior', 'both']),
});

export const moduleChallengesSchema = z.object({
  module_slug: z.string().min(1),
  challenges: z.array(challengeItemSchema),
});

export type ModuleItem = z.infer<typeof moduleItemSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type ChallengeItem = z.infer<typeof challengeItemSchema>;
export type ModuleChallengesInput = z.infer<typeof moduleChallengesSchema>;

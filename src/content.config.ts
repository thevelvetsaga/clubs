import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const oneOrMany = <T extends z.ZodTypeAny>(schema: T) =>
    z.union([schema, z.array(schema)]).transform(v => (Array.isArray(v) ? v : [v]));

const clubsSchema = z.object({
    name: z.string(),
    description: z.string(),
    theme_color_light: z.string().optional(),
    theme_color_dark: z.string().optional(),
    location: z.string().optional(),
    links: z.object({
        Website: z
            .url()
            .optional(),

        Instagram: z
            .string()
            .regex(/^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?$/, "Invalid Instagram link")
            .optional(),

        X: z
            .string()
            .regex(/^https:\/\/x\.com\/[A-Za-z0-9_]+\/?$/, "Invalid X link")
            .optional(),

        WhatsApp: z
            .url()
            .optional(),

        LinkedIn: z
            .string()
            .regex(/^https:\/\/(www\.)?linkedin\.com\/(?:(?:in)|(?:company))\/[A-Za-z0-9-]+\/?$/, "Invalid LinkedIn company page")
            .optional(),

        GitHub: z
            .string()
            .regex(/^https:\/\/github\.com\/[A-Za-z0-9-]+\/?$/, "Invalid GitHub org/user link")
            .optional(),

        Discord: z
            .url()
            .optional(),

        Telegram: z
            .url()
            .optional()
    }),
    classification: z
        .object({
            organization: oneOrMany(z.enum(['Club', 'Team'])).refine(v => v.length > 0, {
                message: 'At least one organization type is required',
            }),
            category: oneOrMany(z.enum(['STEM', 'Cultural','Humanities', 'IEEE'])).refine(v => v.length > 0, {
                message: 'At least one category is required',
            }),
            tags: z.array(z.string().min(2)).default([]),
        })
        .describe('Named categorization fields for filtering purposes'),
});

const clubs = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/clubs' }),
    schema: clubsSchema
});

export const collections = { clubs };
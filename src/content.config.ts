import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const oneOrMany = <T extends z.ZodTypeAny>(schema: T) =>
    z.union([schema, z.array(schema)]).transform(v => (Array.isArray(v) ? v : [v]));

const clubsSchema = z.object({
    name: z.string(),
    description: z.string(),
    accent_color: z.string().optional(),
    location: z.string().optional(),
    links: z
        .object({
            Website: z.string().url().optional(),
            Instagram: z.string().url().optional(),
            X: z.string().url().optional(),
            Whatsapp: z.string().url().optional(),
            LinkedIn: z.string().url().optional(),
            Github: z.string().url().optional(),
        })
        .default({}),
    classification: z
        .object({
            organization: oneOrMany(z.enum(['Club', 'Team'])).refine(v => v.length > 0, {
                message: 'At least one organization type is required',
            }),
            category: oneOrMany(z.enum(['Technical', 'Cultural','Humanities'])).refine(v => v.length > 0, {
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

type e = z.infer<typeof clubsSchema>

export const collections = { clubs };
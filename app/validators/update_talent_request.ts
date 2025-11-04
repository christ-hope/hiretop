// app/validators/talent.ts
import vine from '@vinejs/vine'

const phoneSchema = vine.string().mobile()
const urlSchema = vine.string().url()
const dateSchema = vine.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const updateTalentRequest = vine.compile(
  vine.object({
    phone: phoneSchema.optional().nullable(),
    title: vine.string().trim().maxLength(100).optional().nullable(),
    bio: vine.string().trim().maxLength(2000).optional().nullable(),
    location: vine.string().trim().maxLength(100).optional().nullable(),
    isAvailable: vine.string().optional().nullable(),
    linkedinUrl: urlSchema.optional().nullable(),
    githubUrl: urlSchema.optional().nullable(),

    skills: vine
      .array(
        vine.object({
          skillId: vine.number(),
          level: vine.string().in(['beginner', 'intermediate', 'expert']).optional(),
        })
      )
      .optional(),

    experiences: vine
      .array(
        vine.object({
          id: vine.number().optional(),
          title: vine.string(),
          company: vine.string(),
          location: vine.string().optional(),
          startDate: dateSchema,
          endDate: dateSchema.optional().nullable(),
          current: vine.boolean().optional(),
          description: vine.string().optional(),
        })
      )
      .optional(),

    educations: vine
      .array(
        vine.object({
          id: vine.number().optional(),
          school: vine.string(),
          degree: vine.string(),
          field: vine.string(),
          startDate: dateSchema,
          endDate: dateSchema.optional().nullable(),
          current: vine.boolean().optional(),
        })
      )
      .optional(),
  })
)

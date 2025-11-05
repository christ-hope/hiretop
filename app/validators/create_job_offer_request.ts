import vine from '@vinejs/vine'

const contractTypes = ['CDI', 'CDD', 'FREELANCE', 'INTERNSHIP'] as const

export const createJobOfferRequest = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(5).maxLength(100),
    description: vine.string().trim().minLength(20),
    location: vine.string().trim().maxLength(100).optional().nullable(),
    contractType: vine.enum(contractTypes),
    skillIds: vine.array(vine.number()).optional(),
    expireAt: vine.string().optional(),
  })
)

export const updateJobOfferRequest = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(5).maxLength(100).optional(),
    description: vine.string().trim().minLength(20).optional(),
    location: vine.string().trim().maxLength(100).optional().nullable(),
    contractType: vine.enum(contractTypes).optional(),
    skillIds: vine.array(vine.number()).optional(),
    expireAt: vine.string().optional(),
  })
)

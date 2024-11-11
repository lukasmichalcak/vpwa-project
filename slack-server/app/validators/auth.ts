import vine from '@vinejs/vine'

const password = vine.string().minLength(8)

export const registerValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const match = await db.from('users').select('id').where('email', value).first()

        return !match
      }),
    password,
    firstName: vine.string().minLength(2),
    lastName: vine.string().minLength(2),
    username: vine
      .string()
      .minLength(2)
      .unique(async (db, value) => {
        const match = await db.from('users').select('id').where('username', value).first()

        return !match
      }),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    username: vine.string().minLength(2),
    password,
  })
)

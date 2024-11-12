import vine from '@vinejs/vine'

export const createChannelValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .minLength(1)
      .maxLength(20)
      .unique(async (db, value) => {
        const match = await db.from('channels').select('id').where('name', value).first()

        return !match
      }),
    admin_id: vine.number(),
    channel_type: vine.enum(['public', 'private']),
  })
)

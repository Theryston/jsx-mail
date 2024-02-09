import { PrismaClient } from '@prisma/client'
import moment from 'moment'
import { FREE_BALANCE } from 'src/utils/contants'

const prisma = new PrismaClient()

export const handler = async () => {
	console.log('[ADD_FREE_BALANCE] started at: ', new Date())

	const oneMonthAgo = moment().subtract(1, 'month')
		.add(1, 'day')
		.set({
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0
		}).toDate()

	const usersToAddBalance = await prisma.user.findMany({
		where: {
			deletedAt: {
				isSet: false
			},
			transactions: {
				none: {
					createdAt: {
						gte: oneMonthAgo
					},
					style: 'earn_free'
				}
			}
		}
	})

	for (const user of usersToAddBalance) {
		const { _sum: { amount: balance } } = await prisma.transaction.aggregate({
			where: {
				userId: user.id,
				deletedAt: {
					isSet: false
				}
			},
			_sum: {
				amount: true
			}
		})

		let diff = balance < 0 ? 0 : FREE_BALANCE - balance

		if (diff < 0) {
			diff = 0
		}

		await prisma.transaction.create({
			data: {
				amount: diff,
				style: 'earn_free',
				userId: user.id,
				description: 'Earning from free balance'
			}
		})

		console.log(`[ADD_FREE_BALANCE] ${user.id} added ${diff} free balance`)
	}

	console.log('[ADD_FREE_BALANCE] ended at: ', new Date())
}
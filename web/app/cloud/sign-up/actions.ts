'use server'

export async function createUser(_: any, formData: FormData) {
	const email = formData.get('email')
	const name = formData.get('name')
	const password = formData.get('password')
	const password2 = formData.get('password2')

	if (password !== password2) {
		return { isError: true, message: 'The password are not the same' }
	}

	return { message: 'User created!' }
}
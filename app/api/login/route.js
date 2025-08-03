// app/api/login/route.js
import { TEST_USERS } from '@/lib/users'

export async function POST(req) {
  try {
    const { username, password } = await req.json()

    const user = TEST_USERS.find(
      (u) => u.username === username && u.password === password
    )

    if (user) {
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Invalid credentials' }), {
        status: 401
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500
    })
  }
}

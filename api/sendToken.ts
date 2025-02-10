'use server'

import { cookies } from 'next/headers'
import axios from 'axios'

export async function sendTokenToApi(token: string) {
  if (!token) {
    throw new Error('Token is required')
  }

  try {
    const formData = new FormData()
    formData.append('firebase_token', token)

    const { data } = await axios.post(
      'http://167.235.51.199:8000/api/v1/citizens/',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    if (data.data.access_token) {
      // Use server-side cookies API instead of js-cookie
      const cookieStore = await cookies();
      cookieStore.set('auth_token', data.data.access_token)
    }

    return data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to send token')
  }
}
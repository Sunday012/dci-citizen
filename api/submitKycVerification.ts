'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import axios from 'axios'

export async function submitKycVerification(formData: FormData) {
  try {
    const token = (await cookies()).get('auth_token')?.value
    console.log("token", token)
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await axios.post('http://167.235.51.199:8000/api/v1/citizens/kyc/', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    })

    revalidatePath('/')
    console.log("success", response.data)
    return { success: true, data: response.data }
  } catch (error: any) {
    console.log("error")
    return {
      success: false,
      error: error.response?.data?.detail?.[0]?.msg || 'KYC verification failed'
    }
  }
}
import ForgotPasswordForm from '@/components/forms/forgotpassword-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password | Braaap'
}

const ForgotPasswordPage = () => {
  return (
    <ForgotPasswordForm />
  )
}

export default ForgotPasswordPage
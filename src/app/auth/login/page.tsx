import LoginForm from '@/components/forms/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Braaap'
}

const LoginPage = () => {
  return (
      <LoginForm />
  )
}

export default LoginPage
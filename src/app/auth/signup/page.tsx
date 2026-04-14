import SignUpForm from '@/components/forms/signup-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | Braaap'
}

const SignUpPage = () => {
  return (
    <div>
      <SignUpForm />
    </div>
  )
}

export default SignUpPage
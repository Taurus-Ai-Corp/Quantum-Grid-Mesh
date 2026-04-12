import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-bone flex items-center justify-center p-6">
      <div className="shadow-lg rounded-brand overflow-hidden">
        <SignUp />
      </div>
    </div>
  )
}

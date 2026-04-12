import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-bone flex items-center justify-center p-6">
      <div className="shadow-lg rounded-brand overflow-hidden">
        <SignIn />
      </div>
    </div>
  )
}

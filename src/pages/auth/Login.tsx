import { LoginForm } from "@/components/auth/LoginForm";
import { LockOpen } from "lucide-react";

export const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl shadow-purple-400 w-full max-w-md border border-gray-200 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 mb-2 rounded-full flex bg-purple-200 items-center justify-center text-white font-bold text-lg">
            <LockOpen className="text-black" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm">
            Please sign in to your account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

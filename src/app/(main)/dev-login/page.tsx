'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useSession, signOut } from "next-auth/react";
export default function DevLoginPage() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    console.log(session, status);
    
    const handleSignIn = async (provider: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await signIn(provider, { redirect: true, callbackUrl: '/' });
        } catch (err) {
            setError(`Failed to sign in with ${provider}`);
            setIsLoading(false);
        }
    };

    const handleCredentialsSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await signIn('credentials', {
                email,
                password,
                redirect: true,
                callbackUrl: '/',
            });
        } catch (err) {
            setError('Failed to sign in with email and password');
            setIsLoading(false);
        }
    };
if (status === "loading") {
    return <p>Checking login status...</p>;
  }

  if (status === "authenticated") {
    return (
      <div>
        <p>Aap login ho! Welcome, {session.user?.email}</p>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    );
  }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleCredentialsSignIn} className="mb-6">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="w-full mb-3 px-4 py-2 border rounded disabled:opacity-50"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="w-full mb-3 px-4 py-2 border rounded disabled:opacity-50"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-900 disabled:opacity-50"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in with Email'}
                    </button>
                </form>

                <div className="mb-4 text-center text-gray-500 text-sm">Or continue with</div>

                <button
                    onClick={() => handleSignIn('github')}
                    disabled={isLoading}
                    className="w-full mb-3 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                >
                    {isLoading ? 'Signing in...' : 'Sign in with GitHub'}
                </button>

                <button
                    onClick={() => handleSignIn('google')}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? 'Signing in...' : 'Sign in with Google'}
                </button>
            </div>
        </div>
    );
}
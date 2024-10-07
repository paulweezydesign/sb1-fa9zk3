import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <h1 className="text-4xl font-bold mb-6">Welcome to MyApp</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        A secure and powerful application built with React, featuring authentication,
        MongoDB integration, and serverless functions.
      </p>
      <div className="space-x-4">
        <Link to="/login">
          <Button size="lg">Login</Button>
        </Link>
        <Link to="/register">
          <Button size="lg" variant="outline">
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
}
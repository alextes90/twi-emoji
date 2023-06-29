import Link from "next/link";

const Custom404 = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
      <div className="text-center text-white">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <p className="text-2xl">Oops! Page not found.</p>
        <p className="mt-2 text-lg">
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
        <Link href="/">
          <p className="mt-8 inline-block rounded-lg bg-blue-500 px-6 py-3 text-lg font-medium text-white transition-colors duration-300 hover:bg-blue-600">
            Go back to Home
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Custom404;

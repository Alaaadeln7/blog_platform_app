export default function NotFoundPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-gray-600">
          The page you are looking for does not exist.
        </p>
        <a
          href="/"
          className="mt-4 inline-block bg-blue-500 hover:bg-blue-700  text-white font-bold py-2 px-4 rounded"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

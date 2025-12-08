import Link from 'next/link';

export default function HelloWorld() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-600 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md text-center">
        <div className="text-6xl mb-6">👋</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Hello World!</h1>
        <p className="text-gray-600 text-lg mb-6">
          This is a simple test app to verify that the multi-app setup is working correctly.
        </p>
        
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>✓ Success!</strong> You can navigate between different apps in your system.
          </p>
        </div>

        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

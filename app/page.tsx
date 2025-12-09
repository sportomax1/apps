'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Apps</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
        <a 
          href="/weather"
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-4 group"
        >
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors text-5xl">
            ☀️
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Weather Forecast</h2>
          <p className="text-gray-600 text-center text-sm">
            Historical and predicted weather data with detailed analysis tools.
          </p>
        </a>

        <a 
          href="/sports.html"
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-4 group"
        >
          <div className="p-4 bg-purple-100 text-purple-600 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-colors text-5xl">
            🏆
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Sports Scoreboard</h2>
          <p className="text-gray-600 text-center text-sm">
            Emoji sports scoreboard with live ESPN data integration.
          </p>
        </a>

        <a 
          href="/hello"
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-4 group"
        >
          <div className="p-4 bg-green-100 text-green-600 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors text-5xl">
            👋
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Hello World</h2>
          <p className="text-gray-600 text-center text-sm">
            Simple test app to verify the multi-app setup.
          </p>
        </a>
      </div>
    </div>
  );
}

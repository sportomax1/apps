import Link from 'next/link';
import { CloudSun } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Apps</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
        <Link 
          href="/weather"
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-4 group"
        >
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <CloudSun size={48} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Weather Forecast</h2>
          <p className="text-gray-600 text-center text-sm">
            Historical and predicted weather data with detailed analysis tools.
          </p>
        </Link>

        {/* Placeholder for future apps */}
        <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-4 text-gray-400">
          <div className="w-16 h-16 rounded-full bg-gray-200"></div>
          <p className="font-medium">Coming Soon</p>
        </div>
      </div>
    </div>
  );
}

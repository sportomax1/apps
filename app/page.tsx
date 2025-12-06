'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CloudRain, Snowflake, Calendar as CalendarIcon, MapPin, Droplets, Thermometer, Wind, ChevronDown, Sunrise, Sunset, Clock } from 'lucide-react';

// --- Configuration & Helpers ---

const LOCATIONS = [
  { name: 'Parker, CO', lat: 39.5186, lon: -104.7614 },
  { name: 'Uehling, NE', lat: 41.7336, lon: -96.5028 },
  { name: 'San Diego, CA', lat: 32.7157, lon: -117.1611 },
  { name: 'Chicago, IL', lat: 41.8781, lon: -87.6298 },
  { name: 'Rochester, NY', lat: 43.1566, lon: -77.6088 },
  { name: 'Clayton, NY', lat: 44.2395, lon: -76.0858 },
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Generate years from 2000 to next year
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 2000 + 2 }, (_, i) => currentYear + 1 - i);

// Helper to format dates for API (YYYY-MM-DD)
const formatDateAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper to format ISO time strings to 'h:mm AM/PM'
const formatTime = (isoString: string | undefined): string => {
  if (!isoString || !isoString.includes('T')) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

// Helper to format duration in seconds to 'Hh Mm'
const formatDuration = (seconds: number | undefined): string => {
  if (typeof seconds !== 'number' || seconds < 0) return 'N/A';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

// --- Components ---

interface WeatherData {
  [key: string]: {
    precipitation: number;
    snowfall: number;
    tempMax: number;
    tempMin: number;
    windSpeed: number;
    sunrise: string;
    sunset: string;
    daylightDuration: number;
  };
}

interface Location {
  name: string;
  lat: number;
  lon: number;
}

export default function App() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [location, setLocation] = useState<Location>(LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<WeatherData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Derived state for calendar generation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // --- Data Fetching ---

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0); 

        const startStr = formatDateAPI(startDate);
        const endStr = formatDateAPI(endDate);
        
        let url = '';
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        
        const isHistorical = endDate < tenDaysAgo;
        
        // Params for imperial units, including sun/daylight data
        const params = `&daily=precipitation_sum,snowfall_sum,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,sunrise,sunset,daylight_duration&temperature_unit=fahrenheit&precipitation_unit=inch&wind_speed_unit=mph&timezone=auto`;

        if (isHistorical) {
             url = `https://archive-api.open-meteo.com/v1/archive?latitude=${location.lat}&longitude=${location.lon}&start_date=${startStr}&end_date=${endStr}${params}`;
        } else {
             url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&start_date=${startStr}&end_date=${endStr}${params}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Weather data unavailable');
        const data = await response.json();

        const processed: WeatherData = {};
        if (data.daily && data.daily.time) {
          data.daily.time.forEach((time: string, index: number) => {
            processed[time] = {
              precipitation: data.daily.precipitation_sum[index],
              snowfall: data.daily.snowfall_sum[index],
              tempMax: data.daily.temperature_2m_max[index],
              tempMin: data.daily.temperature_2m_min[index],
              windSpeed: data.daily.wind_speed_10m_max[index],
              sunrise: data.daily.sunrise[index],
              sunset: data.daily.sunset[index],
              daylightDuration: data.daily.daylight_duration[index],
            };
          });
        }

        setWeatherData(processed);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
        setWeatherData({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month, location]);

  // --- Render Helpers ---

  const renderCalendarDays = (): React.ReactNode[] => {
    const days: React.ReactNode[] = [];
    
    // Empty cells before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDateAPI(date);
      const isSelected = dateStr === formatDateAPI(selectedDate);
      const data = weatherData[dateStr];

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`
            aspect-square rounded-lg p-2 text-sm font-medium transition-colors
            ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
            ${data?.precipitation > 0 || data?.snowfall > 0 ? 'ring-2 ring-blue-400' : ''}
          `}
        >
          <div>{day}</div>
          {data && (
            <div className="text-xs mt-1">
              {data.snowfall > 0 && <div className="text-blue-600">❄ {data.snowfall}"</div>}
              {data.precipitation > 0 && data.snowfall === 0 && <div className="text-blue-500">💧 {data.precipitation}"</div>}
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  const selectedDateStr = formatDateAPI(selectedDate);
  const selectedData = weatherData[selectedDateStr];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Weather Forecast</h1>
          <p className="text-blue-100">Historical and predicted weather data</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={LOCATIONS.indexOf(location)}
                onChange={(e) => setLocation(LOCATIONS[parseInt(e.target.value)])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {LOCATIONS.map((loc, i) => (
                  <option key={i} value={i}>{loc.name}</option>
                ))}
              </select>
            </div>

            {/* Month/Year Selector */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                  value={month}
                  onChange={(e) => setCurrentDate(new Date(year, parseInt(e.target.value), 1))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={year}
                  onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), month, 1))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {MONTHS[month]} {year}
              </h2>
              <p className="text-gray-600">Click on a day to see details</p>
            </div>

            {loading && <p className="text-gray-600">Loading weather data...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            {!loading && !error && (
              <div className="grid grid-cols-7 gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-600 text-sm mb-2">
                    {day}
                  </div>
                ))}
                {renderCalendarDays()}
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {DAYS_OF_WEEK[selectedDate.getDay()]}, {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}
            </h3>

            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : selectedData ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
                  <Thermometer className="text-red-500" />
                  <div>
                    <p className="text-xs text-gray-600">Temperature</p>
                    <p className="font-bold text-lg">{selectedData.tempMax}°F / {selectedData.tempMin}°F</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
                  <Droplets className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-600">Precipitation</p>
                    <p className="font-bold text-lg">{selectedData.precipitation}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
                  <Snowflake className="text-blue-300" />
                  <div>
                    <p className="text-xs text-gray-600">Snowfall</p>
                    <p className="font-bold text-lg">{selectedData.snowfall}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
                  <Wind className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">Wind Speed</p>
                    <p className="font-bold text-lg">{selectedData.windSpeed} mph</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded">
                  <Sunrise className="text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-600">Sunrise</p>
                    <p className="font-bold text-lg">{formatTime(selectedData.sunrise)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded">
                  <Sunset className="text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-600">Sunset</p>
                    <p className="font-bold text-lg">{formatTime(selectedData.sunset)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded">
                  <Clock className="text-yellow-600" />
                  <div>
                    <p className="text-xs text-gray-600">Daylight</p>
                    <p className="font-bold text-lg">{formatDuration(selectedData.daylightDuration)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No data available for this date</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

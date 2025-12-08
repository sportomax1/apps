import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Weather Forecast | My Apps',
  description: 'Historical and predicted weather data',
}

export default function WeatherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="w-full h-full">
      {children}
    </section>
  )
}

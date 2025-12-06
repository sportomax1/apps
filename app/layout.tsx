import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Weather Forecast',
  description: 'Historical and predicted weather data for multiple locations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

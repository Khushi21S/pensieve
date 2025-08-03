import HomeActions from "./components/HomeActions"
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white p-6">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight typing-effect">
          Pensieve
        </h1>
        <p className="text-lg text-gray-600">Capture thoughts. Craft blogs.</p>

        <HomeActions />
      </div>
    </div>
  )
}

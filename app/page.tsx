import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-serif mb-6 tracking-tight">
            Shelfbook
          </h1>
          <p className="text-xl text-gray-400 mb-12 font-light">
            A space for your presence
          </p>
          <div className="flex gap-6 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Begin
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-transparent text-white border border-white rounded-lg font-medium hover:bg-white hover:text-black transition"
            >
              Enter
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-24 border-t border-gray-800 pt-12">
          <div className="border border-gray-800 p-8 hover:border-gray-700 transition">
            <h3 className="text-xl font-serif mb-4">Express</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Share your thoughts, your work, your essence through customizable sections
            </p>
          </div>
          <div className="border border-gray-800 p-8 hover:border-gray-700 transition">
            <h3 className="text-xl font-serif mb-4">Personalize</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Make it yours. Your words, your images, your story
            </p>
          </div>
          <div className="border border-gray-800 p-8 hover:border-gray-700 transition">
            <h3 className="text-xl font-serif mb-4">Share</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A simple link. Your presence, accessible to anyone
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

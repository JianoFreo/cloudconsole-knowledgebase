import { useState } from "react";
import { Check, Heart, Rocket, Settings, User } from "lucide-react";

function App() {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <header className="mx-auto flex max-w-5xl items-center justify-between rounded-xl bg-white p-6 shadow">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            React + Tailwind Test
          </h1>
          <p className="text-slate-500">
            Testing Vite, React, Tailwind CSS v4, and icons
          </p>
        </div>

        <Rocket className="h-10 w-10 text-blue-600" />
      </header>

      {/* Cards */}
      <main className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-3">

        <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
          <User className="mb-4 h-8 w-8 text-green-600" />

          <h2 className="text-xl font-semibold">
            React Works
          </h2>

          <p className="mt-2 text-slate-600">
            Components are rendering correctly.
          </p>
        </div>


        <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
          <Settings className="mb-4 h-8 w-8 text-purple-600" />

          <h2 className="text-xl font-semibold">
            Tailwind Works
          </h2>

          <p className="mt-2 text-slate-600">
            Utility classes are loading.
          </p>
        </div>


        <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
          <Check className="mb-4 h-8 w-8 text-blue-600" />

          <h2 className="text-xl font-semibold">
            Packages Work
          </h2>

          <p className="mt-2 text-slate-600">
            NPM dependencies are available.
          </p>
        </div>

      </main>


      {/* State Test */}
      <section className="mx-auto mt-8 max-w-5xl rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold">
          React State Test
        </h2>

        <p className="mt-2 text-slate-600">
          Button clicks: {count}
        </p>

        <button
          onClick={() => setCount(count + 1)}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Increase
        </button>


        <button
          onClick={() => setLiked(!liked)}
          className="ml-4 mt-4 inline-flex items-center gap-2 rounded-lg border px-5 py-2 hover:bg-slate-100"
        >
          <Heart
            className={liked ? "fill-red-500 text-red-500" : ""}
          />

          {liked ? "Liked" : "Like"}
        </button>

      </section>


      {/* Color Test */}
      <section className="mx-auto mt-8 max-w-5xl rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white shadow">

        <h2 className="text-3xl font-bold">
          Tailwind Gradient Test
        </h2>

        <p className="mt-2">
          If you see this styled correctly, Tailwind is working.
        </p>

      </section>

    </div>
  );
}

export default App;
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-12 md:py-20 overflow-hidden">
      {/* HERO SECTION */}
      <section className="text-center max-w-3xl mx-auto mb-16 animate-fadeIn">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
          Plan events, <span className="text-indigo-600">simply</span> and{" "}
          <span className="text-purple-600">beautifully</span>.
        </h1>
        <p className="text-gray-600 mt-5 text-lg">
          Discover venues, hire professionals, and manage everything in one elegant platform.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate("/vendor/register")}
            className="px-6 py-3 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-md"
          >
            Join as Vendor
          </button>
          <button
            onClick={() => navigate("/vendors")}
            className="px-6 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:border-indigo-500 hover:text-indigo-600 transition-transform transform hover:scale-105 shadow-sm"
          >
            Explore as Customer
          </button>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-2 md:px-0">
        <FeatureCard
          icon="🏛️"
          title="Stunning Venues"
          desc="Browse curated spaces that make every event unforgettable."
        />
        <FeatureCard
          icon="💼"
          title="Verified Vendors"
          desc="Connect with trusted professionals across every category."
        />
        <FeatureCard
          icon="📅"
          title="Effortless Planning"
          desc="From booking to payments, handle everything seamlessly."
        />
      </section>

      {/* CTA SECTION */}
      <section className="mt-20 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 animate-fadeInUp">
          Start your event journey today 🎉
        </h2>
        <p className="text-gray-600 mb-8">
          Whether you’re planning a wedding, a corporate party, or a festival — Event-Oh has you covered.
        </p>
        <button
          onClick={() => navigate("/vendor/register")}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Get Started
        </button>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div
      className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out group"
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

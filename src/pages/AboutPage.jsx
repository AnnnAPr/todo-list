function AboutPage() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-purple-300 text-left mb-4">
        About
      </h1>
      <p className="text-lg text-purple-100 font-medium leading-relaxed mb-6">
        TaskFlow is a personal task management app that helps you organize,
        track, and complete your daily to-dos. Create tasks, mark them as done,
        and stay focused on what matters most.
      </p>
      <section className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-4 sm:p-5 shadow-lg">
        <h2 className="text-lg font-semibold text-purple-300 mb-2">
          Technical Overview
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          This application is a modern{" "}
          <span className="italic font-semibold text-white text-lg">
            Single Page Application (SPA)
          </span>{" "}
          built using{" "}
          <span className="italic font-semibold text-white text-lg">React</span>{" "}
          and powered by{" "}
          <span className="italic font-semibold text-white text-lg">Vite</span>{" "}
          for an ultra-fast development and build experience. Seamless
          client-side navigation is handled by{" "}
          <span className="italic font-semibold text-white text-lg">
            React Router
          </span>
          , allowing users to transition between views smoothly without full
          page reloads.
        </p>
      </section>
    </div>
  );
}

export default AboutPage;

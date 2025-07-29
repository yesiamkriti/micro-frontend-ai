export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-indigo-700 text-white shadow-md">
      <h1 className="text-xl font-bold">🧠 AI Component Generator</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm hidden sm:inline">Hello, Developer</span>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="bg-white text-indigo-700 px-3 py-1 rounded hover:bg-indigo-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

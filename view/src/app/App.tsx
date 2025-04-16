import React from 'react';
function App() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tailwind CSS Test</h1>

      <div className="border border-black mb-6">
        <div className="App border bg-pink-500 border-black p-4 mb-4">
          <header className="App-header bg-pink-400 text-3xl p-2">
            <p className="text-4xl">APP (Original)</p>
          </header>
        </div>
      </div>

      <div className="border border-black mb-6">
        <div className="App border border-black p-4 mb-4 bg-red-500">
          <header className="App-header p-2 bg-red-400 text-3xl">
            <p className="text-4xl">APP (Red Test)</p>
          </header>
        </div>
      </div>

      <div className="border border-black mb-6">
        <div className="App border border-black p-4 mb-4 bg-primary-500">
          <header className="App-header p-2 bg-primary-400 text-3xl">
            <p className="text-4xl">APP (Primary Test)</p>
          </header>
        </div>
      </div>
    </div>
  );
}

export default App;

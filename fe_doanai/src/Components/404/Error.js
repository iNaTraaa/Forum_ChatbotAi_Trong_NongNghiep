import './Error.scss';

const Error = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="border-2 border-dashed border-blue-300 p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">It's okay to feel a little lost sometimes.</h1>
        <div className="border border-blue-300 p-4 mb-4">
          <p>The page you're looking for isn't here.</p>
          <p>But don't worry — you're still in a safe place.</p>
          <p>Let's help you find your way back to where you belong.</p>
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded">Go Home</button>
      </div>
    </div>
  );
}

export default 404;
function ErrorMessage({ errorMessage }) {
  return (
    <div className="h-96 w-[1000px] rounded-3xl p-10 ml-20 mt-20 bg-cyan-400">
      <h1 className="font-bold text-[50px] m-3">{`An error occurred! (Message: ${errorMessage})`}</h1>
      <p className="text-gray-600 m-3">Could not found this page!</p>
    </div>
  );
}

export default ErrorMessage;

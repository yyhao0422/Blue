import RootLayout from "../Root";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <>
      <RootLayout>
        <div className="h-96 w-[1000px] rounded-3xl p-10 ml-20 mt-20 bg-cyan-400">
          <h1 className="font-bold text-[50px] m-3">
            An error occurred! (404)
          </h1>
          <p className="text-gray-600 m-3">Could not found this page!</p>
          <p className="text-gray-600 m-3">
            Check your path or click{" "}
            <Link to="">
              <span className="m-2 p-2 bg-blue-600 hover:bg-blue-800 text-white rounded-xl ">
                HERE
              </span>
            </Link>{" "}
            to navigate Main page
          </p>
        </div>
      </RootLayout>
    </>
  );
}

export default ErrorPage;

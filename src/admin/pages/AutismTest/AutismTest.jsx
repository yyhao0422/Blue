import ExistTest from "./ExistTest";

function AutismTest() {
  return (
    <>
      <div className="bg-cyan-400 p-3 h-fit m-3 rounded-md w-screen">
        <div className="flex justify-between">
          <h1 className="text-xl ">Autism Test Maintainance</h1>
          <button className="bg-cyan-700 hover:bg-cyan-900 text-white p-3 rounded-xl">
            New Test category
          </button>
        </div>

        <table className="m-3 ">
          <thead>
            <tr>
              <th className="p-2">Test ID</th>
              <th className="p-2">Test Title</th>
              <th className="p-2">Test Description</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            <ExistTest />
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AutismTest;

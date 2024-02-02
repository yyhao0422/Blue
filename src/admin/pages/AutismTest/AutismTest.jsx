import { useState, useRef } from "react";
import ExistTest from "./ExistTest";
import {
  useFetchTestCategory,
  usePostTestCategory,
} from "../../hooks/useFetch";

function AutismTest() {
  const { isLoading, error, testCategory, setRefresh } = useFetchTestCategory();
  const {
    isLoading: isNewFlashCardLoading,
    error: newFlashCardError,
    setPostBody,
    response,
    setResponse,
  } = usePostTestCategory();

  const newTestDialog = useRef();

  async function handleSubmitNewTest(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    const body = {
      title: data.title,
      description: data.description,
      autismTestQuestionIds: [],
    };
    setPostBody(JSON.stringify(body));
    e.target.reset();
  }

  if (response.ok) {
    setRefresh((prev) => !prev);
    newTestDialog.current.close();
    setResponse([]);
  }
  function handleNewFlashCard() {
    newTestDialog.current.showModal();
  }

  function closeNewFlashCard() {
    newTestDialog.current.close();
  }

  return (
    <>
      <div className="bg-cyan-400 p-3 h-fit m-3 rounded-md w-screen">
        <div className="flex justify-between">
          <h1 className="text-xl ">Autism Test Maintainance</h1>
          <button
            className="bg-cyan-700 hover:bg-cyan-900 text-white p-3 rounded-xl"
            onClick={handleNewFlashCard}
          >
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

          {isLoading && <p>Loading....</p>}

          <tbody>
            {!isLoading &&
              testCategory.map((test) => (
                <ExistTest
                  id={test.id}
                  title={test.title}
                  description={test.description}
                  question={test.question}
                  setRefresh={() => setRefresh((prev) => !prev)}
                />
              ))}
          </tbody>
        </table>
      </div>
      <dialog ref={newTestDialog} className="p-3 rounded-lg">
        <h1 className="mt-2 mb-4">New Autism Test Category</h1>
        {/* {isNewFlashCardLoading && <p>Submit in progress ...</p>} */}

        <form onSubmit={handleSubmitNewTest}>
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <label>Title :</label>
              <input type="text" className="m-2 border" required name="title" />
            </div>
            <div className="flex justify-between items-center">
              <label>Description :</label>
              <input
                type="text"
                className="m-2 border"
                required
                name="description"
              />
            </div>
          </div>
          <div className="flex justify-between m-3">
            <button>Save</button>
            <button type="button" onClick={closeNewFlashCard}>
              Close
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default AutismTest;

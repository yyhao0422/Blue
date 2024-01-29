import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

function ExistTestQuestion({ id, count, question, setRefresh }) {
  const { user } = useUser();
  const editModel = useRef();
  const [input, setInput] = useState({});
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [error, setError] = useState("");

  const currentQuestionClient = axios.create({
    baseURL: "https://api.alexsama.tech/api/autism-test-question/",
    headers: {
      "Content-Type": "application/json",
      ClerkId: user?.id,
    },
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  async function handleDeleteAction() {
    setIsLoadingDelete(true);
    try {
      const response = await currentQuestionClient.delete(`${id}`);
    } catch (err) {
      setError({
        message: err.message || "Failed to delete test question",
      });
    }
    setRefresh();
  }

  function openEditModel() {
    editModel.current.showModal();
  }
  function closeEditModel() {
    editModel.current.close();
  }

  async function handleEditAction(event) {
    event.preventDefault();
    console.log("edit");

    setIsLoadingEdit(true);

    const body = JSON.stringify({
      question: input.question,
      description: input.description,
    });
    try {
      const response = await fetch(
        "https://api.alexsama.tech/api/autism-test-question/" + id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ClerkId: user?.id,
          },
          body: body,
        }
      );
    } catch (err) {
      setError({
        message: err.message || "Failed to edit test question",
      });
    }
    setRefresh();
    setIsLoadingEdit(false);
    closeEditModel();
  }

  return (
    <>
      <div className="flex justify-between items-center my-2 ">
        <h1 className="mr-3 whitespace-nowrap">Question No {count} :</h1>
        <div className="flex w-full border h-20 py-2 px-2 rounded-md">
          <div className="flex items-center mx-2 w-1/2">
            <label className="text-nowrap">Question :</label>
            <p className="mx-3">{question[count - 1].question}</p>
          </div>
          <div className="flex items-center mx-2 w-1/2">
            <label className="text-nowrap">Description :</label>
            <p className="mx-3">{question[count - 1].description}</p>
          </div>
        </div>
        <button type="button" className="mx-2" onClick={openEditModel}>
          Edit
        </button>
        <button
          type="button"
          className="
      mx-2"
          onClick={handleDeleteAction}
        >
          Delete
        </button>
      </div>
      <dialog ref={editModel}>
        <form method="dialog">
          <h1 className="mt-2 mb-4 text-center bold">Edit Question</h1>
          <div className="p-3">
            <h1>Question No: {count}</h1>
          </div>
          <div className="p-3 flex justify-between">
            <label>Question :</label>
            <input
              className="border mx-2 ml-10 w-96"
              type="text"
              name="question"
              placeholder={question[count - 1].question}
              onChange={handleChange}
            />
          </div>
          <div className="p-3 flex justify-between">
            <label>Description :</label>
            <input
              className="border mx-2 ml-10 w-96"
              type="text"
              name="description"
              placeholder={question[count - 1].description}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-around m-4 ">
            <button type="submit" onClick={handleEditAction}>
              Edit
            </button>
            <button type="button" onClick={closeEditModel}>
              Close
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default ExistTestQuestion;

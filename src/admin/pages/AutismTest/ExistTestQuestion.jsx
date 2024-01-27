import axios from "axios";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

function ExistTestQuestion({ id, count, question, setRefresh }) {
  const { user } = useUser();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [error, setError] = useState("");

  const currentQuestionClient = axios.create({
    baseURL: "https://api.alexsama.tech/api/autism-test-question/",
    headers: {
      "Content-Type": "application/json",
      ClerkId: user?.id,
    },
  });

  async function handleDeleteAction() {
    setIsLoadingDelete(true);
    try {
      const response = await currentQuestionClient.delete(`${id}`);
    } catch (err) {
      setError({
        message: err.message || "Failed to delete test question",
      });
    }
  }
  async function handleEditAction() {}
  async function handleNewAction() {}

  //   (async () => {
  //     setIsLoadingQuestion(true);
  //     try {
  //       const response = await currentQuestionClient.get(`${id}`);
  //       setFetehedData(response.data.data);
  //     } catch (err) {
  //       setError({
  //         message: err.message || "Failed to fetch test question",
  //       });
  //     }
  //     setIsLoadingQuestion(false);
  //   })();

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
        <button type=" button" className="mx-2" onClick={handleEditAction}>
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
    </>
  );
}

export default ExistTestQuestion;

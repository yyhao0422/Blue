import { useEffect, useState, useRef } from "react";
import { useDeleteTestCategory } from "../../hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import ExistTestQuestion from "./ExistTestQuestion";

function ExistTest({ id, title, description, setRefresh }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [refresh, setRefreshQustion] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const editAutismTestDialog = useRef();
  const [isEditingContent, setisEditingContent] = useState(false);
  const { user } = useUser();
  const currentCategoryClient = axios.create({
    baseURL: `https://api.alexsama.tech/api/autism-test-category/`,
    headers: {
      "Content-Type": "application/json",
      ClerkId: user?.id,
    },
  });

  useEffect(() => {
    currentCategoryClient
      .get(`${id}`)
      .then((res) => {
        console.log(`refresh again`);
        setQuestions(res.data.data);
      })
      .catch((error) => {
        setError({
          message: error.message || "Failed to fetch test question",
        });
      });
  }, [refresh, user]);

  function handleEditTest() {}

  function handleClickEditTest() {
    editAutismTestDialog.current.showModal();
  }

  function closeEditFlashCard() {
    editAutismTestDialog.current.close();
    setisEditingContent(false);
  }

  async function handleDeleteTest(id) {
    setIsDeleting(true);
    try {
      await currentCategoryClient.delete(`${id}`);
    } catch (error) {
      setError({
        message: error.message || "Failed to delete test category",
      });
    }

    setIsDeleting(false);
    setRefresh();
  }

  return (
    <>
      <tr>
        <td className="p-2">{id}</td>
        <td className="p-2">{title}</td>
        <td className="p-2">{description}</td>
        <td>
          <button className="mx-2" onClick={handleClickEditTest}>
            Edit
          </button>
          <button className="mx-2" onClick={() => handleDeleteTest(id)}>
            Delete
          </button>
        </td>
      </tr>
      <dialog ref={editAutismTestDialog} className="p-3 rounded-lg">
        <h1 className="mt-2 mb-4">Autism Test</h1>
        <div className="flex justify-around mb-3">
          <h1
            className={`${!isEditingContent && "underline"} cursor-pointer`}
            onClick={() => {
              setisEditingContent(false);
            }}
          >
            Test Detail
          </h1>
          <h1
            className={`${isEditingContent && "underline"} cursor-pointer`}
            onClick={() => {
              setisEditingContent(true);
            }}
          >
            Test Content
          </h1>
        </div>
        <form method="dialog" onSubmit={handleEditTest}>
          {/*----------------- Card Detail ------------------------ */}
          {!isEditingContent && (
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <label>Title :</label>
                <input
                  type="text"
                  name="title"
                  className="m-2 border"
                  placeholder={title}
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <label>Description :</label>
                <input
                  type="text"
                  name="description"
                  className="m-2 border"
                  placeholder={description}
                  required
                />
              </div>
            </div>
          )}

          {isEditingContent &&
            questions.question.map((question, index) => (
              <ExistTestQuestion
                id={question.id}
                question={questions.question}
                count={index + 1}
                setRefresh={() => setRefreshQustion((prev) => !prev)}
              />
            ))}

          {/*----------------- Card Content ------------------------ */}
          <div className="flex justify-between m-3">
            {!isEditingContent && <button>Save</button>}
            <button type="button" onClick={closeEditFlashCard}>
              Close
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default ExistTest;

import { useEffect, useState, useRef } from "react";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { LoadingButton } from "@mui/lab";

import { useDeleteTestCategory } from "../../hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import ExistTestQuestion from "./ExistTestQuestion";

function ExistTest({ id, title, description, setRefresh }) {
  const newTitle = useRef();
  const newQuestion = useRef();
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
        setQuestions(res.data.data);
      })
      .catch((error) => {
        setError({
          message: error.message || "Failed to fetch test question",
        });
      });
  }, [refresh, user]);

  async function handleNewContent() {
    console.log("run");
    try {
      const body = JSON.stringify({
        question: newTitle.current.value,
        description: newQuestion.current.value,
      });
      const response = await fetch(
        "https://api.alexsama.tech/api/autism-test-question",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ClerkId: user?.id,
          },
          body: body,
        }
      );

      const resData = await response.json();

      const newQuestionId = resData.data.id;
      const prevQuestionId = questions.question.map((question) => question.id);

      const responseUpdateCategory = await fetch(
        "https://api.alexsama.tech/api/autism-test-category/" + id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ClerkId: user?.id,
          },
          body: JSON.stringify({
            title: title,
            description: description,
            autismTestQuestionIds: [...prevQuestionId, newQuestionId],
          }),
        }
      );
      console.log(responseUpdateCategory);
      setRefreshQustion((prev) => !prev);
    } catch (error) {
      console.log("err");
      setError({
        message: error.message || "Failed to add test question",
      });
    }
  }

  async function handleEditTest(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    const body = {
      title: data.title,
      description: data.description,
    };
    try {
      await currentCategoryClient.put(`${id}`, body);
    } catch (error) {
      setError({
        message: error.message || "Failed to edit test category",
      });
    }
    setRefresh();
  }

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
      <TableRow>
        <TableCell align="right" className="p-2">
          {id}
        </TableCell>
        <TableCell align="right" className="p-2">
          {title}
        </TableCell>
        <TableCell align="right" className="p-2">
          {description}
        </TableCell>
        <TableCell align="right">
          <button className="mx-2" onClick={handleClickEditTest}>
            Edit
          </button>
          <button className="mx-2" onClick={() => handleDeleteTest(id)}>
            Delete
          </button>
        </TableCell>
      </TableRow>
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

          {isEditingContent && (
            <>
              <div>
                {questions.question.map((question, index) => (
                  <ExistTestQuestion
                    id={question.id}
                    question={questions.question}
                    count={index + 1}
                    setRefresh={() => setRefreshQustion((prev) => !prev)}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center my-2">
                <h1 className="mr-3">New Question</h1>
                <div className="bg-cyan-300 py-1 px-2 rounded-md">
                  <label htmlFor="title">Question :</label>
                  <input
                    id="title"
                    ref={newTitle}
                    type="text"
                    className="m-2 border"
                    required
                  />
                  <label htmlFor="imageUrl">Description :</label>
                  <input
                    ref={newQuestion}
                    id="imageUrl"
                    type="text"
                    className="m-2 border"
                    required
                  />
                  <i
                    className="mx-2 cursor-pointer hover:bg-gray-300 rounded-[50px]"
                    onClick={handleNewContent}
                  >
                    <svg
                      width="40px"
                      height="40px"
                      viewBox="0 -0.5 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.5 12.5L10.167 17L19.5 8"
                        stroke="#000000"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </i>
                </div>
              </div>
            </>
          )}

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

import { useEffect, useState } from "react";
import { useDeleteTestCategory } from "../../hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

function ExistTest({ id, title, description, setRefresh }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();
  const currentCategoryClient = axios.create({
    baseURL: `https://api.alexsama.tech/api/autism-test-category/`,
    headers: {
      "Content-Type": "application/json",
      ClerkId: user?.id,
    },
  });

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
    <tr>
      <td className="p-2">{id}</td>
      <td className="p-2">{title}</td>
      <td className="p-2">{description}</td>
      <td>
        <button className="mx-2">Edit</button>
        <button className="mx-2" onClick={() => handleDeleteTest(id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default ExistTest;

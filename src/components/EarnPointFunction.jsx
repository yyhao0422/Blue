import { useEffect, useState } from "react";
import EarnPointSnackBar from "./EarnPointSnackBar";
import { useUser } from "@clerk/clerk-react";

const randomNumber = Math.floor(Math.random() * 3) + 1;
const points = randomNumber;

export function EarnPointFunction() {
  return <EarnPointSnackBar message={`You have earn ${points} points !`} />;
}

export const fetchUserDetailAndAddPoint = async (user) => {
  try {
    await fetch("https://api.alexsama.tech/api/users/points", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        clerkId: user?.id,
      },
      body: JSON.stringify({ points: points }),
    });
    const res = await fetch("https://api.alexsama.tech/api/users/details", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        clerkId: user?.id,
      },
    });
    if (!res.ok) throw new Error(data.message);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

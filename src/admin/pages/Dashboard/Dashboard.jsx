import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    setLoading(true);
    const headers = {
      ClerkId: user?.id,
      Accept: "application/json",
    };

    async function fetchData() {
      try {
        // Fetch statistics data
        const resVideoStatistic = await fetch(
          `https://api.alexsama.tech/api/video-statistic`,
          {
            headers,
          }
        );
        const resFeedback = await fetch(
          `https://api.alexsama.tech/api/feedback`,
          {
            headers,
          }
        );
        const resAiChat = await fetch(
          `https://api.alexsama.tech/api/ai-chat-statistic`,
          {
            headers,
          }
        );
        const resMiniGame = await fetch(
          `https://api.alexsama.tech/api/mini-game-statistic`,
          {
            headers,
          }
        );
        const resAutismTest = await fetch(
          `https://api.alexsama.tech/api/autism-test-statistic`,
          {
            headers,
          }
        );

        const videoData = await resVideoStatistic.json();
        const feedbackData = await resFeedback.json();
        const aiChatData = await resAiChat.json();
        const miniGameData = await resMiniGame.json();
        const autismTestData = await resAutismTest.json();
        console.log({
          videoData,
          feedbackData,
          aiChatData,
          miniGameData,
          autismTestData,
        });
      } catch (e) {
        setError(e);
      }
    }
    fetchData();

    setLoading(false);
  }, [user]);

  return (
    <div>
      <div className="p-5 ml-10">
        <Typography variant="h4">Hi ! Welcome Back ! </Typography>
      </div>
    </div>
  );
}

export default Dashboard;

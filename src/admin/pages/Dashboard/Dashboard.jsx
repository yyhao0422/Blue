import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card } from "@mui/material";
import { format } from "date-fns";
import { Backdrop, CircularProgress } from "@mui/material";
import { LineChart, Line } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import moment from "moment";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState({});
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
        setStatsData({
          videoData: videoData.data,
          feedbackData: feedbackData.data,
          aiChatData: aiChatData.data,
          miniGameData: miniGameData.data,
          autismTestData: autismTestData.data,
        });
      } catch (e) {
        setError(e);
      }
    }
    fetchData();

    setLoading(false);
  }, [user]);
  console.log(statsData);

  // Ai Chat Statistic
  let formattedDataAiChat = statsData.aiChatData
    ? statsData.aiChatData.map((item) => ({
        ...item,
        created_at: format(new Date(item.created_at), "yyyy-MM-dd"),
      }))
    : [];

  let aggregatedDataAiChat = formattedDataAiChat.reduce((acc, item) => {
    let existingItem = acc.find((i) => i.created_at === item.created_at);

    if (existingItem) {
      existingItem.chatCount += item.chatCount;
    } else {
      acc.push(item);
    }
    return acc;
  }, []);

  // Autisim Test Statistic
  let formattedDataAutismTest = statsData.autismTestData
    ? statsData.autismTestData.map((item) => ({
        ...item,
        created_at: format(new Date(item.created_at), "yyyy-MM-dd"),
      }))
    : [];

  let aggregatedDataAutismTest = formattedDataAutismTest
    .reduce((acc, item) => {
      let existingItem = acc.find((i) => i.autismTestId === item.autismTestId);

      if (existingItem) {
        existingItem.score += item.score;
        existingItem.count += 1;
      } else {
        item.count = 1;
        acc.push(item);
      }

      return acc;
    }, [])
    .map((item) => ({
      ...item,
      averageScore: item.score / item.count,
    }));

  // User Feedback Statistic

  let feedbackData = statsData.feedbackData || [];
  // Initialize score counts
  let scoreCountsSatisfaction = Array(5).fill(0);
  let scoreCountsBenefiting = Array(2).fill(0);

  // Count scores
  feedbackData.forEach((feedback) => {
    scoreCountsSatisfaction[feedback.userSatisfactionScore - 1]++;
    scoreCountsBenefiting[feedback.userDeclaredBenefiting]++;
  });

  // Calculate percentages
  let totalScoresSatisfaction = feedbackData.length;
  let totalScoresBenefiting = feedbackData.length;

  let scoreDistributionDataSatisfaction = scoreCountsSatisfaction.map(
    (count, index) => ({
      score: index + 1,
      percentage: (count / totalScoresSatisfaction) * 100,
    })
  );

  let scoreDistributionDataBenefiting = scoreCountsBenefiting.map(
    (count, index) => ({
      score: index,
      percentage: (count / totalScoresBenefiting) * 100,
    })
  );
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Mini Game Statistic
  let gameData = statsData.miniGameData || [];

  // Format the dates and sort the data by date

  let formattedGameData = gameData
    .map((item) => ({
      ...item,
      created_at: moment(item.created_at).format("YYYY-MM-DD"),
    }))
    .reduce((acc, game) => {
      let existing = acc.find((item) => item.created_at === game.created_at);
      if (existing) {
        existing.playCount += game.playCount;
      } else {
        acc.push({ created_at: game.created_at, playCount: game.playCount });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  // Video Statistic

  let videoData = statsData.videoData || [];
  let totalVideoViews = videoData.reduce(
    (total, video) => total + video.viewCount,
    0
  );

  return (
    <>
      {loading && (
        <>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      )}
      {!loading && (
        <div>
          <div className="p-5 ml-10">
            <div className="mb-8">
              <Typography variant="h4">Hi ! Welcome Back ! </Typography>
            </div>
            <div className="flex flex-wrap gap-6">
              <Card className="py-3 " sx={{ backgroundColor: "#FFE6E6" }}>
                <h1 className="text-center p-5 font-medium text-3xl ">
                  Total Number of User Feedback
                </h1>
                <div className="flex justify-center items-center w-full mb-3">
                  <Typography variant="h1">{feedbackData.length}</Typography>
                </div>
                <br />
                <hr className="bg-white h-3 rounded-md" />
                <h1 className="text-center p-5 font-medium text-3xl ">
                  Total Number of Video Views
                </h1>
                <div className="flex justify-center items-center w-full">
                  <Typography variant="h1">{totalVideoViews}</Typography>
                </div>
              </Card>
              <Card className="p-3 " sx={{ backgroundColor: "#FFE6E6" }}>
                <h1 className="text-center p-5 font-medium text-lg ">
                  Number of Chat with AI Autism therapist
                </h1>
                <BarChart width={500} height={300} data={aggregatedDataAiChat}>
                  <XAxis dataKey="created_at" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="chatCount" fill="#8884d8" />
                </BarChart>
              </Card>
              <Card className="p-3 " sx={{ backgroundColor: "#E6E6FF" }}>
                <h1 className="text-center p-5 font-medium text-lg ">
                  Average Score of Different Autism Test
                </h1>
                <LineChart
                  width={500}
                  height={300}
                  data={aggregatedDataAutismTest}
                >
                  <XAxis dataKey="autismTestId" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="averageScore"
                    stroke="#8884d8"
                  />
                </LineChart>
              </Card>
              <Card className="p-3 " sx={{ backgroundColor: "#E6FFE6" }}>
                <h1 className="text-center p-5 font-medium text-lg ">
                  User Satisfaction Score Distribution
                </h1>

                <PieChart width={400} height={400}>
                  <Pie
                    dataKey="percentage"
                    isAnimationActive={false}
                    data={scoreDistributionDataSatisfaction}
                    cx={200}
                    cy={200}
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name }) =>
                      name === 0
                        ? "1 Star"
                        : name === 1
                        ? "2 Star"
                        : name === 2
                        ? "3 Star:"
                        : name === 3
                        ? "4 Star"
                        : "5 Star"
                    }
                  >
                    {scoreDistributionDataSatisfaction.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Card>
              <Card className="p-3 " sx={{ backgroundColor: "#E6E6FF" }}>
                <h1 className="text-center p-5 font-medium text-lg ">
                  User Declared Benefiting Score Distribution
                </h1>

                <PieChart width={400} height={400}>
                  <Pie
                    dataKey="percentage"
                    isAnimationActive={false}
                    data={scoreDistributionDataBenefiting}
                    cx={200}
                    cy={200}
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name }) =>
                      name === 0 ? "Not Benefit" : "Benefit"
                    }
                  >
                    {scoreDistributionDataBenefiting.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Card>
              <Card className="p-3 " sx={{ backgroundColor: "#E6E6FF" }}>
                <h1 className="text-center p-5 font-medium text-lg ">
                  Mini Game Play Count Over Time
                </h1>

                <LineChart
                  width={500}
                  height={300}
                  data={formattedGameData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="created_at" />
                  <YAxis dataKey="playCount" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="playCount"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;

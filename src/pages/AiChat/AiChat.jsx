import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { TypeAnimation } from "react-type-animation";
import {
  EarnPointFunction,
  fetchUserDetailAndAddPoint,
} from "../../components/EarnPointFunction";

import {
  ChatContainer,
  MessageList,
  MessageInput,
  MainContainer,
  TypingIndicator,
  Message,
} from "@chatscope/chat-ui-kit-react";
import { Typography } from "@mui/material";
import botAvatar from "./bot.png";

const API_KEY = "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";

export default function AiChat() {
  const { isLoaded, user, isSignedIn } = useUser();
  const [isTyping, setIsTyping] = useState(false);
  const [isEarnPoint, setIsEarnPoint] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, how can I help you today?",
      sender: "ChatGPT",
    },
  ]);

  if (!isLoaded) {
    // handle loading state
    return <p>loading</p>;
  }

  if (!isSignedIn) {
    // handle not signed in state
    return <p>Please sign in to use this page </p>;
  }
  async function postAiChatStats(userId) {
    try {
      const response = await fetch(
        "https://api.alexsama.tech/api/ai-chat-statistic",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            clerkId: user?.id,
          },
          body: JSON.stringify({
            chatCount: 1,
            userId: userId,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];

    // update our messages state
    setMessages(newMessages);

    // set a typing indicator
    setIsTyping(true);
    // send the message to the ChatGBT
    await processMessageToChatGPT(newMessages);

    // Earn point
    setIsEarnPoint(true);
    const data = await fetchUserDetailAndAddPoint(user);

    await postAiChatStats(data.data.id);

    setTimeout(() => {
      setIsEarnPoint(false);
    }, 5000);
  };

  async function processMessageToChatGPT(chatMessage) {
    let apiMessages = chatMessage.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return {
        role: role,
        content: messageObject.message,
      };
    });

    // Define how the system going to talk
    const systemMessage = {
      role: "system",
      content:
        "Act as a autism therapist, explain all the things in a simple way, and be friendly.",
    };

    let apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.choices[0].message.content);
        setMessages([
          ...chatMessage,
          { message: data.choices[0].message.content, sender: "ChatGPT" },
        ]);
        setIsTyping(false);
      });
  }

  return (
    <>
      {isEarnPoint && <EarnPointFunction />}
      <motion.div
        initial={{ opacity: 0 }}
        transition={{ delay: 0.5 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="App m-auto h-[500px] w-[700px] transition-all duration-500  "
      >
        <Typography
          variant="h3"
          className="dark:text-white"
          sx={{ marginBottom: "10px" }}
        >
          Chat with AI Autism therapist
        </Typography>
        <div className="relative h-full w-full">
          <MainContainer>
            <ChatContainer>
              <MessageList
                typingIndicator={
                  isTyping ? (
                    <TypingIndicator content="ChatGPT is typing" />
                  ) : null
                }
              >
                {messages.map((message, i) => {
                  return (
                    <div className="flex p-3" key={i}>
                      {message.sender === "ChatGPT" ? (
                        <>
                          <img
                            className="w-10 h-[42.49px] mr-3"
                            src={botAvatar}
                            alt="Bot Avatar"
                          />
                          <section
                            aria-label="ChatGPT"
                            class="cs-message"
                            data-cs-message=""
                          >
                            <div class="cs-message__content-wrapper">
                              <div class="cs-message__content">
                                <div class="cs-message__html-content">
                                  <TypeAnimation
                                    sequence={[message.message]}
                                    speed={70}
                                    cursor={false}
                                  />
                                </div>
                              </div>
                            </div>
                          </section>
                        </>
                      ) : (
                        <>
                          <section
                            aria-label="user"
                            class="cs-message cs-message--outgoing"
                            data-cs-message=""
                          >
                            <div class="cs-message__content-wrapper">
                              <div class="cs-message__content">
                                {message.message}
                              </div>
                            </div>
                          </section>
                          <img
                            src={user?.imageUrl}
                            alt="user profile pic"
                            className="w-10 rounded-[100px] ml-3"
                          />
                        </>
                      )}
                    </div>
                  );
                })}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                onSend={handleSend}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </motion.div>
    </>
  );
}

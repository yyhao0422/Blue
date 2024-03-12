import React from "react";
import HeroParallex from "./components/HeroParallex";
import GoogleGemeniEffect from "./components/GoogleGemeniEffect";
import FlashCardAnimation from "./components/FlashCardAnimation";
import { useScroll, useTransform } from "framer-motion";
import { Footer } from "./components/Footer";

export default function Home() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);
  return (
    <div className="flex flex-col">
      <HeroParallex
        products={[
          {
            title: "Badge",
            link: "https://autism.yunghao.link",
            thumbnail:
              "https://api.alexsama.tech/storage/Images/WeGFPfEk1XR7k2X9XRHtaUgs8T96vszZQN51qU2A.png",
          },
          {
            title: "Flash Card",
            link: "https://autism.yunghao.link",
            thumbnail:
              "https://api.alexsama.tech/storage/Images/wZzmvgdMqg6hEo3f8DLR2PiizKTkhpLJpBkNPN3v.png",
          },
          {
            title: "Video",
            link: "https://autism.yunghao.link",
            thumbnail:
              "https://api.alexsama.tech/storage/Images/trTbtOBNNbNgj8zCmMpqtL7fVlqdZSPp6j78V9dS.png",
          },
          {
            title: "Flash Card",
            link: "https://autism.yunghao.link",
            thumbnail:
              "https://api.alexsama.tech/storage/Images/6Jo6fmyk6QRXprUpL47zP8VOztZ86HCYSzROPafE.png",
          },
          {
            title: "Badge",
            link: "https://autism.yunghao.link",
            thumbnail:
              "https://api.alexsama.tech/storage/Images/CGmeh0RllOF7trzwx2c9BFKJmRIjfAvsH81p6GVv.png",
          },
          {
            title: "Mini Game",
            link: "https://autism.yunghao.link",
            thumbnail:
              "https://api.alexsama.tech/storage/Images/AAtKaV5QlhEwdz7iGb7ZV4aRJILZPgcwbBPsuSiv.pngg",
          },
          {
            title: "Flash Card",
            link: "https://autism.yunghao.link",
            thumbnail:
              "https://api.alexsama.tech/storage/Images/NbrgxbUO4yTrJ4ECSPiz3ciJNUAg5jDvLsxtsoP1.png",
          },
          {
            title: "Aceternity UI",
            link: "https://autism.yunghao.link",
            thumbnail:
              "https://api.alexsama.tech/storage/Images/rrEdRYW6c2x1EDyexYZjNKuehjzFmWetS5RjGiqx.png",
          },
          {
            title: "Tic Tac Toe",
            link: "https://autism.yunghao.link",
            thumbnail:
              "https://api.alexsama.tech/storage/Images/DDjyvkOE3xrcL99CcOaR6pPJknxG1iJRf78ivVxj.png",
          },
          {
            title: "Tic Tac Toe",
            link: "https://autism.yunghao.link",
            thumbnail:
              "https://api.alexsama.tech/storage/Images/BIDu5QZXvWz7gIAXJiENuV65iksHVyhMF9ic020B.png",
          },
          {
            title: "Ai Chatbot",
            link: "https://autism.yunghao.link",
            thumbnail:
              "https://api.alexsama.tech/storage/Images/A98KPHqERej8FOG9Tygh4sr4WJFOhyxVOEGQJBa8.png",
          },
          {
            title: "Feedback",
            link: "https://autism.yunghao.link",
            thumbnail:
              "https://api.alexsama.tech/storage/Images/X7zGEwzJ1eZjD7UsBTEHVUzjc5myIIi4mpEIjQX9.png",
          },
          {
            title: "Ai Chatbot",
            link: "https://autism.yunghao.link",
            thumbnail:
              "https://api.alexsama.tech/storage/Images/b4Kc68I0R3shldo4Nb82vaxuGV4rFe0P2hwTQPAV.png",
          },
          {
            title: "Ai Chatbot",
            link: "https://autism.yunghao.link",
            thumbnail:
              "https://api.alexsama.tech/storage/Images/K96XOtkms50VR2EXlR533oy8oVZtanALs9UR7BFR.png",
          },
          {
            title: "Feedback",
            link: "https://autism.yunghao.link",
            thumbnail:
              "https://api.alexsama.tech/storage/Images/Ft4uo8an6FTUwXmPBnRpgMxyb9h0ZoakQ0OnZMg4.png",
          },
        ]}
      />
      <div
        className="h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative  pt-40 overflow-clip"
        ref={ref}
      >
        <GoogleGemeniEffect
          title="Build the connection"
          description="Re-Invent the connection with autism. Provide the best learning experience."
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
        />
      </div>
      <div className="flex flex-col overflow-hidden">
        <FlashCardAnimation
          users={users}
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white">
                Boost the memory with <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                  Flash Cards
                </span>
              </h1>
            </>
          }
        />
      </div>
      <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-500  text-center font-sans font-bold">
            Sign Up Now
          </h1>
          <p></p>
          <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
            Swap left to sign up or login ! See you on the other side.
          </p>
        </div>
      </div>
    </div>
  );
}

export const users = [
  {
    name: "Animal",
    designation: "Wildlife Photographer",
    image:
      "https://th.bing.com/th/id/OIP.2s5ozWcnfWH-uVmfw0KSgwHaGt?rs=1&pid=ImgDetMain",
    badge: "Nature",
  },
  {
    name: "Sarah Singh",
    designation: "Founder, Sarah's Kitchen",
    image: "https://picsum.photos/id/11/300/300",
    badge: "Mentor",
  },
  {
    name: "John Doe",
    designation: "Software Engineer, Tech Corp",
    image: "https://picsum.photos/id/12/300/300",
    badge: "Mentor",
  },
  {
    name: "Jane Smith",
    designation: "Product Manager, Innovate Inc",
    image: "https://picsum.photos/id/13/300/300",
    badge: "Mentor",
  },
  {
    name: "Robert Johnson",
    designation: "Data Scientist, DataWorks",
    image: "https://picsum.photos/id/14/300/300",
    badge: "Mentor",
  },
  {
    name: "Emily Davis",
    designation: "UX Designer, DesignHub",
    image: "https://picsum.photos/id/15/300/300",
    badge: "Mentor",
  },
  {
    name: "Michael Miller",
    designation: "CTO, FutureTech",
    image: "https://picsum.photos/id/16/300/300",
    badge: "Mentor",
  },
  {
    name: "Sarah Brown",
    designation: "CEO, StartUp",
    image: "https://picsum.photos/id/17/300/300",
  },
  {
    name: "James Wilson",
    designation: "DevOps Engineer, CloudNet",
    image: "https://picsum.photos/id/18/300/300",
    badge: "Something",
  },
  {
    name: "Patricia Moore",
    designation: "Marketing Manager, MarketGrowth",
    image: "https://picsum.photos/id/19/300/300",
    badge: "Mentor",
  },
  {
    name: "Richard Taylor",
    designation: "Frontend Developer, WebSolutions",
    image: "https://picsum.photos/id/20/300/300",
  },
  {
    name: "Linda Anderson",
    designation: "Backend Developer, ServerSecure",
    image: "https://picsum.photos/id/21/300/300",
  },
  {
    name: "William Thomas",
    designation: "Full Stack Developer, FullStack",
    image: "https://picsum.photos/id/22/300/300",
    badge: "Badger",
  },
  {
    name: "Elizabeth Jackson",
    designation: "Project Manager, ProManage",
    image: "https://picsum.photos/id/23/300/300",
    badge: "Mentor",
  },
  {
    name: "David White",
    designation: "Database Administrator, DataSafe",
    image: "https://picsum.photos/id/24/300/300",
    badge: "Advocate",
  },
  {
    name: "Jennifer Harris",
    designation: "Network Engineer, NetConnect",
    image: "https://picsum.photos/id/25/300/300",
  },
  {
    name: "Charles Clark",
    designation: "Security Analyst, SecureIT",
    image: "https://picsum.photos/id/26/300/300",
  },
  {
    name: "Susan Lewis",
    designation: "Systems Analyst, SysAnalyse",
    image: "https://picsum.photos/id/27/300/300",
  },
  {
    name: "Joseph Young",
    designation: "Mobile Developer, AppDev",
    image: "https://picsum.photos/id/28/300/300",
    badge: "Mentor",
  },
  {
    name: "Margaret Hall",
    designation: "Quality Assurance, BugFree",
    image: "https://picsum.photos/id/29/300/300",
    badge: "Developer",
  },
];

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import _ from "underscore";
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  forkJoin,
  from,
  map,
  switchMap,
} from "rxjs";
import {
  fetchUserDetailAndAddPoint,
  EarnPointFunction,
} from "../../components/EarnPointFunction";

export default function Video() {
  const { isSignedIn, user } = useUser();
  const [earnPoint, setEarnPoint] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSelectedCarousel, setCurrentSelectedCarousel] = useState(0);
  const [selectedCategoryId, _setSelectedCategoryId] = useState(0);
  const setSelectedCategoryId = (value) => {
    _setSelectedCategoryId(value);
    selectedCategoryId$.next(value);
  };

  const [searchTitle, _setSearchTitle] = useState("");
  const setSearchTitle = (value) => {
    _setSearchTitle(value);
    searchTitle$.next(value);
  };

  const selectedCategoryId$ = useRef(new BehaviorSubject(0)).current;
  const searchTitle$ = useRef(new BehaviorSubject("")).current;

  const [videoCategories, setVideoCategories] = useState([]);
  const [latestVideos, setLatestVideos] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (isSignedIn) {
      const headers = {
        "Content-Type": "application/json",
        ClerkId: user.id,
      };

      const fetchVidCategories = () => {
        return from(
          fetch("https://api.alexsama.tech/api/video-category", {
            headers,
          }).then((res) => res.json())
        );
      };

      const fetchVideos = () => {
        return from(
          fetch("https://api.alexsama.tech/api/video", {
            headers,
          }).then((res) => res.json())
        );
      };

      const apiSub = forkJoin([fetchVidCategories(), fetchVideos()]).subscribe(
        ([vidCategoryRes, vidRes]) => {
          setVideoCategories(vidCategoryRes.data);
          setVideos(vidRes.data);
          setLatestVideos(_.first(vidRes.data, 3));
          setIsLoading(false);
        }
      );

      const querySub = combineLatest([selectedCategoryId$, searchTitle$])
        .pipe(
          debounceTime(800),
          switchMap(([categoryId, title]) =>
            fetchVideos().pipe(
              map((res) =>
                res.data.filter(
                  (video) =>
                    (categoryId === 0 ||
                      video.videoCategoryId === categoryId) &&
                    (title === "" ||
                      video.title.toLowerCase().includes(title.toLowerCase()))
                )
              )
            )
          )
        )
        .subscribe((videos) => {
          setVideos(videos);
        });

      return () => {
        apiSub.unsubscribe();
        querySub.unsubscribe();
      };
    }
  }, [isSignedIn, user, searchTitle$, selectedCategoryId$]);

  const getThumbnail = (youtubeUrl) => {
    const videoId = youtubeUrl.split("v=")[1];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const onLeftCarouselClick = () => {
    setCurrentSelectedCarousel((prev) =>
      prev === 0 ? latestVideos.length - 1 : prev - 1
    );
  };

  const onRightCarouselClick = () => {
    setCurrentSelectedCarousel((prev) =>
      prev === latestVideos.length - 1 ? 0 : prev + 1
    );
  };
  const onPlayBtnClick = (youtubeUrl, videoId) => {
    window.open(youtubeUrl, "_blank");
    setEarnPoint(true);
    fetchUserDetailAndAddPoint(user);
    setTimeout(() => {
      setEarnPoint(false);
    }, 5000);
    async function postVideoStats() {
      fetch("https://api.alexsama.tech/api/video-statistic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ClerkId: user.id,
        },
        body: JSON.stringify({
          videoId: videoId,
          viewCount: 1,
        }),
      });
    }
    postVideoStats();
  };

  const onCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
  };

  const onSearchTitleChange = (e) => {
    setSearchTitle(e.target.value);
  };

  const clearSelection = () => {
    setSelectedCategoryId(0);
    setSearchTitle("");
  };

  return isSignedIn ? (
    !isLoading ? (
      <>
        <div className="flex flex-col upper-part bg-gradient-to-b bg-gradient-to-b from-black via-slate-800 to-black w-full gap-5">
          <div className="bg-red-600 text-white text-right px-10">
            Viewer discretion is advised; it is recommended that you watch this
            content under the supervision of a guardian.
          </div>
          <div className="flex items-center justify-center main-box-shadow">
            <div className="absolute z-10 mt-[300px]">
              <div className="text-4xl font-bold text-white text-right">
                WATCH NOW
              </div>
              <div className="text-3xl text-white text-right line-clamp-1 w-[700px]">
                {latestVideos[currentSelectedCarousel].title}
              </div>
            </div>
            <ArrowCircleLeftIcon
              className="text-white !text-7xl mr-[-30px] z-10 cursor-pointer"
              onClick={onLeftCarouselClick}
            />
            <img
              className="h-[400px] cursor-pointer"
              src={getThumbnail(latestVideos[currentSelectedCarousel].videoUrl)}
              alt={latestVideos[currentSelectedCarousel].title}
              onClick={() =>
                onPlayBtnClick(
                  latestVideos[currentSelectedCarousel].videoUrl,
                  latestVideos[currentSelectedCarousel].id
                )
              }
            />
            <ArrowCircleRightIcon
              className="text-white !text-7xl ml-[-30px] z-10 cursor-pointer"
              onClick={onRightCarouselClick}
            />
          </div>
          <div className="flex items-center justify-end gap-x-5 mr-10">
            <FormControl>
              <InputLabel id="category-filter-select">
                Select Category
              </InputLabel>
              <Select
                className="bg-gray-300 w-[250px]"
                label="Select Category"
                labelId="category-filter-select"
                value={selectedCategoryId}
                onChange={onCategoryChange}
              >
                {videoCategories.map((category, idx) => (
                  <MenuItem key={`cat-${idx}`} value={category.id}>
                    {category.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              className="bg-gray-300 w-[400px]"
              label="Search Title"
              color="warning"
              value={searchTitle}
              onChange={onSearchTitleChange}
            />
            <CancelIcon
              className="text-white !text-4xl cursor-pointer"
              onClick={clearSelection}
            />
          </div>
          <div className="grid gap-4 grid-cols-4 2xl:grid-cols-5 mx-3">
            {videos.map((video, idx) => (
              <div
                className="flex flex-col h-[400px] bg-slate-600"
                key={`vid-${idx}`}
              >
                <div
                  className="flex justify-center items-center h-[180px] mb-[-190px] z-10 upper-layout-img w-full"
                  onClick={() => onPlayBtnClick(video.videoUrl, video.id)}
                >
                  <PlayCircleOutlineIcon className="text-white hover:text-sky-400 !text-7xl cursor-pointer" />
                </div>
                <img
                  className="h-[190px] w-full"
                  src={getThumbnail(video.videoUrl)}
                  alt="Rick Astley - Never Gonna Give You Up"
                />
                <div className="item-content px-3 py-2">
                  <div className="text-white font-bold text-3xl uppercase line-clamp-2">
                    EPISODE: {video.title}
                  </div>
                  <div className="text-white font-light text-xs line-clamp-3 mt-2">
                    Content: {video.description}
                  </div>
                </div>
                <div className="flex justify-center items-center font-bold mt-auto ml-auto h-[50px] w-[150px] bg-red-500 text-white">
                  WATCH NOW
                </div>
              </div>
            ))}
          </div>
        </div>
        {earnPoint && <EarnPointFunction />}
      </>
    ) : (
      <div>Loading...</div>
    )
  ) : (
    <div>Please login to continue</div>
  );
}

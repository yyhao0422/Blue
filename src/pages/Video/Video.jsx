import { Component } from "react";
import ShimmerLoader from "../../images/shimmer-loader.gif";

export default class Video extends Component {
  state = {
    categories: [
      {
        name: "Chapter 1",
        difficulty: "Easy"
      },
      {
        name: "Chapter 2",
        difficulty: "Intermediate"
      },
      {
        name: "Chapter 3",
        difficulty: "Challenging"
      },
      {
        name: "Chapter 4",
        difficulty: "Hard"
      }
    ],
    videos: [
      {
        category: "Chapter 1",
        link: "https://www.youtube.com/embed/gS5GuGE_kK8"
      },
      {
        category: "Chapter 1",
        link: "https://www.youtube.com/embed/4XIojdi2VZ4"
      },
      {
        category: "Chapter 1",
        link: "https://www.youtube.com/embed/ON5UiXqOgL4"
      },
      {
        category: "Chapter 1",
        link: "https://www.youtube.com/embed/RAc6a3yUsAw"
      },
      {
        category: "Chapter 2",
        link: "https://www.youtube.com/embed/UgMB9l_iMJA"
      },
      {
        category: "Chapter 2",
        link: "https://www.youtube.com/embed/PKgvOcjJJjA"
      },
      {
        category: "Chapter 2",
        link: "https://www.youtube.com/embed/86R0bTBuxYo"
      },
      {
        category: "Chapter 3",
        link: "https://www.youtube.com/embed/rPDxXfL8Qg4"
      },
      {
        category: "Chapter 3",
        link: "https://www.youtube.com/embed/1s9fTDbM9f0"
      },
      {
        category: "Chapter 3",
        link: "https://www.youtube.com/embed/4YffxlyRTls"
      },
      {
        category: "Chapter 4",
        link: "https://www.youtube.com/embed/8tiKF5CQHNQ"
      },
      {
        category: "Chapter 4",
        link: "https://www.youtube.com/embed/1-zZ4OGBZXs"
      }
    ]
  }

  render() {
    return (
      <div className="flex flex-col space-y-14 w-full overflow-x-hidden bg-cyan-300">
        {
          this.state.categories.map((cat) => {
            var videos = this.state.videos.filter(vid => vid.category === cat.name);
            if (videos.length > 0)
              return (
                <div className="bg-slate-400 pl-10 pt-5" key={cat.name}>
                  <div className="text-5xl">{cat.name}</div>
                  <div className="text-xl mt-3">Level: {cat.difficulty}</div>
                  <div className="flex space-x-5 overflow-x-auto mt-5">
                    {
                      videos.map((vid) => (
                        <iframe className="min-w-0 shrink-0"
                          key={vid.link}
                          style={{ backgroundImage: `url(${ShimmerLoader})` }}
                          title={vid.category}
                          width="500"
                          height="300"
                          src={vid.link}
                          allowFullScreen />
                      ))
                    }
                  </div>
                </div>
              )
          }
          )
        }
      </div>
    )
  }

}

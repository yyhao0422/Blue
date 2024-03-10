import { faSadTear, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { useUser } from "@clerk/clerk-react";
import { forkJoin, from } from "rxjs";
import _ from "underscore";

export default function Badge() {
    const { isSignedIn, user } = useUser();
    const [userPoints, setUserPoints] = useState(0);
    const [badges, setBadges] = useState([]);
    const [selectedBadgeIdToUnlock, setSelectedBadgeIdToUnlock] = useState(0);
    const [unlockedBadgeIds, setUnlockedBadgeIds] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [loadingDialogOpen, setLoadingDialogOpen] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);

    const unlockBadge = (badgeId) => {
        setLoadingDialogOpen(true);

        if (userPoints < 5) {
            setErrorDialogOpen(true);
            setLoadingDialogOpen(false);
            return;
        }

        const headers = {
            "Content-Type": "application/json",
            ClerkId: user.id,
        };

        const fetchBadges = () => {
            return from(
                fetch("https://api.alexsama.tech/api/users/badges", {
                    headers
                }).then(res => res.json())
            )
        }

        const fetchUserDetails = () => {
            return from(
                fetch("https://api.alexsama.tech/api/users/details", {
                    headers
                }).then(res => res.json())
            )
        }

        fetch("https://api.alexsama.tech/api/users/badge-unlock", {
            method: "POST",
            headers,
            body: JSON.stringify({
                badgeId: badgeId
            })
        }).then(res => {
            const apiQuery = forkJoin([fetchBadges(), fetchUserDetails()]).subscribe(([unlockedBagesRes, userDetailRes]) => {
                setUnlockedBadgeIds(unlockedBagesRes.data)
                setUserPoints(userDetailRes.data.points)
                setSelectedBadgeIdToUnlock(badgeId)
                setDialogOpen(true)
                setLoadingDialogOpen(false)
            })
            return () => apiQuery.unsubscribe();
        })
    }

    useEffect(() => {
        if (isSignedIn) {
            const headers = {
                "Content-Type": "application/json",
                ClerkId: user.id,
            };

            const fetchUserDetails = () => {
                return from(
                    fetch("https://api.alexsama.tech/api/users/details", {
                        headers
                    }).then(res => res.json())
                )
            }

            const fetchBadges = () => {
                return from(
                    fetch("https://api.alexsama.tech/api/badges", {
                        headers
                    }).then(res => res.json())
                )
            }

            const fetchUnlockedBadges = () => {
                return from(
                    fetch("https://api.alexsama.tech/api/users/badges", {
                        headers
                    }).then(res => res.json())
                )
            }

            const apiSub = forkJoin([fetchUserDetails(),
            fetchUnlockedBadges(),
            fetchBadges()
            ]).subscribe(([userDetailRes, unlockedBagesRes, badgesRes]) => {
                setUserPoints(userDetailRes.data.points)
                setBadges(badgesRes.data)
                setUnlockedBadgeIds(unlockedBagesRes.data)
                setLoadingDialogOpen(false)
            })

            return () => {
                apiSub.unsubscribe();
            }
        }
    }, [isSignedIn, user])

    return (
        <Fragment>
            {
                isSignedIn ? (
                    <div className="flex flex-col pt-5 w-full">
                        <div className="text-5xl text-center text-white">REWARDS (AVAILABLE POINTS: {userPoints})</div>
                        <div className="grid grid-cols-4 gap-5 p-10 w-full">
                            {
                                badges.map((badge, idx) => (
                                    unlockedBadgeIds.includes(badge.id) ?
                                        (
                                            <div className="h-[600px] bg-white border-[40px] border-red-500" key={`badge-${idx}`}>
                                                <div className="flex justify-between items-center mt-[-40px] h-[40px]">
                                                    <div className="text-white font-bold text-xl w-[200px] text-ellipsis whitespace-nowrap overflow-hidden">PIZZA BOI</div>
                                                    <div className="flex gap-3 text-white">
                                                        {
                                                            _.times(badge.starCount, (i) => (
                                                                <FontAwesomeIcon icon={faStar} key={`star-${i}`} />
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                                <div className="inner-card-content flex flex-col items-center border border-black h-full w-full bg-gray-100">
                                                    <img src={badge.imageUrl}
                                                        alt={badge.title}
                                                        className="h-[300px] w-full" />
                                                    <div className="flex justify-between p-3 w-full text-xl text-white bg-red-400">
                                                        <span>{badge.title}</span>
                                                        <div className="flex items-center px-5 border border-white bg-red-500">
                                                            {badge.rarity}
                                                        </div>
                                                    </div>
                                                    <div className="grow w-full text-sm p-3 leading-4 overflow-hidden bg-yellow-100">
                                                        {badge.description}
                                                    </div>
                                                </div>
                                            </div>
                                        ) :
                                        (
                                            <div key={`badge-${idx}`} className="flex flex-col gap-5 justify-center items-center h-[600px] bg-black text-white border-4 border-white">
                                                <span className="text-5xl">???</span>
                                                <button onClick={() => unlockBadge(badge.id)} className="p-5 border border-white">UNLOCK NOW</button>
                                                <span className="text-center text-white">POINTERS NEEDED: 5</span>
                                            </div>
                                        )
                                ))
                            }
                        </div>
                    </div>
                ) : <div>Please login to continue</div>

            }
            <Confetti active={dialogOpen} />
            <Dialog open={errorDialogOpen}>
                <div className="h-[450px] w-[500px] flex flex-col items-center gap-10">
                    <div className="p-10 text-center bg-red-100 w-full">
                        <FontAwesomeIcon className="text-red-500 text-7xl" icon={faSadTear} />
                    </div>
                    <div className="text-3xl">Not enough points</div>
                    <button className="p-5 mt-auto bg-red-500 text-xl text-white w-full" onClick={() => setErrorDialogOpen(false)}>CONFIRM</button>
                </div>
            </Dialog>
            <Dialog open={loadingDialogOpen}>
                <div className="p-[50px] text-3xl">Loading Please wait...</div>
            </Dialog>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                {
                    dialogOpen && (() => {
                        const selectedBadge = _.find(badges, (badge) => badge.id === selectedBadgeIdToUnlock)
                        return (
                            <div className="h-[600px] w-[420px] bg-white border-[40px] border-red-500">
                                <div className="flex justify-between items-center mt-[-40px] h-[40px]">
                                    <div className="text-white font-bold text-xl w-[200px] text-ellipsis whitespace-nowrap overflow-hidden">{selectedBadge.title}</div>
                                    <div className="flex gap-3 text-white">
                                        {
                                            _.times(selectedBadge.starCount, (i) => (
                                                <FontAwesomeIcon icon={faStar} key={`star-${i}`} />
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="inner-card-content flex flex-col items-center border border-black h-full w-full bg-gray-100">
                                    <img src={selectedBadge.imageUrl}
                                        alt={selectedBadge.title}
                                        className="h-[300px] w-full" />
                                    <div className="flex justify-between p-3 w-full text-xl text-white bg-red-400">
                                        <span>{selectedBadge.title}</span>
                                        <div className="px-5 border border-white bg-red-500">
                                            {selectedBadge.rarity}
                                        </div>
                                    </div>
                                    <div className="w-full grow text-sm p-3 leading-4 overflow-hidden bg-yellow-100">
                                        {selectedBadge.description}
                                    </div>
                                    <div className="mt-auto w-full text-center bg-black text-white">
                                        NEW CARD UNLOCKED
                                    </div>
                                </div>
                            </div>
                        )
                    })()
                }
            </Dialog>
        </Fragment>
    )
}
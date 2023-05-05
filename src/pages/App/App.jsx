import React, { useEffect, useRef, useState } from "react";
import { getUser } from "../../utilities/users/users-service";
import { sendRequest } from "../../utilities/users/send-request";
import "./App.css";
import NavBar from "../../components/NavBar/NavBar";
import AuthPage from "../AuthPage/AuthPage";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Chat from "../Chat/Chat.jsx";
import FriendsList from "../../components/FriendsList/FriendsList";
import ProfilePage from "../../components/ProfilePage/ProfilePage";
import { io } from "socket.io-client";

export default function App() {
    const [user, setUser] = useState(getUser());
    const [selectedRoom, setSelectedRoom] = useState("");
    const [showProfilePage, setShowProfilePage] = useState(false);
    const [jars, setJars] = useState([]);
    const [jams, setJams] = useState([]);
    const [currentJar, setCurrentJar] = useState({});
    const [currentJam, setCurrentJam] = useState({});
    let jamSelected;

    const socketRef = useRef();
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io({
                autoConnect: false,
            });
        }

        socketRef.current.connect();
    }, []);

    async function getJars() {
        console.log("getJars() function in App.jsx");
        const jarList = await sendRequest("/api/jars");
        setJars(jarList);
    }

    function pickJar(jar) {
        console.log("pickJar() in App.jsx hit successfully");
        console.log(
            `The jar that pickJar() received from NavBar is: ${jar.name}`
        );
        console.log(
            `The current jar before resetting it is ${currentJar.name}`
        );
        setCurrentJar(jar);
        console.log(`And now the current jar is: ${currentJar.name}`);
    }

    function setJarList(newJar) {
        setJars((jars) => [...jars, newJar]);
    }

    function pickJam(jam) {
        jamSelected = true;
        setCurrentJam(jam);
    }

    const handleFriendClick = () => {
        setShowProfilePage(true);
    };

    const handleExitClick = () => {
        setShowProfilePage(false);
    };

    return (
        <main className="App">
            {user ? (
                <>
                    <div className="container">
                        <div className="container-1">
                            <NavBar
                                currentUser={user}
                                jars={jars}
                                setJarList={setJarList}
                                pickJar={pickJar}
                                getJars={getJars}
                                currentJar={currentJar}
                                setCurrentJar={setCurrentJar}
                            />
                        </div>
                        {socketRef.current && (
                            <>
                                <div className="container-2">
                                    <Sidebar
                                        setSelectedRoom={setSelectedRoom}
                                        jams={jams}
                                        user={user}
                                        socket={socketRef.current}
                                        currentJar={currentJar}
                                        setCurrentJar={setCurrentJar}
                                        pickJar={pickJar}
                                    />
                                </div>
                                <div className="container-3">
                                    <Chat
                                        selectedRoom={selectedRoom}
                                        jam={currentJam}
                                        socket={socketRef.current}
                                    />
                                </div>
                            </>
                        )}
                        <div className="container-4">
                            {showProfilePage ? (
                                <ProfilePage
                                    user={user}
                                    handleExitClick={handleExitClick}
                                />
                            ) : (
                                <FriendsList
                                    user={user}
                                    handleFriendClick={handleFriendClick}
                                />
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <AuthPage setUser={setUser} />
            )}
        </main>
    );
}

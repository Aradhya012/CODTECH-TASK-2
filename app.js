import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const chatEndRef = useRef(null);

  useEffect(() => {

    socket.on("chat-history", (messages) => {
      setChat(messages);
    });

    socket.on("receive-message", (data) => {
      setChat((prev) => [...prev, data]);
    });

  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = () => {

    if (message.trim() === "") return;

    const msgData = {
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send-message", msgData);

    setMessage("");
  };

  return (
    <div className="app">

      <div className="chat-container">

        <h1>💬 Real-Time Chat</h1>

        <div className="chat-box">

          {chat.map((msg, index) => (
            <div className="message" key={index}>
              <p>{msg.text}</p>
              <span>{msg.time}</span>
            </div>
          ))}

          <div ref={chatEndRef}></div>

        </div>

        <div className="input-area">

          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;
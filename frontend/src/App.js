import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("/");

function App() {

  const [messages, setMessages] = useState([]);

  const [username, setUsername] = useState("");
  const [text, setText] = useState("");

  /* ---------------- LOAD OLD MESSAGES ---------------- */

  useEffect(() => {

    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.reverse());
      });

  }, []);

  /* ---------------- SOCKET LISTENER ---------------- */

  useEffect(() => {

    socket.on("chat-message", (message) => {

      setMessages((prev) => [...prev, message]);

    });

    return () => {
      socket.off("chat-message");
    };

  }, []);

  /* ---------------- SEND MESSAGE ---------------- */

  const sendMessage = () => {

    if (!username || !text) return;

    socket.emit("chat-message", {
      username,
      text,
    });

    setText("");

  };

  return (

    <div style={{
      maxWidth: "700px",
      margin: "50px auto",
      padding: "20px",
      fontFamily: "Arial"
    }}>

      <h1>Realtime Chat App</h1>

      {/* Username */}

      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px"
        }}
      />

      {/* Chat Messages */}

      <div style={{
        border: "1px solid #ccc",
        height: "400px",
        overflowY: "scroll",
        padding: "10px",
        marginBottom: "10px"
      }}>

        {messages.map((msg, index) => (

          <div key={index} style={{
            marginBottom: "10px"
          }}>

            <strong>{msg.username}</strong>: {msg.text}

          </div>

        ))}

      </div>

      {/* Message Input */}

      <div style={{
        display: "flex",
        gap: "10px"
      }}>

        <input
          type="text"
          placeholder="Type message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            flex: 1,
            padding: "10px"
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px"
          }}
        >
          Send
        </button>

      </div>

    </div>

  );

}

export default App;
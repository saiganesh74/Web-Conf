import { useEffect, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Realtime Chat DevOps Project</h1>

      {messages.map((msg, index) => (
        <div key={index}>
          <strong>{msg.user}</strong>: {msg.text}
        </div>
      ))}
    </div>
  );
}

export default App;
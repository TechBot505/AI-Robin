import { useState } from "react";
import Title from "./Title";
import RecordMessage from "./RecordMessage";
import axios from "axios";

function Controller() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const createBlobUrl = (data) => {
    const blob = new Blob([data], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    return url;
  };

  const handleStop = async (blobUrl) => {
    setIsLoading(true);

    // Appending recorded message to message
    const myMessage = { sender: "me", blobUrl };
    const messagesArr = [...messages, myMessage];

    // convert bloburl to blobObject
    fetch(blobUrl)
      .then((res) => res.blob())
      .then(async (blob) => {
        // construct audio to send file
        const formData = new FormData();
        formData.append("file", blob, "myFile.wav");

        // Send formdata to API endpoint
        await axios
          .post("http://localhost:8000/post-audio", formData, {
            headers: { "Content-Type": "audio/mpeg" },
            responseType: "arraybuffer",
          })
          .then((res) => {
            const blob = res.data;
            const audio = new Audio();
            audio.src = createBlobUrl(blob);

            // Append to audio
            const robinMessage = { sender: "robin", blobUrl: audio.src };
            messagesArr.push(robinMessage);
            setMessages(messagesArr);

            // Play audio
            setIsLoading(false);
            audio.play();
          })
          .catch((err) => {
            console.error(err.message);
            setIsLoading(false);
          });
      });
  };

  return (
    <div className="h-screen overflow-y-hidden">
      <Title setMessages={setMessages} />
      <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96 bg-gray-900">
        {/* Conversation */}
        <div className="mt-5 px-5">
          {messages.map((audio, index) => {
            return (
              <div
                key={index + audio.sender}
                className={
                  "flex flex-col " + (audio.sender == "me" && "flex items-end")
                }
              >
                {/* Sender */}
                <div className="mt-4">
                  <p
                    className={
                      audio.sender == "me"
                        ? "text-right mr-2 text-purple-600"
                        : "text-blue-500 ml-2"
                    }
                  >
                    {audio.sender}
                  </p>
                  {/* Audio Message */}
                  <audio
                    src={audio.blobUrl}
                    className="appearance-none"
                    controls
                  />
                </div>
              </div>
            );
          })}
          {messages.length == 0 && !isLoading && (
            <div className="text-center font-light mt-10 text-lg text-white">
              Send Robin a Message...
            </div>
          )}
          {isLoading && (
            <div className="text-center text-white text-lg font-light mt-10 animate-pulse">
              Gimme a few seconds...
            </div>
          )}
        </div>
        {/* Recorder */}
        <div className="fixed bottom-0 w-full py-6 border-t text-center bg-gradient-to-r from-sky-500 to-purple-600">
          <div className="flex justify-center items-center w-full">
            <RecordMessage handleStop={handleStop}></RecordMessage>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Controller;

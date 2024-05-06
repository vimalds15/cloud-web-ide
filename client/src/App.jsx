import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Terminal from "./components/Terminal";
import FileTree from "./components/FileTree";
import socket from "../socket";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-github_dark";
import "ace-builds/src-noconflict/mode-javascript";

function App() {
  const [fileTree, setFileTree] = useState({});
  const [selectedFile, setSelectedFile] = useState("");
  const [code, setCode] = useState("");
  const [selectedFileContent, setSelectedFileContent] = useState("");

  const isSaved = selectedFileContent === code;

  const getFileTree = async () => {
    const response = await fetch("http://localhost:9000/files");
    const result = await response.json();
    setFileTree(result.tree);
  };

  const getFileContents = useCallback(async () => {
    if (!selectedFile) return;
    const response = await fetch(
      `http://localhost:9000/files/content?path=${selectedFile}`
    );
    const result = await response.json();
    setSelectedFileContent(result.content);
  }, [selectedFile]);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);

    return () => {
      socket.off("file:refresh", getFileTree);
    };
  }, []);

  useEffect(() => {
    if (!isSaved && code) {
      const timer = setTimeout(() => {
        socket.emit("file:change", {
          path: selectedFile,
          content: code,
        });
      }, 5 * 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [code, selectedFile, isSaved]);

  useEffect(() => {
    setCode("");
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile) getFileContents();
  }, [getFileContents, selectedFile]);

  useEffect(() => {
    setCode(selectedFileContent);
  }, [selectedFileContent]);

  return (
    <div className="playground-container">
      <div className="editor-container">
        <div className="files-container">
          <FileTree
            onSelect={(path) => setSelectedFile(path)}
            tree={fileTree}
          />
        </div>
        <div className="editor">
          {selectedFile && (
            <p style={{ color: "gray" }}>
              {selectedFile.replaceAll("/", " > ")}{" "}
              {isSaved ? "Saved" : "Unsaved"}
            </p>
          )}
          <AceEditor
            mode="javascript"
            theme="github_dark"
            width="100%"
            height="100%"
            value={code}
            onChange={(e) => setCode(e)}
          />
        </div>
      </div>
      <div className="terminal-container">
        <div className="terminal-title">Terminal </div>
        <Terminal style={{ backgroundColor: "#fafafa" }} />
      </div>
    </div>
  );
}

export default App;

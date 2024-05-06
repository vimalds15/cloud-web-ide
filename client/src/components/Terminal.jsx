import { Terminal as XTerminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import socket from "../../socket";
import "@xterm/xterm/css/xterm.css";

const Terminal = () => {
  const terminalRef = useRef();
  const isRendered = useRef(false);

  useEffect(() => {
    if (isRendered.current) return;
    isRendered.current = true;
    const term = new XTerminal({
      rows: 20,
      theme: {
        background: "#181818",
      },
      
    });
    term.open(terminalRef.current);
    socket.emit("terminal:write", "\r");

    term.onData((data) => {
      socket.emit("terminal:write", data);
    });

    socket.on("terminal:data", (data) => {
      term.write(data);
    });

    return () => {
      socket.off("termina:data", (data) => {
        term.write(data);
      });
    };
  }, []);

  return <div ref={terminalRef} id="terminal" />;
};

export default Terminal;

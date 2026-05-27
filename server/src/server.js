import http from "http";
// Trigger reload for new env configuration
import app from "./app.js";

import {
  initSocket,
} from "./socket/socket.js";

const PORT =
  process.env.PORT || 5000;

const server =
  http.createServer(app);

initSocket(server);

server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
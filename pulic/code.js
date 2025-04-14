(function () {
  const app = document.querySelector(".app");
  const socket = io();

  let uname;

  // Join chat
  app
    .querySelector(".join-screen #join-user")
    .addEventListener("click", function () {
      let username = app.querySelector(".join-screen #username ").value;
      let username1 = app.querySelector("#username1 ").value;
      if (username.length == 0) {
        return;
      }
     
      if (username1  !== "1602") {
        return false;
      }
      uname = username;
      socket.emit("newuser", uname);
      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");
    });

  // Send message
  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", function () {
      let message = app.querySelector(".chat-screen #message-input").value;
      if (message.length == 0) {
        return;
      }
      renderMessage("my", {
        username: uname,
        text: message,
      });
      socket.emit("chat", {
        username: uname,
        text: message,
      });
      app.querySelector(".chat-screen #message-input").value = "";
    });

  // Listen for messages from server
  socket.on("chat", function (data) {
    renderMessage("other", data);
  });

  // Listen for new users joining
  socket.on("update", function (message) {
    renderMessage("update", message);
  });

  // Listen for users leaving
  socket.on("user-disconnected", function (username) {
    renderMessage("update", `${username} left the chat`);
  });

  // Exit chat
  app
    .querySelector(".chat-screen #exit-chat")
    .addEventListener("click", function () {
      socket.emit("exituser", uname);
      window.location.href = window.location.href;
    });

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    let el = document.createElement("div");

    if (type === "my") {
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
    } else if (type === "other") {
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
    } else if (type === "update") {
      el.setAttribute("class", "update");
      el.innerText = message;
    }

    messageContainer.appendChild(el);
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();

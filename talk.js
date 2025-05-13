const chatBox = document.querySelector("#chat-box");
const input = document.querySelector("#input");
const send = document.querySelector("#send");
const deleteBtn = document.createElement("button");
const typingBubble = document.createElement("div");
const fileBtn = document.getElementById("file-btn");
const fileUpload = document.getElementById("file-upload");
const imageUpload = document.getElementById("image-upload");
const backBtn = document.querySelector(".back-btn");

if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

function saveChat() {
  localStorage.setItem("chat", chatBox.innerHTML);
}

function loadChat() {
  const saved = localStorage.getItem("chat");
  if (saved) {
    chatBox.innerHTML = saved;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

send.addEventListener("click", sendMyText);

function sendMyTextByEnter(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    sendMyText();
    e.preventDefault();
  }
}

input.addEventListener("keypress", sendMyTextByEnter);

//삭제버튼
deleteBtn.innerText = "🗑️";
deleteBtn.classList.add("bubble-delete-btn");
document.body.appendChild(deleteBtn);

let targetBubble = null;

chatBox.addEventListener("contextmenu", (e) => {
  if (e.target.classList.contains("bubble")) {
    e.preventDefault();
    targetBubble = e.target;
    deleteBtn.style.left = `${e.pageX}px`;
    deleteBtn.style.top = `${e.pageY}px`;
    deleteBtn.style.display = "block";
  } else {
    deleteBtn.style.display = "none";
  }
});

deleteBtn.addEventListener("click", () => {
  if (targetBubble) {
    targetBubble.remove();
    saveChat();
    deleteBtn.style.display = "none";
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("bubble") && e.target !== deleteBtn) {
    deleteBtn.style.display = "none";
  }
});

let pendingReplies = 0;
let totalUnanswered = 0;
let sentByMe = false;

const replies = [
  "ㅋㅋㅋㅋㅋㅋㅋㅋ",
  "뭐함?",
  "배고파",
  "졸려",
  "밥 뭐먹지",
  "집가고싶음",
  "ㅇㅇ",
  "미친",
];

function simulateFriendMessage() {
  if (pendingReplies <= 0) return;

  const typing = document.createElement("div");
  typing.classList.add("bubble", "friend-bubble");
  typing.innerText = "입력 중...";
  chatBox.append(typing);
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    typing.remove();

    const real = document.createElement("div");
    real.classList.add("bubble", "friend-bubble");
    const random = replies[Math.floor(Math.random() * replies.length)];
    real.innerText = random;
    chatBox.append(real);
    chatBox.scrollTop = chatBox.scrollHeight;

    saveChat();
    pendingReplies--;

    sentByMe = false;

    totalUnanswered++;
  }, 2000);
}

function sendMyText() {
  const newMessage = input.value;
  if (newMessage) {
    const div = document.createElement("div");
    div.classList.add("bubble", "my-bubble");
    div.innerText = newMessage;
    chatBox.append(div);
    saveChat();

    pendingReplies = 1;
    totalUnanswered = 0;
    sentByMe = true;
  } else {
    alert("메시지를 입력하세요...");
  }

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}

setInterval(() => {
  if (totalUnanswered >= 3) return;

  if (!sentByMe && pendingReplies < 3) {
    if (Math.random() < 0.3) {
      pendingReplies++;
    }
  }

  if (pendingReplies > 0) {
    simulateFriendMessage();
  }
}, 6000);

//파일업로드
fileBtn.addEventListener("click", () => {
  fileUpload.click();
});

// 파일 업로드 처리
fileUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    const div = document.createElement("div");
    div.classList.add("bubble", "my-bubble");

    const fileName = file.name.toLowerCase();
    const isImage = /\.(png|jpe?g|gif|webp|bmp|svg)$/.test(fileName);

    if (isImage) {
      // 이미지
      const img = document.createElement("img");
      img.src = event.target.result;
      img.classList.add("chat-image");

      div.appendChild(img);
    } else {
      // 일반 파일
      const link = document.createElement("a");
      link.href = event.target.result;
      link.download = file.name;
      link.style.textDecoration = "none";
      link.style.display = "flex";
      link.style.alignItems = "center";
      link.style.gap = "6px";

      const icon = document.createElement("img");
      icon.src = "imgs/file.png";
      icon.width = 20;
      icon.height = 20;

      const nameSpan = document.createElement("span");
      nameSpan.textContent = file.name;
      nameSpan.style.fontSize = "13px";
      nameSpan.style.color = "#fff";

      link.appendChild(icon);
      link.appendChild(nameSpan);
      div.appendChild(link);
    }

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    saveChat();
  };

  reader.readAsDataURL(file);
  fileUpload.value = "";
});

const imageBtn = document.getElementById("image-btn");
if (imageBtn) {
  imageBtn.addEventListener("click", () => {
    imageUpload.click();
  });
}

imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    const div = document.createElement("div");
    div.classList.add("bubble", "my-bubble");

    const img = document.createElement("img");
    img.src = event.target.result;
    img.classList.add("chat-image");

    div.appendChild(img);
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    saveChat();
  };

  reader.readAsDataURL(file);
  imageUpload.value = "";
});

window.addEventListener("load", loadChat);

window.addEventListener("load", () => {
  const friendName = localStorage.getItem("friendName");
  const friendImage = localStorage.getItem("friendImage");

  if (friendName) {
    const nameElement = document.querySelector(".username");
    if (nameElement) nameElement.textContent = friendName;
  }

  if (friendImage) {
    const profileElement = document.querySelector(".profile-pic");
    if (profileElement) profileElement.src = friendImage;
  }
});

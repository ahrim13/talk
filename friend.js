const form = document.getElementById("friend-form");
const nameInput = document.getElementById("friend-name");
const imageInput = document.getElementById("friend-image");
const preview = document.getElementById("profile-preview");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value;
  const file = imageInput.files[0];

  if (!name || !file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    localStorage.setItem("friendName", name);
    localStorage.setItem("friendImage", event.target.result);
    window.location.href = "talk.html"; // 채팅창으로 이동
  };

  reader.readAsDataURL(file);
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = document.createElement("img");
    img.src = event.target.result;
    preview.innerHTML = ""; // 기존 + 기호 제거
    preview.appendChild(img);
  };
  reader.readAsDataURL(file);
});

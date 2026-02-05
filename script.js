// Toggle sound for each video (phone / tablet)
document.querySelectorAll(".sound-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const id = btn.getAttribute("data-target");
    const video = document.getElementById(id);
    if (!video) return;

    const willUnmute = video.muted === true;
    video.muted = !willUnmute;

    try { await video.play(); } catch(e) {}

    btn.textContent = willUnmute ? "🔊" : "🔇";
  });
});

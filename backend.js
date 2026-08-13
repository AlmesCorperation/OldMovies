(function() {
  function initPlatform() {
    // 1. Initialize Archive.org streams
    const cards = document.querySelectorAll(".clean-video-card[data-archive-id]");
    cards.forEach(card => {
      const archiveId = card.getAttribute("data-archive-id");
      const videoElement = card.querySelector(".ia-clean-player");
      
      if (!archiveId || !videoElement || videoElement.src) return;

      const metaUrl = "https://archive.org/metadata/" + archiveId;

      fetch(metaUrl)
        .then(response => response.json())
        .then(data => {
          if (!data || !data.files) return;

          const mp4File = data.files.find(file => 
            file.name && 
            file.name.toLowerCase().endsWith('.mp4') && 
            !file.name.includes('ia.mp4')
          );

          if (mp4File) {
            videoElement.src = "https://archive.org/download/" + archiveId + "/" + encodeURIComponent(mp4File.name);
          }
        })
        .catch(error => console.error("Error retrieving stream for " + archiveId + ":", error));
    });

    // 2. Real-time Search Filtering Backend
    const searchBar = document.getElementById("movie-search-bar");
    const videoCards = document.querySelectorAll(".clean-video-card");

    if (searchBar) {
      searchBar.addEventListener("input", function(e) {
        const query = e.target.value.toLowerCase().trim();

        videoCards.forEach(card => {
          const title = card.querySelector("h3").textContent.toLowerCase();
          const subtitle = card.querySelector(".subtitle").textContent.toLowerCase();
          const description = card.querySelector(".video-description").textContent.toLowerCase();

          if (title.includes(query) || subtitle.includes(query) || description.includes(query)) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPlatform);
  } else {
    initPlatform();
  }
})();

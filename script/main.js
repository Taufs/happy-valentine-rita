// --- AUDIO CONTROLLER ---

const playBackgroundAudio = () => {
  const bgAudio = document.getElementById("background-audio");
  if (!bgAudio) return;

  bgAudio.volume = 1;
  bgAudio.muted = false;

  // Attempt to play immediately
  const playPromise = bgAudio.play();

  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.warn("Autoplay blocked by browser. Waiting for user interaction...");
      // FALLBACK: If browser blocks it, play on the first click/tap anywhere
      const unlockAudio = () => {
        bgAudio.play();
        // Remove listener once played so it doesn't trigger again
        document.removeEventListener("click", unlockAudio);
        document.removeEventListener("touchstart", unlockAudio);
      };
      document.addEventListener("click", unlockAudio);
      document.addEventListener("touchstart", unlockAudio);
    });
  }
};

const switchAudioTracks = () => {
  const bgAudio = document.getElementById("background-audio");
  const mainAudio = document.getElementById("audio");

  if (!mainAudio) return;

  // 1. Fade out and stop Background Audio
  if (bgAudio) {
    // Optional: Smooth fade out logic could go here, but for now we stop abruptly as requested
    bgAudio.pause();
    bgAudio.currentTime = 0;
  }

  // 2. Start Main Audio
  mainAudio.volume = 1;
  mainAudio.muted = false;
  
  const playPromise = mainAudio.play();
  
  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.warn("Main audio blocked:", error);
      // If the timeline reaches here but user hasn't clicked yet, force play on next click
      const forcePlay = () => { 
          mainAudio.play(); 
          document.removeEventListener("click", forcePlay);
      };
      document.addEventListener("click", forcePlay);
    });
  }
};


// --- ANIMATION & LOGIC ---

const buildCharacterSpans = (element) => {
  if (!element) return;
  element.innerHTML = `<span>${element.textContent
    .split("")
    .join("</span><span>")}</span>`;
};

const animationTimeline = () => {
  buildCharacterSpans(document.querySelector(".hbd-chatbox"));
  buildCharacterSpans(document.querySelector(".wish-hbd"));

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg",
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg",
  };

  const tl = new TimelineMax();

  tl.to(".container", 0.1, { visibility: "visible" })
    .from(".one", 0.7, { opacity: 0, y: 10 })
    .from(".two", 0.4, { opacity: 0, y: 10 })
    .to(".one", 0.7, { opacity: 0, y: 10 }, "+=2.5")
    .to(".two", 0.7, { opacity: 0, y: 10 }, "-=1")
    .from(".three", 0.7, { opacity: 0, y: 10 })
    .to(".three", 0.7, { opacity: 0, y: 10 }, "+=2")
    .from(".four", 0.7, { scale: 0.2, opacity: 0 })
    .from(".fake-btn", 0.3, { scale: 0.2, opacity: 0 })
    .staggerTo(".hbd-chatbox span", 0.5, { visibility: "visible" }, 0.05)
    .to(".fake-btn", 0.1, { backgroundColor: "rgb(127, 206, 248)" })
    .to(".four", 0.5, { scale: 0.2, opacity: 0, y: -150 }, "+=0.7")
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.2,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff",
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")
    .from(
      ".idea-5",
      0.7,
      {
        rotationX: 15,
        rotationZ: -10,
        skewY: "-5deg",
        y: 50,
        z: 10,
        opacity: 0,
      },
      "+=0.5"
    )
    .to(".idea-5 span", 0.7, { rotation: 90, x: 8 }, "+=0.4")
    .to(".idea-5", 0.7, { scale: 0.2, opacity: 0 }, "+=2")
    .staggerFrom(
      ".idea-6 span",
      0.8,
      { scale: 3, opacity: 0, rotation: 15, ease: Expo.easeOut },
      0.2
    )
    .staggerTo(
      ".idea-6 span",
      0.8,
      { scale: 3, opacity: 0, rotation: -15, ease: Expo.easeOut },
      0.2,
      "+=1"
    )
    .staggerFromTo(
      ".baloons img",
      2.5,
      { opacity: 0.9, y: 1400 },
      { opacity: 1, y: -1000 },
      0.2
    )
    .from(
      ".girl-dp",
      0.5,
      { scale: 3.5, opacity: 0, x: 25, y: -25, rotationZ: -45 },
      "-=2"
    )
    // HERE IS THE FIX: Call the switch function correctly
    .call(switchAudioTracks) 
    .staggerFrom(
      ".wish-hbd span",
      0.7,
      {
        opacity: 0,
        y: -50,
        rotation: 150,
        skewX: "30deg",
        ease: Elastic.easeOut.config(1, 0.5),
      },
      0.1
    )
    .staggerFromTo(
      ".wish-hbd span",
      0.7,
      { scale: 1.4, rotationY: 150 },
      { scale: 1, rotationY: 0, color: "#ff69b4", ease: Expo.easeOut },
      0.1,
      "party"
    )
    .from(
      ".wish h5",
      0.5,
      {
        opacity: 0,
        y: 10,
        skewX: "-15deg",
      },
      "party"
    )
    .staggerTo(
      ".eight svg",
      1.5,
      {
        visibility: "visible",
        opacity: 0,
        scale: 80,
        repeat: 3,
        repeatDelay: 1.4,
      },
      0.3
    )
    .to(".six", 0.5, { opacity: 0, y: 30, zIndex: "-1" })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(".last-smile", 0.5, { rotation: 90 }, "+=1");

  const replayBtn = document.getElementById("replay");
  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      tl.restart();
      // On replay, reset audio state
      const bgAudio = document.getElementById("background-audio");
      const mainAudio = document.getElementById("audio");
      if(mainAudio) { mainAudio.pause(); mainAudio.currentTime = 0; }
      if(bgAudio) { bgAudio.play(); } 
    });
  }
};

const applyCustomization = (customData) => {
  Object.entries(customData).forEach(([key, value]) => {
    if (value === "") return;
    const element = document.getElementById(key);
    if (!element) return;
    if (key === "imagePath") {
      element.setAttribute("src", value);
      return;
    }
    element.textContent = value;
  });
};

const fetchData = async () => {
  try {
    const response = await fetch("customize.json");
    if (!response.ok) {
      throw new Error(`Unable to load customize.json (${response.status})`);
    }
    const data = await response.json();
    applyCustomization(data);
  } catch (error) {
    console.error(error);
  }
};

const initializePage = async () => {
  await fetchData();
  
  // 1. Try to play background audio immediately
  playBackgroundAudio();
  
  // 2. Start animation
  setTimeout(() => {
    animationTimeline();
  }, 200);
};

initializePage();
let moodPoints = 10;
let pageNumber = 1;
let NameU = "";

let lastCoffee = {
  name: "",
  image: "",
  quantity: 0,
  price12oz: 0,
  price16oz: 0,
  originFunction: null,
};
let selectedCoffees = [];
let total = 0;

function priceDisplay({ price12, price16 }) {
  let displayContainer = document.getElementById("price-display-container");
  if (!displayContainer) {
    displayContainer = document.createElement("div");
    displayContainer.id = "price-display-container";
    document.body.appendChild(displayContainer);
  } else {
    displayContainer.innerHTML = "";
  }

  Object.assign(displayContainer.style, {
    position: "absolute",
    top: "76vh",
    left: "13vw",
    background: "linear-gradient(130deg, #f894a4, #f9d1b7, #f7a7a0, #fbc7a9)",
    border: "0.4vw solid #d19a66",
    borderRadius: "32px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    textAlign: "center",
    padding: "2vh 2vw",
    minWidth: "20vw",
    minHeight: "10vh",
    fontFamily: "'Jua', sans-serif",
    zIndex: "10",
  });
  const price = document.createElement("div");
  Object.assign(price.style, {
    fontSize: "2.5vw", // Converted from px
    fontWeight: "bold",
    color: "#5d4037",
    textShadow: "0 0.8vh 1.6vh rgba(0,0,0,0.1)", // Converted from px
    display: "inline-flex",
    alignItems: "baseline",
  });

  const pesoSign = document.createElement("span");
  pesoSign.textContent = "₱";
  Object.assign(pesoSign.style, {
    marginRight: "1vw", // Converted from px
    display: "inline-block",
    fontSize: "5vw", // Converted from px
    transformOrigin: "center center",
    transition: "box-shadow 0.1s ease-out",
  });

  const numberSpan = document.createElement("span");
  numberSpan.textContent = price12.toFixed(2);
  numberSpan.style.fontSize = "4vw"; // Converted from px

  price.appendChild(pesoSign);
  price.appendChild(numberSpan);
  displayContainer.appendChild(price);

  function animatePeso() {
    pesoSign.style.animation = "pesoBounce 0.6s ease forwards";
    pesoSign.addEventListener(
      "animationend",
      () => {
        pesoSign.style.animation =
          "pesoSpin 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards";

        pesoSign.addEventListener("animationiteration", () => {
          pesoSign.style.boxShadow =
            "3vw 0vw 5vw rgba(0, 0, 0, 0.3), -3vw 0vw 5vw rgba(0, 0, 0, 0.3)"; // Converted from px
          setTimeout(() => {
            pesoSign.style.boxShadow = "none";
          }, 150);
        });

        pesoSign.addEventListener(
          "animationend",
          () => {
            animatePeso();
          },
          { once: true }
        );
      },
      { once: true }
    );
  }

  animatePeso();

  return function updatePrice(size) {
    const newPrice = size === "12oz" ? price12 : price16;
    numberSpan.textContent = newPrice.toFixed(2);
  };
}

//COFFEE PARTICLE EFFECT
function rainingCoffee() {
  const style = document.createElement("style");
  style.textContent = `
    .particle {
      position: fixed;
      top: -30px;
      font-size: 20px;
      pointer-events: none;
      animation: fall linear forwards;
      z-index: 0;
    }

    @keyframes fall {
      to {
        transform: translateY(100vh);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  function createParticle() {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.textContent = "☕";
    particle.style.left = Math.random() * window.innerWidth + "px";
    particle.style.animationDuration = 3 + Math.random() * 3 + "s";
    particle.style.fontSize = 20 + Math.random() * 14 + "px";
    particle.style.opacity = 0.6 + Math.random() * 0.4;
    document.body.appendChild(particle);
    setTimeout(() => {
      particle.remove();
    }, 5000);
  }

  setInterval(createParticle, 750);
}

//GLOBAL GLOW EFFECT
function glowBox(targetId) {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes glowPulse {
      0%, 100% {
        box-shadow:
          0 0 45px rgba(0, 0, 0, 0.6),
          8px 8px 15px rgba(0, 0, 0, 0.5);
      }
      50% {
        box-shadow:
          0 0 45px rgba(255, 255, 255, 1),
          8px 8px 8px rgb(255, 255, 255);
      }
    }

    #${targetId} {
      animation: glowPulse 1.5s infinite ease-in-out;
    }
  `;
  document.head.appendChild(style);
}

//GLOBAL PULSE EFFECT

function globalPulse() {
  const style = document.createElement("style");
  style.textContent = `
  @keyframes globalPulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }

  .pulse {
    animation: globalPulse 1.5s infinite ease-in-out;
  }
`;
  document.head.appendChild(style);
}

globalPulse();

const nextbuttonsfx = new Audio("click_next.wav"); // Your click sound file
const backbtnsfx = new Audio("back_sfx.wav"); // Your click sound file
const loadingsfx = new Audio("loadingsfx.wav"); // Your click sound file
const moodclicksfx = new Audio("moodclicksfx.wav"); // Your click sound file
const success = new Audio("success.wav"); // Your click sound file
const yourcoffeessound = new Audio("yourcoffees.wav"); // Your click sound file

function applyCustomFont() {
  // 1. Create a new <style> element to define the @font-face rule
  const style = document.createElement("style");
  style.type = "text/css";

  // 2. Define the @font-face rule as a string
  const fontFace = `
      @font-face {
          font-family: 'JUA';  /* Font name */
          src: url('fonts/Jua-Regular.ttf') format('truetype');  /* Path to font file */
      }
  `;

  // Append the font-face rule to the <style> element
  style.innerHTML = fontFace;

  // 3. Append the <style> element to the <head> of the document
  document.head.appendChild(style);
}

function Homepage() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundColor = "#fbd0da";
  body.style.backgroundImage = "url('homepageback.png')";
  body.style.backgroundSize = "70vw";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundPosition = "21vw 2vh";
  body.style.transition = "background-position 0.5s ease-in-out";

  // Container
  const container = document.createElement("div");
  container.id = "homepage-container";
  container.style.position = "relative";
  container.style.width = "100%";
  container.style.height = "100vh";
  container.style.transition = "transform 0.5s ease-in-out";
  body.appendChild(container);

  // Question Mark
  const questionMark = document.createElement("img");
  questionMark.src = "questionmark.png";
  questionMark.id = "qmark";
  questionMark.style.position = "absolute";
  questionMark.style.width = "6.5vw";
  questionMark.style.height = "auto";
  questionMark.style.top = "13vh";
  questionMark.style.left = "16vw";
  questionMark.style.transition = "transform 0.6s ease";
  container.appendChild(questionMark);

  questionMark.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    questionMark.style.transform = "scale(2)";
    setTimeout(() => {
      renderAboutUs();
    }, 350);
  });

  // PressMe Button
  const pressButton = document.createElement("img");
  pressButton.src = "PressMe.png";
  pressButton.id = "press-button";
  pressButton.style.position = "absolute";
  pressButton.style.width = "30vw";
  pressButton.style.height = "auto";
  pressButton.style.top = "60vh";
  pressButton.style.left = "26vw";
  pressButton.style.cursor = "pointer";
  pressButton.style.transition = "transform 0.2s ease";
  pressButton.style.animation = "pulseTablet 1.3s infinite ease-in-out";
  container.appendChild(pressButton);

  pressButton.addEventListener("click", () => {
    pressButton.style.transform = "scale(0.93)";
    setTimeout(() => {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      pressButton.style.transform = "scale(1)";
      container.style.transform = "translateX(-100%)";
      body.style.backgroundPosition = "right";
      setTimeout(() => {
        presss();
      }, 500);
    }, 120);
  });

  // Add Keyframes for animation
  const styleTag = document.createElement("style");
  styleTag.textContent = `
    @keyframes pulseTablet {
      0% { transform: scale(1); }
      50% { transform: scale(1.4); }
      100% { transform: scale(1); }
    }

    /* Optional tweaks for really small screens */
    @media (max-width: 500px) {
      #qmark {
        top: 10vh;
        left: 18vw;
        width: 9vw;
      }

      #press-button {
        width: 50vw;
        top: 55vh;
        left: 22vw;
      }
    }

    /* Media Query for Portrait Mode (Vertical Screens) */
    @media (orientation: portrait) {
      #qmark {
        top: 12vh;   /* Adjust for vertical screens */
        left: 18vw;  /* Adjust for vertical screens */
        width: 10vw; /* Adjust size for vertical screens */
      }

      #press-button {
        top: 60vh;  /* Adjust position for vertical screens */
        left: 25vw; /* Adjust position for vertical screens */
        width: 40vw;  /* Adjust size for vertical screens */
      }
    }
  `;
  document.head.appendChild(styleTag);

  // Create the scrolling text
  const scrollingText = document.createElement("div");
  scrollingText.textContent = "Welcome to Éblouissante's Kiosk!";
  scrollingText.style.position = "absolute";
  scrollingText.style.whiteSpace = "nowrap";
  scrollingText.style.fontSize = "2vw";
  scrollingText.style.fontFamily = "Helvetica, sans-serif";
  scrollingText.style.fontStyle = "italic";
  scrollingText.style.textShadow = "7px 6px 3px rgba(0, 0, 0, 0.2)";
  scrollingText.style.color = "black";
  scrollingText.style.top = "90vh";
  scrollingText.style.left = "-100%";
  document.body.appendChild(scrollingText);

  // Variables for movement
  let position = -scrollingText.offsetWidth;
  const speed = 2; // Speed of scrolling (higher = faster)

  // Function to move the text
  function moveText() {
    position += speed; // Move right
    scrollingText.style.left = position + "px";

    // If the text goes completely out of screen, reset
    if (position > window.innerWidth) {
      position = -scrollingText.offsetWidth;
    }

    requestAnimationFrame(moveText); // Keep moving
  }

  // Start the animation
  moveText();
}

function presss() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "url('homepagebg.png')";
  body.style.backgroundColor = "#fbd0da";
  body.style.backgroundSize = "80vw"; // Equivalent to ~690px on large screens
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundPosition = "10vw -3vh"; // Similar to 350px 60px
  body.style.transition = "background-position 0.5s ease-in-out";

  // YES Button
  const yesBtn = document.createElement("button");
  yesBtn.innerText = "YES !";
  yesBtn.style.position = "absolute";
  yesBtn.style.top = "70vh";
  yesBtn.style.left = "27vw";
  yesBtn.style.width = "18vw";
  yesBtn.style.height = "16vh";
  yesBtn.style.fontSize = "4vw";
  yesBtn.style.fontFamily = "'JUA', sans-serif";
  yesBtn.style.color = "rgb(250, 217, 240)";
  yesBtn.style.backgroundColor = "white";
  yesBtn.style.border = "2px solid rgb(0, 0, 0)";
  yesBtn.style.borderRadius = "15px";
  yesBtn.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  yesBtn.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.5)";
  yesBtn.style.cursor = "pointer";
  body.style.transition = "background-position 0.5s ease-in-out";

  yesBtn.id = "yes";
  body.appendChild(yesBtn);

  yesBtn.classList.add("pulse");

  yesBtn.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    yes();
  });
  // SKIP Button
  const skipBtn = document.createElement("button");
  skipBtn.innerText = "View All Drinks!";
  skipBtn.style.position = "absolute";
  skipBtn.style.top = "66vh";
  skipBtn.style.left = "60vw";
  skipBtn.style.width = "20vw";
  skipBtn.style.height = "23vh";
  skipBtn.style.fontSize = "4vw";
  skipBtn.style.fontFamily = "'JUA', sans-serif";
  skipBtn.style.color = "rgb(250, 217, 240)";
  skipBtn.style.fontFamily = "'JUA', sans-serif";
  skipBtn.style.backgroundColor = "white";
  skipBtn.style.border = "2px solid rgb(0, 0, 0)";
  skipBtn.style.borderRadius = "15px";
  skipBtn.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  skipBtn.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.5)";
  skipBtn.style.cursor = "pointer";
  skipBtn.style.transition = "background-position 0.5s ease-in-out";

  skipBtn.id = "skip";
  body.appendChild(skipBtn);

  skipBtn.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    yournameSkip();
  });

  // Title Text
  const title1 = document.createElement("h1");
  title1.textContent = "How are you today?";
  title1.style.position = "absolute";
  title1.style.top = "1vh";
  title1.style.left = "29vw";
  title1.style.fontSize = "5vw";
  title1.style.fontFamily = "JUA, sans-serif";
  title1.style.color = "black";
  title1.style.width = "60vw";
  title1.style.textShadow = `
   -0.2vw -0.2vh 0 white,
    0.2vw -0.2vh 0 white,
   -0.2vw  0.2vh 0 white,
    0.2vw  0.2vh 0 white,
    0     0.2vh   0 white,
    0.2vw 0       0 white,
    0    -0.2vh   0 white,
   -0.2vw 0       0 white
 `;

  body.appendChild(title1);

  // Back Button
  const backBtn = document.createElement("img");
  backBtn.src = "BACK_BTN_TABLET.png";
  backBtn.style.position = "absolute";
  backBtn.style.width = "10vw";
  backBtn.style.top = "8vh";
  backBtn.style.left = "80vw";
  backBtn.id = "xxx";
  body.appendChild(backBtn);
  backBtn.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    Homepage();
  });

  const title2 = document.createElement("h1");
  title2.textContent = "do you want to try our";
  title2.style.position = "absolute";
  title2.style.top = "16vh";
  title2.style.left = "25vw";
  title2.style.fontSize = "5vw";
  title2.style.fontFamily = "JUA, sans-serif";
  title2.style.color = "black";
  title2.style.width = "60vw";
  title2.style.textShadow = title1.style.textShadow;
  body.appendChild(title2);

  const bounceStyle = document.createElement("style");
  bounceStyle.textContent = `
  @keyframes gentleBounce {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-20px); }
  }


`;
  document.head.appendChild(bounceStyle);

  const colorChangeStyle = document.createElement("style");
  colorChangeStyle.textContent = `
  @keyframes colorCycle {
    0%   { color: #28a745; }  /* Green */
    25%  { color: #007bff; }  /* Blue */
    50%  { color: #ffc107; }  /* Yellow */
    75%  { color: #fd7e14; }  /* Orange */
    100% { color: #dc3545; }  /* Red */
  }
`;
  document.head.appendChild(colorChangeStyle);

  //MOOD METER TEXT ANIMATION
  const aaa1 = document.createElement("h1");
  aaa1.textContent = "MOODMETER?";
  Object.assign(aaa1.style, {
    position: "absolute",
    top: "28vh",
    left: "27vw",
    width: "38vw",
    fontFamily: "JUA, sans-serif",
    fontSize: "8vw",
    textShadow: `
    -0.2vw -0.2vh 0 white,
     0.2vw -0.2vh 0 white,
    -0.2vw  0.2vh 0 white,
     0.2vw  0.2vh 0 white,
     0     0.2vh   0 white,
     0.2vw 0       0 white,
     0    -0.2vh   0 white,
    -0.2vw 0       0 white
  `,
    transformOrigin: "center center",
    animation:
      "gentleBounce 1.3s ease-in-out infinite, colorCycle 10s ease-in-out infinite",
  });
  body.appendChild(aaa1);

  //MOODMETER BAR

  const meterContainer = document.createElement("div");
  Object.assign(meterContainer.style, {
    position: "absolute",
    top: "58vh",
    left: "37vw",
    width: "28vw",
    height: "2vh",
    backgroundColor: "#fff",
    borderRadius: "1.5vh",
    overflow: "hidden",
    border: "0.2vw solid black",
    zIndex: "5",
  });
  body.appendChild(meterContainer);

  const moodMeterBar = document.createElement("div");
  Object.assign(moodMeterBar.style, {
    width: "8vw",
    height: "100%",
    backgroundColor: "#ffc107",
    borderRadius: "1vh",
    animation:
      "moveMeter 1.3s ease-in-out infinite, colorChange 1.3s ease-in-out infinite",
  });
  meterContainer.appendChild(moodMeterBar);

  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
  @keyframes moveMeter {
    0% { transform: translateX(0); } /* Start at the left */
    50% { transform: translateX(20vw); } /* Move to the right */
    100% { transform: translateX(0); } /* Move back to the left */
  }

  @keyframes colorChange {
    0% { background-color: #dc3545; } /* Red when on the left side */
    25% { background-color: #ffc107; } /* Yellow when at the middle */
    50% { background-color: #ffc107; } /* Yellow at the middle */
    75% { background-color: #28a745; } /* Green when on the right side */
    100% { background-color: #dc3545; } /* Red again when moving back to the left */
  }
`;
  document.head.appendChild(styleSheet);
}

function yes() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "url('presback.png')";
  body.style.backgroundColor = "#fbd0da";
  body.style.backgroundSize = "70vw";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundPosition = "16vw 3vh";
  body.style.transition = "background-position 0.5s ease-in-out";

  const xim = document.createElement("img");
  xim.src = "BACK_BTN_TABLET.png";
  xim.style.position = "absolute";
  xim.style.width = "10vw";
  xim.style.height = "auto";
  xim.style.top = "80vh";
  xim.style.left = "45vw";
  xim.id = "xxx";
  body.appendChild(xim);

  xim.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    presss();
  });

  const okayBtn = document.createElement("button");
  okayBtn.style.position = "absolute";
  okayBtn.innerText = "OKAY";
  okayBtn.style.lineHeight = "2.5vh"; // Adjusted for better scaling
  okayBtn.style.width = "20vw"; // Converted from 300px
  okayBtn.style.height = "12vh"; // Converted from 100px
  okayBtn.style.fontSize = "5vw";
  okayBtn.style.color = "rgb(250, 217, 240)";
  okayBtn.style.fontFamily = "'JUA', sans-serif";
  okayBtn.style.backgroundColor = "white";
  okayBtn.style.border = "0.2vw solid rgb(0, 0, 0)"; // Adjusted for scaling
  okayBtn.style.borderRadius = "1vw"; // Converted from 20px
  okayBtn.style.textShadow =
    "-0.1vw -0.1vh 0 rgb(0, 0, 0), 0.1vw -0.1vh 0 rgb(15, 7, 9), -0.1vw 0.1vh 0 rgb(15, 6, 8), 0.1vw 0.1vh 0 rgb(19, 7, 9)";
  okayBtn.style.cursor = "pointer";
  okayBtn.style.transition = "transform 0.2s";

  okayBtn.style.top = "60vh";
  okayBtn.style.left = "40vw";
  okayBtn.id = "okay";
  body.appendChild(okayBtn);

  okayBtn.classList.add("pulse");

  okayBtn.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    yourname();
  });
}

function yourname() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.backgroundColor = "#fbd0da";
  body.style.backgroundSize = "58vw";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundPosition = "29vw 10vh";
  body.style.transition = "background-position 0.5s ease-in-out";

  const n1 = document.createElement("h1");
  n1.textContent = "What's your Name?";
  n1.style.color = "black";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "7vw";
  n1.style.top = "5vh";
  n1.style.left = "19vw";
  n1.style.width = "64vw";
  n1.style.display = "inline-block";
  n1.style.textShadow = "0.7vw 0.6vh 0.6vh rgba(0, 0, 0, 0.2)";
  document.body.appendChild(n1);

  // ANIMATION
  const text = n1.textContent;
  n1.innerHTML = "";
  text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline-block";

    if (char === " ") {
      span.textContent = "\u00A0";
    }

    n1.appendChild(span);

    span.style.animation = `waveBounce 1s ease ${i * 0.1}s forwards`;
  });

  const style = document.createElement("style");
  style.textContent = `
    @keyframes waveBounce {
      0% {
        transform: translateY(0);   // Start at original position
      }
      30% {
        transform: translateY(-1.5vh); // Move up a little
      }
      50% {
        transform: translateY(0);   // Return to original position
      }
      70% {
        transform: translateY(-0.7vh);  // Move up a little again
      }
      100% {
        transform: translateY(0);   // Final position (reset to original)
      }
    }
  `;
  document.head.appendChild(style);

  const textbox = document.createElement("input");
  textbox.type = "text";
  textbox.placeholder = "Please Enter your Name...";
  textbox.style.position = "absolute";
  textbox.style.top = "37vh";
  textbox.style.left = "30vw";
  textbox.style.width = "38vw";
  textbox.style.height = "10vh";
  textbox.style.fontSize = "2.5vw";
  textbox.style.borderRadius = "3vw";
  textbox.style.boxShadow = "1vw 1vh 1vw rgba(0, 0, 0, 0.5)"; // Shadow using vw and vh

  // Apply transition for smooth color change
  textbox.style.transition =
    "border-color 0.6s ease, background-color 0.6s ease";

  body.appendChild(textbox);

  textbox.addEventListener("input", function () {
    if (textbox.value.length < 1) {
      textbox.style.borderColor = "#FF9090";
      textbox.style.backgroundColor = "#FF9090";
    } else {
      textbox.style.borderColor = "#74FD72";
      textbox.style.backgroundColor = "#74FD72";
    }
  });

  // Push elements down function
  function pushElementsDown() {
    const allElements = body.children;
    for (let i = 0; i < allElements.length; i++) {
      allElements[i].style.transition = "transform 0.4s ease-in";
      allElements[i].style.transform = "translateY(100%)";
    }
  }

  const xim = document.createElement("img");
  xim.src = "BACK_BTN_TABLET.png";
  xim.style.position = "absolute";
  xim.style.width = "12vw";
  xim.style.height = "auto";
  xim.style.top = "80vh";
  xim.style.left = "43vw";
  xim.id = "xxx";
  body.appendChild(xim);

  xim.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    yes();
  });

  const skipBtn = document.createElement("button");
  skipBtn.style.position = "absolute";
  skipBtn.innerText = "OKAY";
  skipBtn.style.lineHeight = "1.5vh";
  skipBtn.style.width = "20vw";
  skipBtn.style.height = "10vh";
  skipBtn.style.fontSize = "4vw";
  skipBtn.style.color = "rgb(250, 217, 240)";
  skipBtn.style.fontFamily = "'JUA', sans-serif";
  skipBtn.style.backgroundColor = "white";
  skipBtn.style.border = "0.1vw solid rgb(0, 0, 0)";
  skipBtn.style.borderRadius = "1.5vw";
  skipBtn.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  skipBtn.style.boxShadow = "0vw 0.4vh 1vh rgba(0, 0, 0, 0.5)";
  skipBtn.style.cursor = "pointer";
  skipBtn.style.transition = "transform 0.2s";
  skipBtn.style.top = "60vh";
  skipBtn.style.left = "39vw";
  skipBtn.id = "okay";
  body.appendChild(skipBtn);
  skipBtn.classList.add("pulse");

  skipBtn.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    check();
  });

  function check() {
    if (textbox.value.length < 1) {
      // Clear old popup if any
      const existingOverlay = document.getElementById("popupOverlay");
      if (existingOverlay) {
        existingOverlay.remove();
      }

      // Create overlay
      const overlay = document.createElement("div");
      overlay.id = "popupOverlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.zIndex = "1000";
      document.body.appendChild(overlay);

      // Create popup box
      const popup = document.createElement("div");
      popup.style.backgroundColor = "white";
      popup.style.padding = "3vh 5vw";
      popup.style.borderRadius = "20px";
      popup.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
      popup.style.textAlign = "center";
      popup.style.fontFamily = "Jua, sans-serif";
      popup.style.width = "50vw";

      // Title
      const title = document.createElement("h2");
      title.textContent = "Oops! 😅";
      title.style.marginBottom = "2vh";
      title.style.fontSize = "2.5vw";
      title.style.color = "#333";
      popup.appendChild(title);

      // Message
      const message = document.createElement("p");
      message.textContent = "Your name must be at least 1 character long!";
      message.style.fontSize = "2vw";
      message.style.color = "#555";
      message.style.marginBottom = "3vh";
      popup.appendChild(message);

      // OK Button
      const okButton = document.createElement("button");
      okButton.textContent = "Okay";
      okButton.style.padding = "1vh 3vw";
      okButton.style.fontSize = "1.8vw";
      okButton.style.backgroundColor = "#f4a261";
      okButton.style.border = "none";
      okButton.style.borderRadius = "10px";
      okButton.style.cursor = "pointer";
      okButton.style.color = "white";
      okButton.style.fontFamily = "Jua, sans-serif";
      okButton.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
      popup.appendChild(okButton);

      // Close popup when OK button is clicked
      okButton.addEventListener("click", function () {
        overlay.remove();
      });

      overlay.appendChild(popup);
    } else {
      // If everything is okay
      pushElementsDown();
      NameU = textbox.value;

      setTimeout(() => {
        note();
      }, 400); // matches push transition
    }
  }
}

function yournameSkip() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.backgroundColor = "#fbd0da";
  body.style.backgroundSize = "58vw";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundPosition = "29vw 10vh";
  body.style.transition = "background-position 0.5s ease-in-out";

  const n1 = document.createElement("h1");
  n1.textContent = "What's your Name?";
  n1.style.color = "black";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "7vw";
  n1.style.top = "5vh";
  n1.style.left = "19vw";
  n1.style.width = "64vw";
  n1.style.display = "inline-block";
  n1.style.textShadow = "0.7vw 0.6vh 0.6vh rgba(0, 0, 0, 0.2)";
  document.body.appendChild(n1);

  // ANIMATION
  const text = n1.textContent;
  n1.innerHTML = "";
  text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline-block";

    if (char === " ") {
      span.textContent = "\u00A0";
    }

    n1.appendChild(span);

    span.style.animation = `waveBounce 1s ease ${i * 0.1}s forwards`;
  });

  const style = document.createElement("style");
  style.textContent = `
    @keyframes waveBounce {
      0% {
        transform: translateY(0);   // Start at original position
      }
      30% {
        transform: translateY(-1.5vh); // Move up a little
      }
      50% {
        transform: translateY(0);   // Return to original position
      }
      70% {
        transform: translateY(-0.7vh);  // Move up a little again
      }
      100% {
        transform: translateY(0);   // Final position (reset to original)
      }
    }
  `;
  document.head.appendChild(style);

  const textbox = document.createElement("input");
  textbox.type = "text";
  textbox.placeholder = "Please Enter your Name...";
  textbox.style.position = "absolute";
  textbox.style.top = "37vh";
  textbox.style.left = "30vw";
  textbox.style.width = "38vw";
  textbox.style.height = "10vh";
  textbox.style.fontSize = "2.5vw";
  textbox.style.borderRadius = "3vw";
  textbox.style.boxShadow = "1vw 1vh 1vw rgba(0, 0, 0, 0.5)"; // Shadow using vw and vh

  // Apply transition for smooth color change
  textbox.style.transition =
    "border-color 0.6s ease, background-color 0.6s ease";

  body.appendChild(textbox);

  textbox.addEventListener("input", function () {
    if (textbox.value.length < 1) {
      textbox.style.borderColor = "#FF9090";
      textbox.style.backgroundColor = "#FF9090";
    } else {
      textbox.style.borderColor = "#74FD72";
      textbox.style.backgroundColor = "#74FD72";
    }
  });

  // Push elements down function
  function pushElementsDown() {
    const allElements = body.children;
    for (let i = 0; i < allElements.length; i++) {
      allElements[i].style.transition = "transform 0.4s ease-in";
      allElements[i].style.transform = "translateY(100%)";
    }
  }

  const xim = document.createElement("img");
  xim.src = "BACK_BTN_TABLET.png";
  xim.style.position = "absolute";
  xim.style.width = "12vw";
  xim.style.height = "auto";
  xim.style.top = "80vh";
  xim.style.left = "43vw";
  xim.id = "xxx";
  body.appendChild(xim);

  xim.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    NameU = "";
    presss();
  });

  const skipBtn = document.createElement("button");
  skipBtn.style.position = "absolute";
  skipBtn.innerText = "OKAY";
  skipBtn.style.lineHeight = "1.5vh";
  skipBtn.style.width = "20vw";
  skipBtn.style.height = "10vh";
  skipBtn.style.fontSize = "4vw";
  skipBtn.style.color = "rgb(250, 217, 240)";
  skipBtn.style.fontFamily = "'JUA', sans-serif";
  skipBtn.style.backgroundColor = "white";
  skipBtn.style.border = "0.1vw solid rgb(0, 0, 0)";
  skipBtn.style.borderRadius = "1.5vw";
  skipBtn.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  skipBtn.style.boxShadow = "0vw 0.4vh 1vh rgba(0, 0, 0, 0.5)";
  skipBtn.style.cursor = "pointer";
  skipBtn.style.transition = "transform 0.2s";
  skipBtn.style.top = "60vh";
  skipBtn.style.left = "39vw";
  skipBtn.id = "okay";
  body.appendChild(skipBtn);
  skipBtn.classList.add("pulse");

  skipBtn.addEventListener("click", check);
  skipBtn.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    check();
  });

  // Push elements down
  function pushElementsDown() {
    const allElements = body.children;

    for (let i = 0; i < allElements.length; i++) {
      allElements[i].style.transition = "transform 0.4s ease-in";
      allElements[i].style.transform = "translateY(100%)";
    }
  }

  // Check if name is valid, then push + load
  function check() {
    if (textbox.value.length < 1) {
      // Clear old popup if any
      const existingOverlay = document.getElementById("popupOverlay");
      if (existingOverlay) {
        existingOverlay.remove();
      }

      // ENTER NAME POPUP
      const overlay = document.createElement("div");
      overlay.id = "popupOverlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.zIndex = "1000";
      document.body.appendChild(overlay);

      const popup = document.createElement("div");
      popup.style.backgroundColor = "white";
      popup.style.padding = "3vh 5vw";
      popup.style.borderRadius = "20px";
      popup.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
      popup.style.textAlign = "center";
      popup.style.fontFamily = "Jua, sans-serif";
      popup.style.width = "50vw";

      const title = document.createElement("h2");
      title.textContent = "Oops! 😅";
      title.style.marginBottom = "2vh";
      title.style.fontSize = "5vw";
      title.style.color = "#333";
      popup.appendChild(title);

      const message = document.createElement("p");
      message.textContent = "Your name must be at least 1 character long!";
      message.style.fontSize = "2vw";
      message.style.color = "#555";
      message.style.marginBottom = "3vh";
      popup.appendChild(message);

      const okButton = document.createElement("button");
      okButton.textContent = "Okay";
      okButton.style.padding = "1vh 3vw";
      okButton.style.fontSize = "1.8vw";
      okButton.style.backgroundColor = "#f4a261";
      okButton.style.border = "none";
      okButton.style.borderRadius = "10px";
      okButton.style.cursor = "pointer";
      okButton.style.color = "white";
      okButton.style.fontFamily = "Jua, sans-serif";
      okButton.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
      popup.appendChild(okButton);

      // Close popup when OK button is clicked
      okButton.addEventListener("click", function () {
        overlay.remove();
      });

      overlay.appendChild(popup);
    } else {
      // If everything is okay
      pushElementsDown();
      NameU = textbox.value;

      // Wait just enough time for the animation to finish
      setTimeout(() => {
        loadingsfx.currentTime = 0;
        loadingsfx.play();
        loadingCoffee();
        setTimeout(() => {
          viewCoffeesSkip();
        }, 3000);
      }, 400); // matches push transition
    }
  }
}

function note() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "url('note.png')";
  body.style.backgroundColor = "#fbd0da";
  body.style.backgroundSize = "58vw";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundPosition = "22vw 10vh";
  body.style.transition = "background-position 0.3s ease-in-out";

  const skipBtn = document.createElement("button");
  skipBtn.style.position = "absolute";
  skipBtn.innerText = "LET'S GO!";
  skipBtn.style.lineHeight = "2.5vh";
  skipBtn.style.width = "25vw";
  skipBtn.style.height = "14vh";
  skipBtn.style.fontSize = "4vw";
  skipBtn.style.color = "rgb(250, 217, 240)";
  skipBtn.style.fontFamily = "'JUA', sans-serif";
  skipBtn.style.backgroundColor = "white";
  skipBtn.style.border = "0.2vw solid rgb(0, 0, 0)";
  skipBtn.style.borderRadius = "1vw";
  skipBtn.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  skipBtn.style.boxShadow = "0vw 0.4vh 1vh rgba(0, 0, 0, 0.5)";
  skipBtn.style.cursor = "pointer";
  skipBtn.style.transition = "transform 0.2s";
  skipBtn.style.top = "70vh";
  skipBtn.style.left = "38vw";
  skipBtn.id = "okay";

  // Adding the pulsating animation
  skipBtn.style.animation = "pulsate 0.5s infinite alternate";

  // Create the pulsate animation
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes pulsate {
      0% {
        transform: scale(1);
        box-shadow: 0 0 1vh rgba(0, 0, 0, 0.2);
      }
      100% {
        transform: scale(1.1);
        box-shadow: 0 0 2vh rgba(0, 0, 0, 0.5);
      }
    }
  `;
  document.head.appendChild(style);

  body.appendChild(skipBtn);

  skipBtn.addEventListener("click", () => {
    loadingsfx.currentTime = 0;
    loadingsfx.play();
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    loadingScreen();
    setTimeout(() => {
      bestMood();
    }, 3000);
  });

  const xim = document.createElement("img");
  xim.src = "BACK_BTN_TABLET.png";
  xim.style.position = "absolute";
  xim.style.width = "6.5vw";
  xim.style.height = "auto";
  xim.style.top = "10vh";
  xim.style.left = "75vw";
  xim.id = "xxx";
  body.appendChild(xim);

  xim.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    yourname();
    NameU = "";
  });
}

function loadingScreen() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "Loading Mood Meter";
  n1.style.color = "black";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "6vw";
  n1.style.width = "100vw";
  n1.style.top = "10vh";
  n1.style.left = "27vw";
  n1.style.fontWeight = "bold";
  n1.style.letterSpacing = "0.1vw";
  n1.style.textShadow = "0.7vw 0.6vh 0.6vh rgba(0, 0, 0, 0.2)";
  n1.style.animation = "pulse 2s infinite"; // Pulsing effect
  body.appendChild(n1);

  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
  `;
  document.head.appendChild(style);

  const n11 = document.createElement("h1");
  n11.textContent = "Please Wait...";
  n11.style.color = "black";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "3.5vw";
  n11.style.top = "33vh";
  n11.style.left = "42vw";
  n11.style.width = "50vw";
  n11.style.textShadow = "0.7vw 0.6vh 0.6vh rgba(0, 0, 0, 0.2)";
  body.appendChild(n11);

  // MOODMETER BAR

  // 2️⃣ Create a container for the "MOODMETER" bar (moving bar)
  const meterContainer = document.createElement("div");
  Object.assign(meterContainer.style, {
    position: "absolute",
    top: "53vh", // Position the bar just below the "MOODMETER?" text
    left: "36.6vw",
    width: "30vw", // Adjusted width for the meter
    height: "3vh", // Adjusted height for the meter
    backgroundColor: "#fff", // Changed to white background for the meter
    borderRadius: "1.5vh", // Slightly rounded corners for style
    overflow: "hidden", // To make sure the bar doesn't overflow
    border: "0.2vw solid black", // Black outline around the bar
    zIndex: "5",
  });
  body.appendChild(meterContainer);

  // 3️⃣ Create the moving "MOODMETER" bar inside the container
  const moodMeterBar = document.createElement("div");
  Object.assign(moodMeterBar.style, {
    width: "6vw", // Adjusted width for the meter bar
    height: "100%", // Full height of the container
    backgroundColor: "#ffc107", // Start with yellow (middle color)
    borderRadius: "1vh", // Rounded corners for the bar
    animation:
      "moveMeter 3s ease-in-out infinite, colorChange 3s ease-in-out infinite", // Apply both animations
  });
  meterContainer.appendChild(moodMeterBar);

  // 4️⃣ Add the animation keyframes for the left-right motion and color change
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
  @keyframes moveMeter {
    0% { transform: translateX(0); } /* Start at the left */
    50% { transform: translateX(25vw); } /* Move to the right */
    100% { transform: translateX(0); } /* Move back to the left */
  }

  @keyframes colorChange {
    0% { background-color: #dc3545; } /* Red when on the left side */
    25% { background-color: #ffc107; } /* Yellow when at the middle */
    50% { background-color: #ffc107; } /* Yellow at the middle */
    75% { background-color: #28a745; } /* Green when on the right side */
    100% { background-color: #dc3545; } /* Red again when moving back to the left */
  }
  `;
  document.head.appendChild(styleSheet);

  const quotesArray = [
    "The best way to predict the future is to create it.",
    "Life is 10% what happens to us and 90% how we react to it.",
    "Happiness is not something ready made. It comes from your own actions.",
    "Your time is limited, so don’t waste it living someone else's life.",
    "Success is not the key to happiness. Happiness is the key to success.",
  ];

  const randomIndex = Math.floor(Math.random() * quotesArray.length);
  const rrr = quotesArray[randomIndex];

  const quote = document.createElement("h1");
  quote.textContent = '"' + rrr + '"';
  quote.style.color = "black";
  quote.style.width = "30vw";
  quote.style.fontFamily = "JUA, sans-serif";
  quote.style.position = "absolute";
  quote.style.fontSize = "2vw";
  quote.style.top = "60vh";
  quote.style.left = "50%";
  quote.style.transform = "translateX(-50%)";
  quote.style.textAlign = "center";
  quote.style.textShadow = "0.7vw 0.6vh 0.6vh rgba(0, 0, 0, 0.1)";
  body.appendChild(quote);

  // Add animation styles
  const styleTag = document.createElement("style");
  styleTag.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleTag);
}

function bestMood() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "Which emoji best describes your current mood?";
  n1.style.color = "black";
  n1.style.width = "50vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "4.2vw";
  n1.style.top = "4vh";
  n1.style.left = "28vw";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.1)";
  body.appendChild(n1);

  // Create pulsating effect for images
  const addPulseEffect = (img) => {
    img.style.animation = "pulse 2s infinite"; // Add pulsating effect
  };

  const x = document.createElement("img");
  x.src = "excited.png";
  x.style.position = "absolute";
  x.style.width = "13vw";
  x.style.height = "auto";
  x.style.top = "34vh";
  x.style.left = "29vw";
  x.id = "xxx";
  addPulseEffect(x); // Apply pulse effect
  body.appendChild(x);
  x.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += 5;
    howdoyoufeel();
  });

  const xx = document.createElement("img");
  xx.src = "joyful.png";
  xx.style.position = "absolute";
  xx.style.width = "13vw";
  xx.style.height = "auto";
  xx.style.top = "34vh";
  xx.style.left = "44vw";
  xx.id = "xxx";
  addPulseEffect(xx); // Apply pulse effect
  body.appendChild(xx);
  xx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += 3;
    howdoyoufeel();
  });

  const xxx = document.createElement("img");
  xxx.src = "happy.png";
  xxx.style.position = "absolute";
  xxx.style.width = "13vw";
  xxx.style.height = "auto";
  xxx.style.top = "34vh";
  xxx.style.left = "59vw";
  xxx.id = "xxx";
  addPulseEffect(xxx); // Apply pulse effect
  body.appendChild(xxx);
  xxx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += 1;
    howdoyoufeel();
  });

  const xxxx = document.createElement("img");
  xxxx.src = "sleepy.png";
  xxxx.style.position = "absolute";
  xxxx.style.width = "13vw";
  xxxx.style.height = "auto";
  xxxx.style.top = "64vh";
  xxxx.style.left = "36vw";
  xxxx.id = "xxx";
  addPulseEffect(xxxx); // Apply pulse effect
  body.appendChild(xxxx);
  xxxx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += -4;
    howdoyoufeel();
  });

  const xxxxx = document.createElement("img");
  xxxxx.src = "sad.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "13vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "64vh";
  xxxxx.style.left = "53vw";
  xxxxx.id = "xxx";
  addPulseEffect(xxxxx); // Apply pulse effect
  body.appendChild(xxxxx);
  xxxxx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += -5;
    howdoyoufeel();
  });

  // Pulsing effect CSS
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);
}

function howdoyoufeel() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "How do you feel today?";
  n1.style.color = "black";
  n1.style.width = "60vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "5vw";
  n1.style.top = "5vh";
  n1.style.left = "26vw";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.1)";
  body.appendChild(n1);

  // Create pulsating effect for images
  const addPulseEffect = (img) => {
    img.style.animation = "pulse 2s infinite"; // Add pulsating effect
  };

  const x = document.createElement("img");
  x.src = "BestDay.png";
  x.style.position = "absolute";
  x.style.width = "13vw";
  x.style.height = "auto";
  x.style.top = "34vh";
  x.style.left = "29vw";
  x.id = "xxx";
  addPulseEffect(x); // Apply pulse effect
  body.appendChild(x);
  x.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += 5;
    moodrelate();
  });

  const xx = document.createElement("img");
  xx.src = "feelinggood.png";
  xx.style.position = "absolute";
  xx.style.width = "13vw";
  xx.style.height = "auto";
  xx.style.top = "34vh";
  xx.style.left = "44vw";
  xx.id = "xxx";
  addPulseEffect(xx); // Apply pulse effect
  body.appendChild(xx);
  xx.addEventListener("click", () => {
    moodPoints += 3;
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodrelate();
  });

  const xxx = document.createElement("img");
  xxx.src = "AnotherDay.png";
  xxx.style.position = "absolute";
  xxx.style.width = "13vw";
  xxx.style.height = "auto";
  xxx.style.top = "34vh";
  xxx.style.left = "59vw";
  xxx.id = "xxx";
  addPulseEffect(xxx); // Apply pulse effect
  body.appendChild(xxx);
  xxx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += -2;
    moodrelate();
  });

  const xxxx = document.createElement("img");
  xxxx.src = "littleboost.png";
  xxxx.style.position = "absolute";
  xxxx.style.width = "13vw";
  xxxx.style.height = "auto";
  xxxx.style.top = "64vh";
  xxxx.style.left = "36vw";
  xxxx.id = "xxx";
  addPulseEffect(xxxx); // Apply pulse effect
  body.appendChild(xxxx);
  xxxx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += -3;
    moodrelate();
  });

  const xxxxx = document.createElement("img");
  xxxxx.src = "overW.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "13vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "64vh";
  xxxxx.style.left = "53vw";
  xxxxx.id = "xxx";
  addPulseEffect(xxxxx); // Apply pulse effect
  body.appendChild(xxxxx);
  xxxxx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += -5;
    moodrelate();
  });

  // Pulsing effect CSS
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);
}

function moodrelate() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "Which one do you relate to the most right now?";
  n1.style.color = "black";
  n1.style.width = "50vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "4vw";
  n1.style.top = "5vh";
  n1.style.left = "28vw";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.1)";
  body.appendChild(n1);

  // Create pulsating effect for images
  const addPulseEffect = (img) => {
    img.style.animation = "pulse 2s infinite"; // Add pulsating effect
  };

  const x = document.createElement("img");
  x.src = "pumped.png";
  x.style.position = "absolute";
  x.style.width = "13vw";
  x.style.height = "auto";
  x.style.top = "34vh";
  x.style.left = "29vw";
  x.id = "xxx";
  addPulseEffect(x); // Apply pulse effect
  body.appendChild(x);
  x.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += 5;
    energylevel();
  });

  const xx = document.createElement("img");
  xx.src = "vibing.png";
  xx.style.position = "absolute";
  xx.style.width = "13vw";
  xx.style.height = "auto";
  xx.style.top = "34vh";
  xx.style.left = "44vw";
  xx.id = "xxx";
  addPulseEffect(xx); // Apply pulse effect
  body.appendChild(xx);
  xx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += 3;
    energylevel();
  });

  const xxx = document.createElement("img");
  xxx.src = "needboost.png";
  xxx.style.position = "absolute";
  xxx.style.width = "13vw";
  xxx.style.height = "auto";
  xxx.style.top = "34vh";
  xxx.style.left = "59vw";
  xxx.id = "xxx";
  addPulseEffect(xxx); // Apply pulse effect
  body.appendChild(xxx);
  xxx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += -3;
    energylevel();
  });

  const xxxx = document.createElement("img");
  xxxx.src = "feelinglow.png";
  xxxx.style.position = "absolute";
  xxxx.style.width = "13vw";
  xxxx.style.height = "auto";
  xxxx.style.top = "64vh";
  xxxx.style.left = "36vw";
  xxxx.id = "xxx";
  addPulseEffect(xxxx); // Apply pulse effect
  body.appendChild(xxxx);
  xxxx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += -4;
    energylevel();
  });

  const xxxxx = document.createElement("img");
  xxxxx.src = "overloaded.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "13vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "64vh";
  xxxxx.style.left = "53vw";
  xxxxx.id = "xxx";
  addPulseEffect(xxxxx); // Apply pulse effect
  body.appendChild(xxxxx);
  xxxxx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += -5;
    energylevel();
  });

  // Pulsing effect CSS
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);
}

function energylevel() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "How's your energy level at the moment?";
  n1.style.color = "black";
  n1.style.width = "50vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "4vw";
  n1.style.top = "5vh";
  n1.style.left = "27vw";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.1)";
  body.appendChild(n1);

  // Create pulsating effect for images
  const addPulseEffect = (img) => {
    img.style.animation = "pulse 2s infinite"; // Add pulsating effect
  };

  const x = document.createElement("img");
  x.src = "superE.png";
  x.style.position = "absolute";
  x.style.width = "13vw";
  x.style.height = "auto";
  x.style.top = "34vh";
  x.style.left = "29vw";
  x.id = "xxx";
  addPulseEffect(x); // Apply pulse effect
  body.appendChild(x);
  x.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += 5;
    kindofdrink();
  });

  const xx = document.createElement("img");
  xx.src = "feelinglight.png";
  xx.style.position = "absolute";
  xx.style.width = "13vw";
  xx.style.height = "auto";
  xx.style.top = "34vh";
  xx.style.left = "44vw";
  xx.id = "xxx";
  addPulseEffect(xx); // Apply pulse effect
  body.appendChild(xx);
  xx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += 3;
    kindofdrink();
  });

  const xxx = document.createElement("img");
  xxx.src = "iamsleepy.png";
  xxx.style.position = "absolute";
  xxx.style.width = "13vw";
  xxx.style.height = "auto";
  xxx.style.top = "34vh";
  xxx.style.left = "59vw";
  xxx.id = "xxx";
  addPulseEffect(xxx); // Apply pulse effect
  body.appendChild(xxx);
  xxx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += -2;
    kindofdrink();
  });

  const xxxx = document.createElement("img");
  xxxx.src = "drained.png";
  xxxx.style.position = "absolute";
  xxxx.style.width = "13vw";
  xxxx.style.height = "auto";
  xxxx.style.top = "64vh";
  xxxx.style.left = "36vw";
  xxxx.id = "xxx";
  addPulseEffect(xxxx); // Apply pulse effect
  body.appendChild(xxxx);
  xxxx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += -4;
    kindofdrink();
  });

  const xxxxx = document.createElement("img");
  xxxxx.src = "mentallytired.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "13vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "64vh";
  xxxxx.style.left = "53vw";
  xxxxx.id = "xxx";
  addPulseEffect(xxxxx); // Apply pulse effect
  body.appendChild(xxxxx);
  xxxxx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    moodPoints += -5;
    kindofdrink();
  });

  // Pulsing effect CSS
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);
}

function kindofdrink() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "What kind of drink would feel the best for you right now?";
  n1.style.color = "black";
  n1.style.width = "50vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "4vw";
  n1.style.top = "5vh";
  n1.style.left = "26vw";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.1)";
  body.appendChild(n1);

  // Function to add pulsating effect to the images
  const addPulseEffect = (img) => {
    img.style.animation = "pulse 2s infinite"; // Apply pulsating animation
  };

  const x = document.createElement("img");
  x.src = "funandr.png";
  x.style.position = "absolute";
  x.style.width = "13vw";
  x.style.height = "auto";
  x.style.top = "34vh";
  x.style.left = "29vw";
  x.id = "xxx";
  addPulseEffect(x); // Add pulse effect
  body.appendChild(x);
  x.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    loadingsfx.currentTime = 0;
    loadingsfx.play();
    moodPoints += 5;
    calculateScore();
    setTimeout(() => {
      scoreResult();
    }, 3000);
  });

  const xx = document.createElement("img");
  xx.src = "smooth.png";
  xx.style.position = "absolute";
  xx.style.width = "13vw";
  xx.style.height = "auto";
  xx.style.top = "34vh";
  xx.style.left = "44vw";
  xx.id = "xxx";
  addPulseEffect(xx); // Add pulse effect
  body.appendChild(xx);
  xx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    loadingsfx.currentTime = 0;
    loadingsfx.play();
    moodPoints += 3;
    calculateScore();
    setTimeout(() => {
      scoreResult();
    }, 3000);
  });

  const xxx = document.createElement("img");
  xxx.src = "warm.png";
  xxx.style.position = "absolute";
  xxx.style.width = "13vw";
  xxx.style.height = "auto";
  xxx.style.top = "34vh";
  xxx.style.left = "59vw";
  xxx.id = "xxx";
  addPulseEffect(xxx); // Add pulse effect
  body.appendChild(xxx);
  xxx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    loadingsfx.currentTime = 0;
    loadingsfx.play();
    moodPoints += -1;
    calculateScore();
    setTimeout(() => {
      scoreResult();
    }, 3000);
  });

  const xxxx = document.createElement("img");
  xxxx.src = "sweetandc.png";
  xxxx.style.position = "absolute";
  xxxx.style.width = "13vw";
  xxxx.style.height = "auto";
  xxxx.style.top = "64vh";
  xxxx.style.left = "36vw";
  xxxx.id = "xxx";
  addPulseEffect(xxxx); // Add pulse effect
  body.appendChild(xxxx);
  xxxx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    loadingsfx.currentTime = 0;
    loadingsfx.play();
    moodPoints += -3;
    calculateScore();
    setTimeout(() => {
      scoreResult();
    }, 3000);
  });

  const xxxxx = document.createElement("img");
  xxxxx.src = "strong.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "13vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "64vh";
  xxxxx.style.left = "53vw";
  xxxxx.id = "xxx";
  addPulseEffect(xxxxx); // Add pulse effect
  body.appendChild(xxxxx);
  xxxxx.addEventListener("click", () => {
    moodclicksfx.currentTime = 0;
    moodclicksfx.play();
    loadingsfx.currentTime = 0;
    loadingsfx.play();
    moodPoints += -5;
    calculateScore();
    setTimeout(() => {
      scoreResult();
    }, 3000);
  });

  // Add the CSS for the pulse effect
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);
}

function calculateScore() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  // Title for the calculating message
  const n1 = document.createElement("h1");
  n1.textContent = "Calculating Score...";
  n1.style.color = "black";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "6vw";
  n1.style.top = "10vh";
  n1.style.left = "27vw";
  n1.style.width = "50vw";
  n1.style.textShadow = "0.7vw 0.6vh 0.6vh rgba(0, 0, 0, 0.2)";
  n1.style.animation = "pulse 1.2s infinite"; // Pulsing effect
  body.appendChild(n1);

  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
  `;
  document.head.appendChild(style);

  // Subheading "Please Wait"
  const n11 = document.createElement("h1");
  n11.textContent = "Please Wait";
  n11.style.color = "black";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "3.1vw";
  n11.style.top = "33vh";
  n11.style.left = "42vw";
  n11.style.width = "40vw";
  n11.style.textShadow = "0.7vw 0.6vh 0.6vh rgba(0, 0, 0, 0.1)";
  body.appendChild(n11);

  // MOODMETER BAR

  // 2️⃣ Create a container for the "MOODMETER" bar (moving bar)
  const meterContainer = document.createElement("div");
  Object.assign(meterContainer.style, {
    position: "absolute",
    top: "49vh",
    left: "35vw",
    width: "30vw", // Converted from 430px
    height: "3vh", // Converted from 25px
    backgroundColor: "#fff", // Changed to white background for the meter
    borderRadius: "1.5vh", // Slightly rounded corners for style
    overflow: "hidden", // To make sure the bar doesn't overflow
    border: "0.2vw solid black", // Black outline around the bar
    zIndex: "5",
  });
  body.appendChild(meterContainer);

  // 3️⃣ Create the moving "MOODMETER" bar inside the container
  const moodMeterBar = document.createElement("div");
  Object.assign(moodMeterBar.style, {
    width: "6vw", // Converted from 80px
    height: "100%", // Full height of the container
    backgroundColor: "#ffc107", // Start with yellow (middle color)
    borderRadius: "1vh", // Rounded corners for the bar
    animation:
      "moveMeter 3s ease-in-out infinite, colorChange 3s ease-in-out infinite", // Apply both animations
  });
  meterContainer.appendChild(moodMeterBar);

  // 4️⃣ Add the animation keyframes for the left-right motion and color change
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
  @keyframes moveMeter {
    0% { transform: translateX(0); } /* Start at the left */
    50% { transform: translateX(22vw); } /* Move to the right (converted from 320px) */
    100% { transform: translateX(0); } /* Move back to the left */
  }

  @keyframes colorChange {
    0% { background-color: #dc3545; } /* Red when on the left side */
    25% { background-color: #ffc107; } /* Yellow when at the middle */
    50% { background-color: #ffc107; } /* Yellow at the middle */
    75% { background-color: #28a745; } /* Green when on the right side */
    100% { background-color: #dc3545; } /* Red again when moving back to the left */
  }
  `;
  document.head.appendChild(styleSheet);

  // Random motivational quote
  const quotesArray = [
    "The best way to predict the future is to create it.",
    "Life is 10% what happens to us and 90% how we react to it.",
    "Happiness is not something ready made. It comes from your own actions.",
    "Your time is limited, so don’t waste it living someone else's life.",
    "Success is not the key to happiness. Happiness is the key to success.",
  ];

  const randomIndex = Math.floor(Math.random() * quotesArray.length);
  const rrr = quotesArray[randomIndex];

  const quote = document.createElement("h1");
  quote.textContent = '"' + rrr + '"';
  quote.style.color = "black";
  quote.style.width = "30vw";
  quote.style.fontFamily = "JUA, sans-serif";
  quote.style.position = "absolute";
  quote.style.fontSize = "2vw"; // Converted from 30px
  quote.style.top = "60vh";
  quote.style.left = "50%";
  quote.style.transform = "translateX(-50%)";
  quote.style.textAlign = "center";
  quote.style.textShadow = "0.7vw 0.6vh 0.6vh rgba(0, 0, 0, 0.1)";
  body.appendChild(quote);

  // Add animation styles
  const styleTag = document.createElement("style");
  styleTag.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleTag);
}

function moodPColor() {
  if (moodPoints <= -15) {
    return "#FF1317"; // Red
  } else if (moodPoints >= -14 && moodPoints <= -5) {
    return "#FB9903"; // Orange
  } else if (moodPoints >= -4 && moodPoints <= 4) {
    return "#F0F93C"; // Yellow
  } else if (moodPoints >= 5 && moodPoints <= 14) {
    return "#5ED1FF"; // Blue
  } else {
    return "#74FFB3"; // Green
  }
}

function moodStatement() {
  if (moodPoints <= -15) {
    return "It's been a tough day. Time to unwind with something warm, calming, and soothing."; // Red
  } else if (moodPoints >= -14 && moodPoints <= -5) {
    return "Feeling a little low? A bold and strong pick-me-up will give you the boost you need!"; // Orange
  } else if (moodPoints >= -4 && moodPoints <= 4) {
    return "You're in a neutral state—let's find something comforting and cozy to keep you balanced!"; // Yellow
  } else if (moodPoints >= 5 && moodPoints <= 14) {
    return "You're feeling good and relaxed. A light and smooth treat will keep you in this perfect mood!"; // Blue
  } else {
    return "You're full of energy! Keep the momentum going with something refreshing and balanced!"; // Green
  }
}

function powerBars() {
  if (moodPoints <= -15) {
    return "redB.gif"; // Red
  } else if (moodPoints >= -14 && moodPoints <= -5) {
    return "orangeB.gif"; // Orange
  } else if (moodPoints >= -4 && moodPoints <= 4) {
    return "yellowB.gif"; // Yellow
  } else if (moodPoints >= 5 && moodPoints <= 14) {
    return "blueB.gif"; // Blue
  } else {
    return "greenB.gif"; // Green
  }
}

function scoreResult() {
  success.currentTime = 0;
  success.play();
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "url('demoBG.png')";
  body.style.backgroundColor = "#fbd0da";
  body.style.backgroundSize = "70vw";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundPosition = "17vw 6vh";

  // YOU SCORED
  const n111 = document.createElement("h1");
  n111.textContent = "You scored";
  n111.style.color = "black";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "3.2vw";
  n111.style.top = "20vh";
  n111.style.left = "22vw";
  n111.style.width = "60vw";
  n111.style.fontStyle = "italic"; // Italicized for a more elegant touch
  n111.style.textShadow = "2px 2px 3px rgba(0, 0, 0, 0.7)"; // Smooth soft shadow for better contrast
  body.appendChild(n111);

  // (POINTS)
  const n11 = document.createElement("h1");
  n11.textContent = moodPoints;
  n11.style.color = moodPColor();
  n11.style.webkitTextStroke = "2px black";
  n11.style.fontFamily = "Lemonada, sans-serif";
  n11.style.position = "absolute";
  n11.style.transform = "translateX(-50%)";
  n11.style.fontSize = "4.5vw";
  n11.style.top = "17vh";
  n11.style.left = "41.4vw";
  n11.style.textShadow = "2px 2px 3px rgba(0, 0, 0, 0.7)"; // Smooth soft shadow for better contrast
  body.appendChild(n11);

  // POINTS IN THE MOODMETER
  const n1111 = document.createElement("h1");
  n1111.textContent = "points in the Mood Meter!";
  n1111.style.color = "black";
  n1111.style.fontFamily = "JUA, sans-serif";
  n1111.style.position = "absolute";
  n1111.style.fontSize = "3.2vw";
  n1111.style.top = "19.7vh";
  n1111.style.left = "45.4vw";
  n1111.style.width = "50vw";
  n1111.style.fontStyle = "italic";
  n1111.style.textShadow = "2px 2px 3px rgba(0, 0, 0, 0.7)";
  body.appendChild(n1111);

  const n1 = document.createElement("h1");
  n1.textContent = moodStatement();
  n1.style.color = moodPColor();
  n1.style.webkitTextStroke = "2px black";
  n1.style.fontFamily = "'Poppins', 'Segoe UI', 'Helvetica', sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "2.1vw";
  n1.style.width = "50vw";
  n1.style.top = "32vh";
  n1.style.left = "25vw";
  n1.style.lineHeight = "1.4";
  n1.style.textAlign = "center";
  n1.style.textShadow = "2px 2px 5px rgba(0, 0, 0, 0.3)";
  n1.style.fontStyle = "italic";
  document.body.appendChild(n1);

  // Retry Image
  const x = document.createElement("img");
  x.src = "retry.png";
  x.style.position = "absolute";
  x.style.width = "8vw";
  x.style.height = "auto";
  x.style.top = "70vh";
  x.style.left = "70vw";
  x.id = "xxx";
  body.appendChild(x);

  // Create the modal (custom popup)
  function createModal() {
    // Create the overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "999";
    document.body.appendChild(overlay);

    // Create the popup modal (Kiosk-style design)
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.backgroundColor = "#fff";
    popup.style.padding = "20px 40px";
    popup.style.border = "2px solid #4CAF50"; // Green border for positive vibes
    popup.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)";
    popup.style.zIndex = "1000";
    popup.style.borderRadius = "10px"; // Rounded corners for a modern look
    document.body.appendChild(popup);

    // Create the message inside the modal
    const message = document.createElement("p");
    message.textContent = "Do you want to Retry our Mood Meter?";
    message.style.fontFamily = "'Jua', sans-serif";
    message.style.fontSize = "2vw";
    message.style.color = "#333";
    message.style.textAlign = "center";
    message.style.marginBottom = "20px";
    popup.appendChild(message);

    // Create "Yes" button
    const yesButton = document.createElement("button");
    yesButton.textContent = "Yes";
    yesButton.style.backgroundColor = "#4CAF50"; // Green background for positive actions
    yesButton.style.color = "white";
    yesButton.style.fontSize = "1.8vw";
    yesButton.style.padding = "10px 20px";
    yesButton.style.border = "none";
    yesButton.style.cursor = "pointer";
    yesButton.style.borderRadius = "5px";
    yesButton.style.transition = "background-color 0.3s ease";
    yesButton.addEventListener("mouseover", function () {
      yesButton.style.backgroundColor = "#45a049"; // Slightly darker green on hover
    });
    yesButton.addEventListener("mouseout", function () {
      yesButton.style.backgroundColor = "#4CAF50"; // Revert to original green
    });
    popup.appendChild(yesButton);

    // Create "No" button
    const noButton = document.createElement("button");
    noButton.textContent = "No";
    noButton.style.backgroundColor = "#f44336"; // Red background for negative actions
    noButton.style.color = "white";
    noButton.style.fontSize = "1.8vw";
    noButton.style.padding = "10px 20px";
    noButton.style.border = "none";
    noButton.style.cursor = "pointer";
    noButton.style.borderRadius = "5px";
    noButton.style.transition = "background-color 0.3s ease";
    noButton.addEventListener("mouseover", function () {
      noButton.style.backgroundColor = "#e53935"; // Slightly darker red on hover
    });
    noButton.addEventListener("mouseout", function () {
      noButton.style.backgroundColor = "#f44336"; // Revert to original red
    });
    popup.appendChild(noButton);

    // Add some space between the buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.gap = "20px";
    buttonContainer.style.marginTop = "20px";
    buttonContainer.appendChild(yesButton);
    buttonContainer.appendChild(noButton);
    popup.appendChild(buttonContainer);

    // When the "Yes" button is clicked
    yesButton.addEventListener("click", function () {
      backbtnsfx.currentTime = 0;
      backbtnsfx.play();
      moodPoints = 10;
      note(); // Assuming 'note()' triggers the next action
      document.body.removeChild(overlay); // Remove overlay
      document.body.removeChild(popup); // Remove popup
    });

    // When the "No" button is clicked
    noButton.addEventListener("click", function () {
      document.body.removeChild(overlay); // Remove overlay
      document.body.removeChild(popup); // Remove popup
    });

    // Close the popup if the overlay is clicked
    overlay.addEventListener("click", function () {
      document.body.removeChild(overlay);
      document.body.removeChild(popup);
    });
  }

  // Add the event listener to the image
  x.addEventListener("click", function () {
    createModal(); // Show the custom popup modal
  });

  // Add the CSS for the spinning animation
  const styleTag = document.createElement("style");
  styleTag.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleTag);

  const xx = document.createElement("img");
  xx.src = "viewcoffee.png";
  xx.style.position = "absolute";
  xx.style.width = "30vw";
  xx.style.height = "auto";
  xx.style.top = "73vh";
  xx.style.left = "30vw";
  xx.id = "xxx";

  // Add pulsing animation
  xx.style.animation = "pulse 1.5s infinite ease-in-out";

  // Append the image to the body
  body.appendChild(xx);

  // Pulsing animation keyframes
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.4);
      }
      100% {
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);

  xx.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    loadingCoffee();
    setTimeout(() => {
      viewCoffeesMM();
    }, 3000);
  });

  const p = document.createElement("img");
  p.src = powerBars();
  p.style.position = "absolute";
  p.style.width = "50vw";
  p.style.height = "auto";
  p.style.top = "53vh";
  p.style.left = "24vw";
  p.id = "xxx";
  body.appendChild(p);
}

function MMCoffee1() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "ICED AMERICANO";
  n1.style.color = "black";
  n1.style.width = "29vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Americano.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.zIndex = "1";
  xxx.style.border = "0.4vw solid white";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Iced Americano",
        image: "Americano.png",
        size: selectedSize,
        price12oz: 95,
        price16oz: 95,
        quantity: count,
        originFunction: MMCoffee1,
      };
      selectedCoffees.push(lastCoffee);
      orderSummary();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesMM();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>42%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>48%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 95, price16: 95 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso \n• Hot / Cold Water \n• Sugar";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "Americano Coffee—bold, smooth, and refreshingly simple. Made by adding hot water to rich espresso, it delivers a full-bodied taste with a lighter finish. Perfect for those who love their coffee strong, but not too intense.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function MMCoffee2() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "ICED CAPPUCCINO";
  n1.style.color = "black";
  n1.style.width = "31vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "IcedCap.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");
  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size!");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Iced Cappuccino",
        image: "IcedCap.png",
        size: selectedSize,
        price12oz: 120,
        price16oz: 120,
        quantity: count,
        originFunction: MMCoffee2,
      };
      selectedCoffees.push(lastCoffee);
      orderSummary();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesMM();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 120, price16: 120 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Milk Foam\n• Sugar";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "An iced cappuccino is a smooth and refreshing coffee drink, known for its bold flavor and airy, creamy finish. It's the perfect balance of richness and cool elegance—ideal for a refined yet energizing pick-me-up.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function MMCoffee3() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "DIRTY MATCHA";
  n1.style.color = "black";
  n1.style.width = "25vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Dirty Matcha.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");
  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Dirty Matcha",
        image: "Dirty Matcha.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: MMCoffee3,
      };
      selectedCoffees.push(lastCoffee);
      orderSummary();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesMM();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>37%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>41%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Matcha Powder\n• Sweetener";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A dirty matcha is a unique fusion of earthy matcha and bold espresso, creating a smooth, slightly sweet drink with a subtle kick. It's a beautifully layered blend that’s both calming and energizing—perfect for those who love a twist on tradition.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function MMCoffee4() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "SPANISH LATTE";
  n1.style.color = "black";
  n1.style.width = "27vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Spanish Latte.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");
  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Spanish Latte",
        image: "Spanish Latte.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: MMCoffee4,
      };
      selectedCoffees.push(lastCoffee);
      orderSummary();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesMM();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Condensed Milk";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A Spanish latte is a creamy and indulgent coffee drink with a hint of sweetness. Smooth and rich, it offers a perfect balance of espresso and milk, making it a comforting choice for those who enjoy a mellow yet flavorful coffee experience.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function MMCoffee5() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "HAZELNUT LATTE";
  n1.style.color = "black";
  n1.style.width = "31vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);
  const xx = document.createElement("img");
  xx.src = "Hazelnut Latte.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");
  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      alert("Please select a size");
    } else {
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Hazelnut Latte",
        image: "Hazelnut Latte.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: MMCoffee5,
      };
      selectedCoffees.push(lastCoffee);
      orderSummary();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesMM();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Hazelnut Syrup";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A hazelnut latte is a warm, nutty delight that blends smooth espresso with creamy milk and a touch of hazelnut sweetness. Rich, comforting, and aromatic, it's a cozy favorite for those who love a little flavor in their daily coffee ritual.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function MMCoffee6() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "FLAT WHITE";
  n1.style.color = "black";
  n1.style.width = "21vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "43vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Flatwhite Final.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");
  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Flat White",
        image: "Flatwhite Final.png",
        size: selectedSize,
        price12oz: 110,
        price16oz: 110,
        quantity: count,
        originFunction: MMCoffee6,
      };
      selectedCoffees.push(lastCoffee);
      orderSummary();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesMM();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>37%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>41%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 110, price16: 110 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent = "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Sugar";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A flat white is a silky-smooth coffee made with a rich shot of espresso and velvety steamed milk. Known for its balanced flavor and creamy texture, it’s a refined choice for those who enjoy a bold yet smooth coffee experience without the extra foam.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function MMCoffee7() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "FRENCH VANILLA";
  n1.style.color = "black";
  n1.style.width = "29vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);
  const xx = document.createElement("img");
  xx.src = "French Vanilla.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");
  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "French Vanilla",
        image: "French Vanilla.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: MMCoffee7,
      };
      selectedCoffees.push(lastCoffee);
      orderSummary();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesMM();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Vanilla Syrup";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A French vanilla coffee is a smooth and aromatic blend with a delicate hint of sweet, creamy vanilla. Rich yet mellow, it’s a comforting classic that adds a touch of elegance to every sip.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function MMCoffee8() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "BUTTERSCOTCH LATTE";
  n1.style.color = "black";
  n1.style.width = "33vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.1vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Butterscotch Latte.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");
  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Butterscotch Latte",
        image: "Butterscotch Latte.png",
        size: selectedSize,
        price12oz: 125,
        price16oz: 125,
        quantity: count,
        originFunction: MMCoffee8,
      };
      selectedCoffees.push(lastCoffee);
      orderSummary();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesMM();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 125, price16: 125 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Butterscotch Syrup";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A butterscotch latte is a rich and cozy indulgence, blending smooth espresso with creamy milk and a buttery-sweet hint of butterscotch. Warm, velvety, and irresistibly flavorful—it’s like a hug in a cup.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function MMCoffee9() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "CAFE LATTE";
  n1.style.color = "black";
  n1.style.width = "22vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "42vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "CafeLatte.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");
  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Cafe Latte",
        image: "CafeLatte.png",
        size: selectedSize,
        price12oz: 120,
        price16oz: 120,
        quantity: count,
        originFunction: MMCoffee9,
      };
      selectedCoffees.push(lastCoffee);
      orderSummary();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesMM();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 120, price16: 120 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent = "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Sugar";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A café latte is a timeless classic, known for its smooth blend of bold espresso and steamed milk. With its mild flavor and creamy texture, it’s a comforting, everyday favorite that’s both simple and satisfying.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function MMCoffee10() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "MOCHA";
  n1.style.color = "black";
  n1.style.width = "14.5vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "4.3vw";
  n1.style.top = "4.5vh";
  n1.style.left = "42.7vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Mocha.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");
  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Mocha",
        image: "Mocha.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: MMCoffee10,
      };
      selectedCoffees.push(lastCoffee);
      orderSummary();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesMM();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>27%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>37%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Chocolate Syrup";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A mocha coffee is a decadent fusion of rich espresso and velvety chocolate, blended with steamed milk for a smooth, indulgent treat. Perfectly balanced between bold and sweet, it’s a delightful pick-me-up for coffee and chocolate lovers alike.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function MMCoffee11() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "CARAMEL MACCHIATO";
  n1.style.color = "black";
  n1.style.width = "33vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.2vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);
  const xx = document.createElement("img");
  xx.src = "Caramel Macchiato.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");
  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      const selectedSize = selectedButton.innerText.split(":")[0];
      lastCoffee = {
        name: "Caramel Macchiato",
        image: "Caramel Macchiato.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: MMCoffee11,
      };
      selectedCoffees.push(lastCoffee);
      orderSummary();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", viewCoffeesMM);
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Caramel Syrup";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A caramel macchiato is a luscious coffee drink that layers bold espresso with creamy milk and a drizzle of golden caramel. Sweet, smooth, and slightly bold—it’s a delightful balance of richness and indulgence in every sip.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function MMCoffee12() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "WHITE MOCHA";
  n1.style.color = "black";
  n1.style.width = "24vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "White Mocha.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "White Mocha",
        image: "White Mocha.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: MMCoffee12,
      };
      selectedCoffees.push(lastCoffee);
      orderSummary();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesMM();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• White Chocolate Syrup";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A white mocha is a luxuriously smooth coffee drink, blending rich espresso with creamy milk and sweet white chocolate. Velvety and indulgent, it’s a perfect choice for those who enjoy a mellow, dessert-like coffee experience.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function MMCoffee13() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "SALTED CARAMEL LATTE";
  n1.style.color = "black";
  n1.style.width = "33vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "2.8vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Salted caramel.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      const selectedSize = selectedButton.innerText.split(":")[0];
      lastCoffee = {
        name: "Salted Caramel",
        image: "Salted caramel.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: MMCoffee13,
      };
      selectedCoffees.push(lastCoffee);
      orderSummary();
    }
  });
  body.appendChild(xxx);

  const xxxx = document.createElement("img");
  xxxx.src = "BACK_BTN_TABLET.png";
  xxxx.style.position = "absolute";
  xxxx.style.width = "8vw";
  xxxx.style.height = "auto";
  xxxx.style.top = "10vh";
  xxxx.style.left = "80vw";
  xxxx.style.borderRadius = "8vw";
  xxxx.style.zIndex = "1";
  xxxx.addEventListener("click", viewCoffeesMM);
  body.appendChild(xxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Salted Caramel Syrup";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A salted caramel latte is a deliciously balanced blend of smooth espresso, steamed milk, and buttery caramel with a hint of sea salt. Sweet, creamy, and lightly savory—it’s a comforting treat with a gourmet twist.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function MMCoffee14() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "DIRTY MATCHA";
  n1.style.color = "black";
  n1.style.width = "25vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  body.appendChild(n1);

  const xx = document.createElement("img");
  xx.src = "Dirty Matcha.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");
  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Dirty Matcha",
        image: "Dirty Matcha.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: MMCoffee14,
      };
      selectedCoffees.push(lastCoffee);
      orderSummary();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesMM();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>37%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>41%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Matcha Powder\n• Sweetener";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A dirty matcha is a unique fusion of earthy matcha and bold espresso, creating a smooth, slightly sweet drink with a subtle kick. It's a beautifully layered blend that’s both calming and energizing—perfect for those who love a twist on tradition.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

let pic1;
let pic2;
let pic3;
let ctype1;
let ctype2;
let ctype3;

function emptyFuncMM() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundColor = "#fbd0da";

  // Create overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "1000";
  body.appendChild(overlay);

  // Create popup box
  const popup = document.createElement("div");
  popup.style.backgroundColor = "white";
  popup.style.padding = "3vh 5vw";
  popup.style.borderRadius = "20px";
  popup.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
  popup.style.textAlign = "center";
  popup.style.fontFamily = "Jua, sans-serif";
  popup.style.width = "50vw";

  // Title
  const title = document.createElement("h2");
  title.textContent = "MOODBREW 😔";
  title.style.marginBottom = "2vh";
  title.style.fontSize = "2.5vw";
  title.style.color = "#333";
  popup.appendChild(title);

  // Message
  const message = document.createElement("p");
  message.textContent =
    "I'm sorry, this coffee is not available at the moment.";
  message.style.fontSize = "2vw";
  message.style.color = "#555";
  message.style.marginBottom = "3vh";
  popup.appendChild(message);

  // OK Button
  const okButton = document.createElement("button");
  okButton.textContent = "Okay";
  okButton.style.padding = "1vh 3vw";
  okButton.style.fontSize = "1.8vw";
  okButton.style.backgroundColor = "#f4a261";
  okButton.style.border = "none";
  okButton.style.borderRadius = "10px";
  okButton.style.cursor = "pointer";
  okButton.style.color = "white";
  okButton.style.fontFamily = "Jua, sans-serif";
  okButton.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
  popup.appendChild(okButton);

  // Close popup when OK button is clicked
  okButton.addEventListener("click", function () {
    viewCoffeesMM();
    body.removeChild(overlay);
  });

  overlay.appendChild(popup);
}

function MMCoffeeScoreSort() {
  if (moodPoints <= -15) {
    pic1 = "Dirty Matcha_LABEL.png"; // Red
    pic2 = "Salted caramel_LABEL.png";
    pic3 = "notavailable.png";
    ctype1 = MMCoffee14;
    ctype2 = MMCoffee13;
    ctype3 = emptyFuncMM;
  } else if (moodPoints >= -14 && moodPoints <= -5) {
    pic1 = "White Mocha_LABEL.png"; // Orange
    pic2 = "Caramel Macchiato_LABEL.png";
    pic3 = "Mocha_LABEL.png";
    ctype1 = MMCoffee12;
    ctype2 = MMCoffee11;
    ctype3 = MMCoffee10;
  } else if (moodPoints >= -4 && moodPoints <= 4) {
    pic1 = "CafeLatte_LABEL.png"; // Yellow
    pic2 = "Butterscotch Latte_LABEL.png";
    pic3 = "French Vanilla_LABEL.png";
    ctype1 = MMCoffee9;
    ctype2 = MMCoffee8;
    ctype3 = MMCoffee7;
  } else if (moodPoints >= 5 && moodPoints <= 14) {
    pic1 = "Flatwhite Final_LABEL.png"; // Blue
    pic2 = "Hazelnut Latte_LABEL.png";
    pic3 = "Spanish Latte_LABEL.png";
    ctype1 = MMCoffee6;
    ctype2 = MMCoffee5;
    ctype3 = MMCoffee4;
  } else {
    pic1 = "Dirty Matcha_LABEL.png"; // Green
    pic2 = "IcedCap_LABEL.png";
    pic3 = "Americano_LABEL.png";
    ctype1 = MMCoffee3;
    ctype2 = MMCoffee2;
    ctype3 = MMCoffee1;
  }
}
function viewCoffeesMM() {
  MMCoffeeScoreSort();

  yourcoffeessound.currentTime = 0;
  yourcoffeessound.play();

  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  // Create a style tag for the pulse animation
  const style = document.createElement("style");
  style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.85; }
    100% { transform: scale(1); opacity: 1; }
  }

  .pulse-effect {
    animation: pulse 2s infinite ease-in-out;
  }
`;
  document.head.appendChild(style);

  // Create the h1 element
  const n1 = document.createElement("h1");
  n1.textContent = "Your Coffees based on your mood!";
  n1.classList.add("pulse-effect");

  // Style the h1 element
  Object.assign(n1.style, {
    color: "black",
    width: "60vw",
    fontFamily: "JUA, sans-serif",
    position: "absolute",
    fontSize: "4vw",
    top: "-2vh",
    left: "21vw",
    textAlign: "center",
    textShadow: "7px 6px 6px rgba(0, 0, 0, 0.1)",
  });

  document.body.appendChild(n1);

  const n11 = document.createElement("h1");
  n11.textContent =
    "We've carefully selected a variety of coffee options just for you. Take a look at the available choices below and pick the one that suits your vibe the best!";

  // Apply styles
  Object.assign(n11.style, {
    color: "#333",
    width: "45vw",
    fontFamily: "'JUA', sans-serif",
    position: "absolute",
    fontSize: "1.5vw",
    lineHeight: "1.2",
    top: "15vh",
    left: "26vw",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: "1.5vh 2vw",
    borderRadius: "50px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.7)",
    fontStyle: "italic",
    textShadow: "7px 6px 6px rgba(0, 0, 0, 0.1)",
  });

  document.body.appendChild(n11);

  //MOODMETER COFFEES 3 PICS
  const x = document.createElement("img");
  x.src = pic1;
  x.style.position = "absolute";
  x.style.width = "20vw";
  x.style.height = "auto";
  x.style.top = "35vh";
  x.style.left = "18vw";
  x.style.border = "5px solid white";
  x.style.borderRadius = "40px";
  x.id = "lols";
  glowBox("lols");
  x.classList.add("pulse-effect"); // Add the pulse effect class
  body.appendChild(x);
  x.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    ctype1();
  });

  const xx = document.createElement("img");
  xx.src = pic2;
  xx.style.position = "absolute";
  xx.style.width = "20vw";
  xx.style.height = "auto";
  xx.style.top = "35vh";
  xx.style.left = "40vw";
  xx.style.border = "5px solid white";
  xx.style.borderRadius = "40px";
  xx.classList.add("pulse-effect"); // Add the pulse effect class

  xx.id = "lols";

  glowBox("lols");
  body.appendChild(xx);
  xx.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    ctype2();
  });

  const xxx = document.createElement("img");
  xxx.src = pic3;
  xxx.style.position = "absolute";
  xxx.style.width = "20vw";
  xxx.style.height = "auto";
  xxx.style.top = "35vh";
  xxx.style.left = "62vw";
  xxx.style.border = "5px solid white";
  xxx.style.borderRadius = "40px";
  xxx.id = "lols";
  glowBox("lols");
  body.appendChild(xxx);
  xxx.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    ctype3();
  });

  const lx = document.createElement("img");
  lx.src = "BACK_BTN_TABLET.png";
  lx.style.position = "absolute";
  lx.style.width = "8vw";
  lx.style.height = "auto";
  lx.style.top = "90vh";
  lx.style.left = "46vw";
  glowBox("lols");
  body.appendChild(lx);
  lx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    scoreResult();
    selectedCoffees = [];
  });
}

function AmericanoVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "ICED AMERICANO";
  n1.style.color = "black";
  n1.style.width = "29vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Americano.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.zIndex = "1";
  xxx.style.border = "0.4vw solid white";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Iced Americano",
        image: "Americano.png",
        size: selectedSize,
        price12oz: 95,
        price16oz: 95,
        quantity: count,
        originFunction: AmericanoVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>42%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>48%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 95, price16: 95 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso \n• Hot / Cold Water \n• Sugar";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "Americano Coffee—bold, smooth, and refreshingly simple. Made by adding hot water to rich espresso, it delivers a full-bodied taste with a lighter finish. Perfect for those who love their coffee strong, but not too intense.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function IcedCapVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "ICED CAPPUCCINO";
  n1.style.color = "black";
  n1.style.width = "31vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);
  const xx = document.createElement("img");
  xx.src = "IcedCap.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");
  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size!");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Iced Cappuccino",
        image: "IcedCap.png",
        size: selectedSize,
        price12oz: 120,
        price16oz: 120,
        quantity: count,
        originFunction: IcedCapVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
    background: white;
    border: 0.2vw solid black;
    border-radius: 1.2vw;
    box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
    padding: 1vh 2vw;
    font-size: 1.3vw;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    color: black;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
    color: blue;
    font-size: 1.6vw;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
    font-size: 1.6vw;
    }

    .caffeine-btn.active {
    background-color: #11E99D;
    }

    .caffeine-btn.active span {
    color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 120, price16: 120 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Milk Foam\n• Sugar";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "An iced cappuccino is a smooth and refreshing coffee drink, known for its bold flavor and airy, creamy finish. It's the perfect balance of richness and cool elegance—ideal for a refined yet energizing pick-me-up.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function DirtyMatchaVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "DIRTY MATCHA";
  n1.style.color = "black";
  n1.style.width = "25vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Dirty Matcha.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");
  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Dirty Matcha",
        image: "Dirty Matcha.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: DirtyMatchaVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
      .caffeine-btn {
        background: white;
        border: 0.2vw solid black;
        border-radius: 1.2vw;
        box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
        padding: 1vh 2vw;
        font-size: 1.3vw;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        color: black;
        text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
      }

      .caffeine-btn span {
        color: blue;
        font-size: 1.6vw;
        text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
      }

      .caffeine-btn strong {
        font-size: 1.6vw;
      }

      .caffeine-btn.active {
        background-color: #11E99D;
      }

      .caffeine-btn.active span {
        color: white;
      }
    `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>37%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>41%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Matcha Powder\n• Sweetener";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A dirty matcha is a unique fusion of earthy matcha and bold espresso, creating a smooth, slightly sweet drink with a subtle kick. It's a beautifully layered blend that’s both calming and energizing—perfect for those who love a twist on tradition.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";

    const body = document.body;
    body.innerHTML = "";
    body.style.backgroundImage = "";
    body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
    body.style.backgroundAttachment = "fixed";
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundSize = "cover";

    const n1 = document.createElement("h1");
    n1.textContent = "Dirty Matcha";
    n1.style.color = "black";
    n1.style.width = "50vw";
    n1.style.fontFamily = "JUA, sans-serif";
    n1.style.position = "absolute";
    n1.style.fontSize = "3.4vw";
    n1.style.top = "9.5vh";
    n1.style.left = "43vw";
    n1.style.zIndex = "1";
    n1.id = "l";
    body.appendChild(n1);

    const xx = document.createElement("img");
    xx.src = "Dirty Matcha.png";
    xx.style.position = "absolute";
    xx.style.width = "29vw"; //CHANGED TO 30vw
    xx.style.height = "auto";
    xx.style.top = "10vh"; //CHANGED TO 10vh
    xx.style.left = "10vw";
    xx.id = "gl";
    xx.style.border = "0.4vw  solid white";
    xx.style.borderRadius = "80px";
    xx.style.zIndex = "1";
    body.appendChild(xx);
    glowBox("gl");

    const xxx = document.createElement("img");
    xxx.src = "check_button.png";
    xxx.style.position = "absolute";
    xxx.style.width = "10vw";
    xxx.style.height = "auto";
    xxx.style.top = "68vh";
    xxx.style.left = "75vw";
    xxx.style.borderRadius = "8vw";
    xxx.style.border = "0.4vw solid white";
    xxx.style.zIndex = "1";
    xxx.classList.add("pulse");
    xxx.addEventListener("click", () => {
      const selectedButton = buttons.find((b) =>
        b.classList.contains("active")
      );

      if (!selectedButton) {
        alert("Please select a size");
      } else {
        nextbuttonsfx.currentTime = 0;
        nextbuttonsfx.play();
        const selectedSize = selectedButton.innerText.split(":")[0];

        lastCoffee = {
          name: "Dirty Matcha",
          image: "Dirty Matcha.png",
          size: selectedSize,
          price12oz: 140,
          price16oz: 140,
          quantity: count,
          originFunction: DirtyMatchaVCS,
        };
        selectedCoffees.push(lastCoffee);
        orderSummarySkip();
      }
    });
    body.appendChild(xxx);

    const xxxxx = document.createElement("img");
    xxxxx.src = "BACK_BTN_TABLET.png";
    xxxxx.style.position = "absolute";
    xxxxx.style.width = "8vw";
    xxxxx.style.height = "auto";
    xxxxx.style.top = "10vh";
    xxxxx.style.left = "80vw";
    xxxxx.style.borderRadius = "80px";
    xxxxx.style.zIndex = "1";
    xxxxx.addEventListener("click", () => {
      backbtnsfx.currentTime = 0;
      backbtnsfx.play();
      viewCoffeesSkip();
    });
    body.appendChild(xxxxx);

    const style = document.createElement("style");
    style.textContent = `
      .caffeine-btn {
        background: white;
        border: 1px solid black;
        border-radius: 12px;
        box-shadow: 3px 3px 5px rgba(0,0,0,0.3);
        padding: 10px 20px;
        font-size: 1.3rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        color: black;
        text-shadow: 2px 2px 3px rgba(0,0,0,0.2);
      }
  
      .caffeine-btn span {
        color: blue;
        font-size: 1.6rem;
        text-shadow: 2px 2px 3px rgba(0,0,0,0.2);
      }
  
      .caffeine-btn strong {
        font-size: 1.6rem;
      }
  
      .caffeine-btn.active {
        background-color: #11E99D;
      }
  
      .caffeine-btn.active span {
        color: white;
      }
    `;
    document.head.appendChild(style);

    const btn12 = document.createElement("button");
    btn12.className = "caffeine-btn";
    btn12.id = "btn12";
    btn12.innerHTML = `<strong>12 oz</strong>: <span>37%</span> of caffeine`;
    btn12.style.top = "36vh";
    btn12.style.left = "43vw";
    btn12.style.width = "16vw";
    btn12.style.height = "10vh";
    btn12.style.position = "absolute";
    body.appendChild(btn12);

    const btn16 = document.createElement("button");
    btn16.className = "caffeine-btn";
    btn16.id = "btn16";
    btn16.innerHTML = `<strong>16 oz</strong>: <span>41%</span> of caffeine`;
    btn16.style.top = "25vh";
    btn16.style.left = "43vw";
    btn16.style.width = "16vw";
    btn16.style.height = "10vh";
    btn16.style.position = "absolute";
    body.appendChild(btn16);

    const updatePrice = priceDisplay({ price12: 140, price16: 140 });
    const buttons = [btn12, btn16];
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const selectedSize = btn.innerText.split(":")[0];
        updatePrice(selectedSize);
      });
    });

    const n11 = document.createElement("h1");
    n11.textContent =
      "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Matcha Powder\n• Sweetener";
    n11.style.whiteSpace = "pre-line";
    n11.style.color = "black";
    n11.style.width = "20vw";
    n11.style.fontFamily = "JUA, sans-serif";
    n11.style.position = "absolute";
    n11.style.fontSize = "1.8vw";
    n11.style.top = "20vh";
    n11.style.left = "70vw";
    n11.style.zIndex = "1";
    n11.id = "l";
    body.appendChild(n11);

    const n111 = document.createElement("h1");
    n111.textContent =
      "A dirty matcha is a unique fusion of earthy matcha and bold espresso, creating a smooth, slightly sweet drink with a subtle kick. It's a beautifully layered blend that’s both calming and energizing—perfect for those who love a twist on tradition.";
    n111.style.whiteSpace = "pre-line";
    n111.style.color = "black";
    n111.style.width = "25vw";
    n111.style.fontFamily = "JUA, sans-serif";
    n111.style.position = "absolute";
    n111.style.fontSize = "1.2vw";
    n111.style.top = "46vh";
    n111.style.left = "43vw";
    n111.style.zIndex = "1";
    n111.id = "l";
    body.appendChild(n111);

    let count = 1;

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "−";
    styleQtyButton(minusBtn);

    const quantity = document.createElement("span");
    quantity.textContent = "1";
    quantity.style.fontSize = "38px";
    quantity.style.minWidth = "50px";
    quantity.style.textAlign = "center";
    quantity.style.border = "2px solid #ccc";
    quantity.style.borderRadius = "15px";
    quantity.style.padding = "20px";
    quantity.style.boxShadow = "0 6px 12px rgba(0,0,0,0.2)";
    quantity.style.backgroundColor = "#fff";

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    styleQtyButton(plusBtn);

    plusBtn.addEventListener("click", () => {
      if (count < 10) {
        count++;
        quantity.textContent = count;
      }
    });

    minusBtn.addEventListener("click", () => {
      if (count > 1) {
        count--;
        quantity.textContent = count;
      }
    });

    minusBtn.style.top = "70vh";
    minusBtn.style.left = "45vw";
    minusBtn.style.position = "absolute";

    plusBtn.style.top = "70vh";
    plusBtn.style.left = "56.5vw";
    plusBtn.style.position = "absolute";

    quantity.style.top = "69.6vh";
    quantity.style.left = "51vw";
    quantity.style.position = "absolute";

    body.appendChild(minusBtn);
    body.appendChild(quantity);
    body.appendChild(plusBtn);

    function styleQtyButton(btn) {
      btn.style.width = "5.4vw";
      btn.style.height = "9vh";
      btn.style.fontSize = "3.1vw";
      btn.style.fontWeight = "bold";
      btn.style.color = "#000";
      btn.style.border = "2px solid #ccc";
      btn.style.borderRadius = "20px";
      btn.style.backgroundColor = "#f9f9f9";
      btn.style.cursor = "pointer";
      btn.style.boxShadow = "0 8px 12px rgba(0,0,0,0.15)";
      btn.style.transition = "all 0.1s ease";

      btn.addEventListener("mouseover", () => {
        btn.style.transform = "scale(1.1)";
      });

      btn.addEventListener("mouseout", () => {
        btn.style.transform = "scale(1)";
        resetColor(btn);
      });

      btn.addEventListener("mousedown", () => {
        btn.style.transform = "scale(0.95)";
        if (btn === plusBtn) {
          btn.style.backgroundColor = "#2ecc71";
          btn.style.color = "#fff";
        } else if (btn === minusBtn) {
          btn.style.backgroundColor = "#e74c3c";
          btn.style.color = "#fff";
        }
      });

      btn.addEventListener("mouseup", () => {
        btn.style.transform = "scale(1.1)";
        resetColor(btn);
      });
    }

    function resetColor(btn) {
      btn.style.backgroundColor = "#f9f9f9";
      btn.style.color = "#000";
    }
  }
}

function SpanishLatteVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "SPANISH LATTE";
  n1.style.color = "black";
  n1.style.width = "27vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Spanish Latte.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Spanish Latte",
        image: "Spanish Latte.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: SpanishLatteVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
    background: white;
    border: 0.2vw solid black;
    border-radius: 1.2vw;
    box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
    padding: 1vh 2vw;
    font-size: 1.3vw;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    color: black;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
    color: blue;
    font-size: 1.6vw;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
    font-size: 1.6vw;
    }

    .caffeine-btn.active {
    background-color: #11E99D;
    }

    .caffeine-btn.active span {
    color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Condensed Milk";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A Spanish latte is a creamy and indulgent coffee drink with a hint of sweetness. Smooth and rich, it offers a perfect balance of espresso and milk, making it a comforting choice for those who enjoy a mellow yet flavorful coffee experience.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function HazelnutLatteVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "HAZELNUT LATTE";
  n1.style.color = "black";
  n1.style.width = "31vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Hazelnut Latte.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Hazelnut Latte",
        image: "Hazelnut Latte.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: HazelnutLatteVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
    background: white;
    border: 0.2vw solid black;
    border-radius: 1.2vw;
    box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
    padding: 1vh 2vw;
    font-size: 1.3vw;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    color: black;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
    color: blue;
    font-size: 1.6vw;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
    font-size: 1.6vw;
    }

    .caffeine-btn.active {
    background-color: #11E99D;
    }

    .caffeine-btn.active span {
    color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Hazelnut Syrup";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A hazelnut latte is a warm, nutty delight that blends smooth espresso with creamy milk and a touch of hazelnut sweetness. Rich, comforting, and aromatic, it's a cozy favorite for those who love a little flavor in their daily coffee ritual.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function FlatwhiteVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "FLAT WHITE";
  n1.style.color = "black";
  n1.style.width = "21vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "42vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Flatwhite Final.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Flat White",
        image: "Flatwhite Final.png",
        size: selectedSize,
        price12oz: 110,
        price16oz: 110,
        quantity: count,
        originFunction: FlatwhiteVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
    background: white;
    border: 0.2vw solid black;
    border-radius: 1.2vw;
    box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
    padding: 1vh 2vw;
    font-size: 1.3vw;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    color: black;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }
  
    .caffeine-btn span {
    color: blue;
    font-size: 1.6vw;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }
  
    .caffeine-btn strong {
    font-size: 1.6vw;
    }
  
    .caffeine-btn.active {
    background-color: #11E99D;
    }
  
    .caffeine-btn.active span {
    color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12 oz</strong>: <span>37%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16 oz</strong>: <span>41%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 110, price16: 110 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent = "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Sugar";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A flat white is a silky-smooth coffee made with a rich shot of espresso and velvety steamed milk. Known for its balanced flavor and creamy texture, it’s a refined choice for those who enjoy a bold yet smooth coffee experience without the extra foam.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function ButterscotchLatteVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "BUTTERSCOTCH LATTE";
  n1.style.color = "black";
  n1.style.width = "34vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.2vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Butterscotch Latte.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Butterscotch Latte",
        image: "Butterscotch Latte.png",
        size: selectedSize,
        price12oz: 125,
        price16oz: 125,
        quantity: count,
        originFunction: ButterscotchLatteVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
    background: white;
    border: 0.2vw solid black;
    border-radius: 1.2vw;
    box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
    padding: 1vh 2vw;
    font-size: 1.3vw;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    color: black;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
    color: blue;
    font-size: 1.6vw;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
    font-size: 1.6vw;
    }

    .caffeine-btn.active {
    background-color: #11E99D;
    }

    .caffeine-btn.active span {
    color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 125, price16: 125 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Butterscotch Syrup";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A butterscotch latte is a rich and cozy indulgence, blending smooth espresso with creamy milk and a buttery-sweet hint of butterscotch. Warm, velvety, and irresistibly flavorful—it’s like a hug in a cup.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function CafeLatteVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "CAFE LATTE";
  n1.style.color = "black";
  n1.style.width = "22vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "42vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "CafeLatte.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Cafe Latte",
        image: "CafeLatte.png",
        size: selectedSize,
        price12oz: 120,
        price16oz: 120,
        quantity: count,
        originFunction: CafeLatteVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
    background: white;
    border: 0.2vw solid black;
    border-radius: 1.2vw;
    box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
    padding: 1vh 2vw;
    font-size: 1.3vw;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    color: black;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
    color: blue;
    font-size: 1.6vw;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
    font-size: 1.6vw;
    }

    .caffeine-btn.active {
    background-color: #11E99D;
    }

    .caffeine-btn.active span {
    color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 120, price16: 120 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent = "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Sugar";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A café latte is a timeless classic, known for its smooth blend of bold espresso and steamed milk. With its mild flavor and creamy texture, it’s a comforting, everyday favorite that’s both simple and satisfying.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function MochaVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "MOCHA";
  n1.style.color = "black";
  n1.style.width = "14vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "4.2vw";
  n1.style.top = "4.5vh";
  n1.style.left = "42.6vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);
  const xx = document.createElement("img");
  xx.src = "Mocha.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Mocha",
        image: "Mocha.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: MochaVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16oz</strong>: <span>37%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Chocolate Syrup";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A mocha coffee is a decadent fusion of rich espresso and velvety chocolate, blended with steamed milk for a smooth, indulgent treat. Perfectly balanced between bold and sweet, it’s a delightful pick-me-up for coffee and chocolate lovers alike.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function CaramelMacchiatoVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "CARAMEL MACCHIATO";
  n1.style.color = "black";
  n1.style.width = "32vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.2vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Caramel Macchiato.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Caramel Macchiato",
        image: "Caramel Macchiato.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: CaramelMacchiatoVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
    background: white;
    border: 0.2vw solid black;
    border-radius: 1.2vw;
    box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
    padding: 1vh 2vw;
    font-size: 1.3vw;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    color: black;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }
  
    .caffeine-btn span {
    color: blue;
    font-size: 1.6vw;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }
  
    .caffeine-btn strong {
    font-size: 1.6vw;
    }

    .caffeine-btn.active {
    background-color: #11E99D;
    }

    .caffeine-btn.active span {
    color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12 oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16 oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Caramel Syrup";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A caramel macchiato is a luscious coffee drink that layers bold espresso with creamy milk and a drizzle of golden caramel. Sweet, smooth, and slightly bold—it’s a delightful balance of richness and indulgence in every sip.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function WhiteMochaVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "WHITE MOCHA";
  n1.style.color = "black";
  n1.style.width = "24vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "42vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "White Mocha.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "White Mocha",
        image: "White Mocha.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: WhiteMochaVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
    background: white;
    border: 0.2vw solid black;
    border-radius: 1.2vw;
    box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
    padding: 1vh 2vw;
    font-size: 1.3vw;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    color: black;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
    color: blue;
    font-size: 1.6vw;
    text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
    font-size: 1.6vw;
    }

    .caffeine-btn.active {
    background-color: #11E99D;
    }

    .caffeine-btn.active span {
    color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12 oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16 oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• White Chocolate Syrup";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A white mocha is a luxuriously smooth coffee drink, blending rich espresso with creamy milk and sweet white chocolate. Velvety and indulgent, it’s a perfect choice for those who enjoy a mellow, dessert-like coffee experience.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function SaltedCaramelVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "SALTED CARAMEL LATTE";
  n1.style.color = "black";
  n1.style.width = "33vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "2.8vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Salted caramel.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Salted Caramel",
        image: "Salted caramel.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: SaltedCaramelVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
      .caffeine-btn {
        background: white;
        border: 0.2vw solid black;
        border-radius: 1.2vw;
        box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
        padding: 1vh 2vw;
        font-size: 1.3vw;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        color: black;
        text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
      }

      .caffeine-btn span {
        color: blue;
        font-size: 1.6vw;
        text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
      }

      .caffeine-btn strong {
        font-size: 1.6vw;
      }

      .caffeine-btn.active {
        background-color: #11E99D;
      }

      .caffeine-btn.active span {
        color: white;
      }
    `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12 oz</strong>: <span>21%</span> of caffeine`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16 oz</strong>: <span>32%</span> of caffeine`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Salted Caramel Syrup";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A salted caramel latte is a deliciously balanced blend of smooth espresso, steamed milk, and buttery caramel with a hint of sea salt. Sweet, creamy, and lightly savory—it’s a comforting treat with a gourmet twist.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

//COFFEES NOT IN MOOD METER

function CapuccinoVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "CAPPUCCINO";
  n1.style.color = "black";
  n1.style.width = "22vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "42vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Cappuccino.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Cappuccino",
        image: "Cappuccino",
        size: selectedSize,
        price12oz: 120,
        price16oz: 120,
        quantity: count,
        originFunction: CapuccinoVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12 ounces</strong>`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16 ounces</strong>`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 120, price16: 120 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Steamed Milk\n• Milk Foam\n• Sugar";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A cappuccino is a rich and balanced espresso drink, celebrated for its harmonious layers of bold coffee, velvety steamed milk, and airy milk foam. Its bold yet smooth profile makes it a refined choice for those who enjoy a touch of elegance in every sip.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function CaraMatchaFrappeVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "CARAMATCHA FRAPPE";
  n1.style.color = "black";
  n1.style.width = "33vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.2vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "CaraMatcha Frappe.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "CaraMatcha Frappe",
        image: "CaraMatcha Frappe.png",
        size: selectedSize,
        price12oz: 135,
        price16oz: 135,
        quantity: count,
        originFunction: CaraMatchaFrappeVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12 ounces</strong>`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16 ounces</strong>`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 135, price16: 135 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Milk\n• Ice\n• Caramel Syrup\n• Chocolate Chips\n• Whipped Cream\n• Sugar";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "74vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A Caramatcha Frappe is a refreshing fusion of earthy matcha and sweet caramel, blended with ice and creamy milk for a smooth, indulgent treat. Its unique balance of bold green tea and rich caramel offers a playful twist on a classic iced favorite.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function ChocoChipFrappeVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "CHOCO CHIP FRAPPE";
  n1.style.color = "black";
  n1.style.width = "31vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.2vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Choco Chip Frappe.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Choco Chip Frappe",
        image: "Choco Chip Frappe.png",
        size: selectedSize,
        price12oz: 135,
        price16oz: 135,
        quantity: count,
        originFunction: ChocoChipFrappeVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12 ounces</strong>`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16 ounces</strong>`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 135, price16: 135 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Milk\n• Ice\n• Chocolate Syrup\n• Chocolate Chips\n• Whipped Cream";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A Choco Chip Frappe is a delightful blend of rich chocolate, creamy milk, and crunchy chocolate chips, all whipped together with ice for a cool, satisfying treat. It's a dessert-like drink that combines sweetness and texture in every sip—perfect for chocolate lovers.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function ChocolateVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "CHOCOLATE";
  n1.style.color = "black";
  n1.style.width = "21vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "42vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Chocolate.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Chocolate",
        image: "Chocolate.png",
        size: selectedSize,
        price12oz: 135,
        price16oz: 135,
        quantity: count,
        originFunction: ChocolateVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12 ounces</strong>`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16 ounces</strong>`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 135, price16: 135 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Steamed Milk\n• Chocolate Syrup\n• Milk Foam";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A Chocolate drink is a rich and creamy indulgence, blending smooth milk with decadent chocolate syrup and a touch of foam. Perfect for satisfying your sweet tooth and warming your soul.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function MatchaVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "MATCHA";
  n1.style.color = "black";
  n1.style.width = "16vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "4.2vw";
  n1.style.top = "4.5vh";
  n1.style.left = "42vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Matcha.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Matcha",
        image: "Matcha.png",
        size: selectedSize,
        price12oz: 135,
        price16oz: 135,
        quantity: count,
        originFunction: MatchaVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12 ounces</strong>`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16 ounces</strong>`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 135, price16: 135 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Matcha Powder\n• Steamed Milk\n• Sweetener";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "Matcha is a vibrant green tea known for its earthy flavor, subtle sweetness, and smooth, creamy texture. Packed with antioxidants, it's both refreshing and calming—perfect for moments of mindful indulgence.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function SaltedCFVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "SALTED CARAMEL FRAPPUCCINO";
  n1.style.color = "black";
  n1.style.width = "24vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "2.8vw";
  n1.style.top = "3.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Salted Caramel Frappuccino.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Salted Caramel Frappuccino",
        image: "Salted Caramel Frappuccino.png",
        size: selectedSize,
        price12oz: 135,
        price16oz: 135,
        quantity: count,
        originFunction: SaltedCFVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12 ounces</strong>`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16 ounces</strong>`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 135, price16: 135 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Espresso\n• Milk\n• Ice\n• Salted Caramel Syrup\n• Whipped Cream";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "A Salted Caramel Frappuccino is a sweet and salty delight, blending rich caramel, creamy milk, and ice, topped with a hint of sea salt. It’s a crave-worthy treat that delivers the perfect balance of indulgence and refreshment.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function StrawberryMatchaVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "STRAWBERRY MATCHA";
  n1.style.color = "black";
  n1.style.width = "33vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.2vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Strawberry Matcha.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Strawberry Matcha",
        image: "Strawberry Matcha.png",
        size: selectedSize,
        price12oz: 150,
        price16oz: 150,
        quantity: count,
        originFunction: StrawberryMatchaVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12 ounces</strong>`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16 ounces</strong>`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 150, price16: 150 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Matcha Powder\n• Steamed Milk\n• Strawberry Syrup";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "Strawberry Matcha is a refreshing fusion of fruity sweetness and earthy richness, combining vibrant matcha with luscious strawberry flavors. Its unique blend offers a colorful twist that’s both energizing and delightfully smooth.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function StrawberryMilkVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "STRAWBERRY MILK";
  n1.style.color = "black";
  n1.style.width = "31vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.5vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Strawberry Milk.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Strawberry Milk",
        image: "Strawberry Milk.png",
        size: selectedSize,
        price12oz: 140,
        price16oz: 140,
        quantity: count,
        originFunction: StrawberryMilkVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12 ounces</strong>`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16 ounces</strong>`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 140, price16: 140 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent = "Ingredients: \n\n• Steamed Milk\n• Strawberry Syrup";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "Strawberry Milk is a nostalgic favorite, blending creamy milk with the sweet, fruity flavor of ripe strawberries. Smooth and comforting, it’s a simple yet delightful treat loved by all ages.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function UbeTarroFrappeVCS() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "UBE TARRO FRAPPE";
  n1.style.color = "black";
  n1.style.width = "34vw";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "3.7vw";
  n1.style.top = "6.5vh";
  n1.style.left = "40vw";
  n1.style.zIndex = "1";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  n1.style.backgroundColor = "white";
  n1.style.padding = "1vh 1vw";
  n1.style.borderRadius = "2vw";
  n1.style.transition = "transform 1.5s ease-in-out"; // <- smooth transition
  n1.style.animation = "floaty 3s ease-in-out infinite"; // <- floating effect
  n1.id = "l";
  body.appendChild(n1);

  // Create the keyframes for the floaty animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
  @keyframes floaty {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  `;
  document.head.appendChild(styleSheet);

  const xx = document.createElement("img");
  xx.src = "Ube Tarro Frappe.png";
  xx.style.position = "absolute";
  xx.style.width = "29vw";
  xx.style.height = "auto";
  xx.style.top = "10vh";
  xx.style.left = "10vw";
  xx.id = "gl";
  xx.style.border = "0.5vw solid white";
  xx.style.borderRadius = "8vw";
  xx.style.zIndex = "1";
  body.appendChild(xx);
  glowBox("gl");

  const xxx = document.createElement("img");
  xxx.src = "check_button.png";
  xxx.style.position = "absolute";
  xxx.style.width = "10vw";
  xxx.style.height = "auto";
  xxx.style.top = "68vh";
  xxx.style.left = "75vw";
  xxx.style.borderRadius = "8vw";
  xxx.style.border = "0.4vw solid white";
  xxx.style.zIndex = "1";
  xxx.classList.add("pulse");

  xxx.addEventListener("click", () => {
    const selectedButton = buttons.find((b) => b.classList.contains("active"));

    if (!selectedButton) {
      alert("Please select a size");
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      const selectedSize = selectedButton.innerText.split(":")[0];

      lastCoffee = {
        name: "Ube Tarro Frappe",
        image: "Ube Tarro Frappe.png",
        size: selectedSize,
        price12oz: 135,
        price16oz: 135,
        quantity: count,
        originFunction: UbeTarroFrappeVCS,
      };
      selectedCoffees.push(lastCoffee);
      orderSummarySkip();
    }
  });
  body.appendChild(xxx);

  const xxxxx = document.createElement("img");
  xxxxx.src = "BACK_BTN_TABLET.png";
  xxxxx.style.position = "absolute";
  xxxxx.style.width = "8vw";
  xxxxx.style.height = "auto";
  xxxxx.style.top = "10vh";
  xxxxx.style.left = "80vw";
  xxxxx.style.borderRadius = "8vw";
  xxxxx.style.zIndex = "1";
  xxxxx.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(xxxxx);

  const style = document.createElement("style");
  style.textContent = `
    .caffeine-btn {
      background: white;
      border: 0.2vw solid black;
      border-radius: 1.2vw;
      box-shadow: 0.3vw 0.3vw 0.5vw rgba(0,0,0,0.3);
      padding: 1vh 2vw;
      font-size: 1.3vw;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: black;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn span {
      color: blue;
      font-size: 1.6vw;
      text-shadow: 0.2vw 0.2vw 0.3vw rgba(0,0,0,0.2);
    }

    .caffeine-btn strong {
      font-size: 1.6vw;
    }

    .caffeine-btn.active {
      background-color: #11E99D;
    }

    .caffeine-btn.active span {
      color: white;
    }
  `;
  document.head.appendChild(style);

  const btn12 = document.createElement("button");
  btn12.className = "caffeine-btn";
  btn12.id = "btn12";
  btn12.innerHTML = `<strong>12 ounces</strong>`;
  btn12.style.top = "25vh";
  btn12.style.left = "43vw";
  btn12.style.position = "absolute";
  btn12.style.width = "16vw";
  btn12.style.height = "10vh";
  body.appendChild(btn12);

  const btn16 = document.createElement("button");
  btn16.className = "caffeine-btn";
  btn16.id = "btn16";
  btn16.innerHTML = `<strong>16 ounces</strong>`;
  btn16.style.top = "36vh";
  btn16.style.left = "43vw";
  btn16.style.position = "absolute";
  btn16.style.width = "16vw";
  btn16.style.height = "10vh";
  body.appendChild(btn16);

  const updatePrice = priceDisplay({ price12: 135, price16: 135 });
  const buttons = [btn12, btn16];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedSize = btn.innerText.split(":")[0];
      updatePrice(selectedSize);
    });
  });

  const n11 = document.createElement("h1");
  n11.textContent =
    "Ingredients: \n\n• Milk\n• Ice\n• Ube & Taro Syrup\n• Whipped Cream";
  n11.style.whiteSpace = "pre-line";
  n11.style.color = "black";
  n11.style.width = "20vw";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "1.8vw";
  n11.style.top = "20vh";
  n11.style.left = "70vw";
  n11.style.zIndex = "1";
  n11.id = "l";
  body.appendChild(n11);

  const n111 = document.createElement("h1");
  n111.textContent =
    "An Ube Taro Frappe is a vibrant, creamy blend of earthy taro and sweet ube, mixed with ice for a smooth, refreshing experience. Its unique flavor and rich purple hue make it a standout treat that's as tasty as it is eye-catching.";
  n111.style.whiteSpace = "pre-line";
  n111.style.color = "black";
  n111.style.width = "25vw";
  n111.style.fontFamily = "JUA, sans-serif";
  n111.style.position = "absolute";
  n111.style.fontSize = "1.2vw";
  n111.style.top = "46vh";
  n111.style.left = "43vw";
  n111.style.zIndex = "1";
  n111.id = "l";
  body.appendChild(n111);

  let count = 1;

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  styleQtyButton(minusBtn);

  const quantity = document.createElement("span");
  quantity.textContent = "1";
  quantity.style.fontSize = "3.8vw";
  quantity.style.minWidth = "5vw";
  quantity.style.textAlign = "center";
  quantity.style.border = "0.2vw solid #ccc";
  quantity.style.borderRadius = "1.5vw";
  quantity.style.padding = "2vh";
  quantity.style.boxShadow = "0 0.6vh 1.2vh rgba(0,0,0,0.2)";
  quantity.style.backgroundColor = "#fff";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  styleQtyButton(plusBtn);

  plusBtn.addEventListener("click", () => {
    if (count < 10) {
      count++;
      quantity.textContent = count;
    }
  });

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantity.textContent = count;
    }
  });

  minusBtn.style.top = "70vh";
  minusBtn.style.left = "45vw";
  minusBtn.style.position = "absolute";

  plusBtn.style.top = "70vh";
  plusBtn.style.left = "59vw";
  plusBtn.style.position = "absolute";

  quantity.style.top = "69.6vh";
  quantity.style.left = "51vw";
  quantity.style.position = "absolute";

  body.appendChild(minusBtn);
  body.appendChild(quantity);
  body.appendChild(plusBtn);

  function styleQtyButton(btn) {
    btn.style.width = "5.4vw";
    btn.style.height = "9vh";
    btn.style.fontSize = "3.1vw";
    btn.style.fontWeight = "bold";
    btn.style.color = "#000";
    btn.style.border = "0.2vw solid #ccc";
    btn.style.borderRadius = "2vw";
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 0.8vh 1.2vh rgba(0,0,0,0.15)";
    btn.style.transition = "all 0.1s ease";

    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "scale(1)";
      resetColor(btn);
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.95)";
      if (btn === plusBtn) {
        btn.style.backgroundColor = "#2ecc71";
        btn.style.color = "#fff";
      } else if (btn === minusBtn) {
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "#fff";
      }
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1.1)";
      resetColor(btn);
    });
  }

  function resetColor(btn) {
    btn.style.backgroundColor = "#f9f9f9";
    btn.style.color = "#000";
  }
}

function emptyFunc() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundColor = "#fbd0da";

  // Create overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "1000";
  body.appendChild(overlay);

  // Create popup box
  const popup = document.createElement("div");
  popup.style.backgroundColor = "white";
  popup.style.padding = "3vh 5vw";
  popup.style.borderRadius = "20px";
  popup.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
  popup.style.textAlign = "center";
  popup.style.fontFamily = "Jua, sans-serif";
  popup.style.width = "50vw";

  // Title
  const title = document.createElement("h2");
  title.textContent = "MOODBREW 😔";
  title.style.marginBottom = "2vh";
  title.style.fontSize = "2.5vw";
  title.style.color = "#333";
  popup.appendChild(title);

  // Message
  const message = document.createElement("p");
  message.textContent =
    "I'm sorry, this coffee is not available at the moment.";
  message.style.fontSize = "2vw";
  message.style.color = "#555";
  message.style.marginBottom = "3vh";
  popup.appendChild(message);

  // OK Button
  const okButton = document.createElement("button");
  okButton.textContent = "Okay";
  okButton.style.padding = "1vh 3vw";
  okButton.style.fontSize = "1.8vw";
  okButton.style.backgroundColor = "#f4a261";
  okButton.style.border = "none";
  okButton.style.borderRadius = "10px";
  okButton.style.cursor = "pointer";
  okButton.style.color = "white";
  okButton.style.fontFamily = "Jua, sans-serif";
  okButton.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
  popup.appendChild(okButton);

  // Close popup when OK button is clicked
  okButton.addEventListener("click", function () {
    viewCoffeesSkip();
    body.removeChild(overlay);
  });

  overlay.appendChild(popup);
}

function viewCoffeesSkip() {
  const body = document.body;
  body.innerHTML = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const filters = [
    { label: "Coffee Based:", id: "coffeeCheckbox", left: "24.6vw" },
    { label: "Non-Coffee Based:", id: "nonCoffeeCheckbox", left: "40.6vw" },
    { label: "ALL Coffee:", id: "allCheckbox", left: "60vw" },
  ];

  filters.forEach((filter) => {
    const lbl = document.createElement("label");
    lbl.textContent = filter.label;
    lbl.style.position = "absolute";
    lbl.style.top = "10vh";
    lbl.style.left = filter.left;
    lbl.style.fontFamily = "JUA, sans-serif";
    lbl.style.fontSize = "1.7vw";
    lbl.style.color = "black";
    body.appendChild(lbl);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = filter.id;
    checkbox.style.position = "absolute";
    checkbox.style.top = "15.5vh";
    checkbox.style.left = `calc(${filter.left} + 7vw)`;
    checkbox.style.transform = "scale(2.2)";
    body.appendChild(checkbox);
  });

  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "30vh";
  container.style.left = "10vw";
  container.style.width = "80vw";
  container.style.height = "53vh";
  container.style.overflowY = "scroll";
  container.style.display = "flex";
  container.style.flexWrap = "wrap";
  container.style.justifyContent = "center";
  container.style.gap = "2vw";
  body.appendChild(container);

  const allCheckbox = document.getElementById("allCheckbox");
  const coffeeCheckbox = document.getElementById("coffeeCheckbox");
  const nonCoffeeCheckbox = document.getElementById("nonCoffeeCheckbox");

  allCheckbox.checked = true;

  const drinkList = [
    {
      name: "Americano",
      img: "Americano_LABEL.png",
      func: AmericanoVCS,
      type: "coffee",
    },
    {
      name: "Iced Cappuccino",
      img: "IcedCap_LABEL.png",
      func: IcedCapVCS,
      type: "coffee",
    },
    {
      name: "Butterscotch Latte",
      img: "Butterscotch Latte_LABEL.png",
      func: ButterscotchLatteVCS,
      type: "coffee",
    },
    {
      name: "Cafe Latte",
      img: "CafeLatte_LABEL.png",
      func: CafeLatteVCS,
      type: "coffee",
    },
    {
      name: "Cappuccino",
      img: "Cappuccino_LABEL.png",
      func: CapuccinoVCS,
      type: "coffee",
    },
    {
      name: "Caramel Macchiato",
      img: "Caramel Macchiato_LABEL.png",
      func: CaramelMacchiatoVCS,
      type: "coffee",
    },
    {
      name: "Dirty Matcha",
      img: "Dirty Matcha_LABEL.png",
      func: DirtyMatchaVCS,
      type: "coffee",
    },
    {
      name: "Hazelnut Latte",
      img: "Hazelnut Latte_LABEL.png",
      func: HazelnutLatteVCS,
      type: "coffee",
    },
    { name: "Mocha", img: "Mocha_LABEL.png", func: MochaVCS, type: "coffee" },
    {
      name: "Salted Caramel",
      img: "Salted caramel_LABEL.png",
      func: SaltedCaramelVCS,
      type: "coffee",
    },
    {
      name: "Spanish Latte",
      img: "Spanish Latte_LABEL.png",
      func: SpanishLatteVCS,
      type: "coffee",
    },
    {
      name: "White Mocha",
      img: "White Mocha_LABEL.png",
      func: WhiteMochaVCS,
      type: "coffee",
    },
    {
      name: "Flat White",
      img: "Flatwhite Final_LABEL.png",
      func: FlatwhiteVCS,
      type: "coffee",
    },
    {
      name: "Chocolate",
      img: "Chocolate_LABEL.png",
      func: ChocolateVCS,
      type: "noncoffee",
    },
    {
      name: "Matcha",
      img: "Matcha_LABEL.png",
      func: MatchaVCS,
      type: "noncoffee",
    },
    {
      name: "Strawberry Matcha",
      img: "Strawberry Matcha_LABEL.png",
      func: StrawberryMatchaVCS,
      type: "noncoffee",
    },
    {
      name: "Strawberry Milk",
      img: "Strawberry Milk_LABEL.png",
      func: StrawberryMilkVCS,
      type: "noncoffee",
    },
    {
      name: "CaraMatcha Frappe",
      img: "CaraMatcha Frappe_LABEL.png",
      func: CaraMatchaFrappeVCS,
      type: "noncoffee",
    },
    {
      name: "Choco Chip Frappe",
      img: "Choco Chip Frappe_LABEL.png",
      func: ChocoChipFrappeVCS,
      type: "noncoffee",
    },
    {
      name: "Salted Caramel Frappuccino",
      img: "Salted Caramel Frappuccino_LABEL.png",
      func: SaltedCFVCS,
      type: "noncoffee",
    },
    {
      name: "Ube Tarro Frappe",
      img: "Ube Tarro Frappe_LABEL.png",
      func: UbeTarroFrappeVCS,
      type: "noncoffee",
    },
  ];

  function renderDrinks() {
    container.innerHTML = "";
    const selectedType = coffeeCheckbox.checked
      ? "coffee"
      : nonCoffeeCheckbox.checked
      ? "noncoffee"
      : "all";

    const filtered =
      selectedType === "all"
        ? drinkList
        : drinkList.filter((drink) => drink.type === selectedType);

    filtered.forEach((drink) => {
      const img = document.createElement("img");
      img.src = drink.img;
      img.style.width = "22vw";
      img.style.height = "auto";
      img.style.border = "0.3vw solid white";
      img.style.borderRadius = "2vw";
      img.style.cursor = "pointer";
      img.addEventListener("click", () => {
        nextbuttonsfx.currentTime = 0;
        nextbuttonsfx.play();
        drink.func();
      });
      container.appendChild(img);
      glowBox(img); // animate
    });
  }

  function enforceSingleCheck(selected) {
    allCheckbox.checked = selected === "all";
    coffeeCheckbox.checked = selected === "coffee";
    nonCoffeeCheckbox.checked = selected === "noncoffee";
    renderDrinks();
  }

  allCheckbox.addEventListener("change", () => enforceSingleCheck("all"));
  coffeeCheckbox.addEventListener("change", () => enforceSingleCheck("coffee"));
  nonCoffeeCheckbox.addEventListener("change", () =>
    enforceSingleCheck("noncoffee")
  );

  renderDrinks();

  const backBtn = document.createElement("img");
  backBtn.src = "BACK_BTN_TABLET.png";
  backBtn.style.position = "absolute";
  backBtn.style.width = "7vw";
  backBtn.style.top = "10vh";
  backBtn.style.left = "77vw";
  backBtn.style.cursor = "pointer";
  body.appendChild(backBtn);
  backBtn.addEventListener("click", () => {
    presss();
    selectedCoffees = [];
    NameU = "";
  });
}

function switchingCoffee() {
  yourcoffeessound.currentTime = 0;
  yourcoffeessound.play();
  let switchingContainer = document.getElementById("switching-container");

  if (!switchingContainer) {
    switchingContainer = document.createElement("div");
    switchingContainer.id = "switching-container";
    switchingContainer.style.position = "absolute";
    switchingContainer.style.top = "0";
    switchingContainer.style.left = "0";
    switchingContainer.style.width = "100vw";
    switchingContainer.style.height = "100vh";
    switchingContainer.style.background =
      "linear-gradient(to bottom, #d8b79c, #fbd0da)";
    switchingContainer.style.backgroundAttachment = "fixed";
    switchingContainer.style.backgroundRepeat = "no-repeat";
    switchingContainer.style.backgroundSize = "cover";
    switchingContainer.style.zIndex = "9999";
    document.body.appendChild(switchingContainer);
  }

  switchingContainer.innerHTML = "";

  const n1 = document.createElement("h1");
  n1.textContent = "Switching Coffee Type...";
  n1.style.color = "black";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.fontSize = "4.6vw";
  n1.style.top = "20vh";
  n1.style.left = "28vw";
  n1.style.textAlign = "center";
  n1.style.position = "absolute";
  switchingContainer.appendChild(n1);

  const n11 = document.createElement("h1");
  n11.textContent = "Please Wait";
  n11.style.color = "black";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.fontSize = "3.6vw";
  n11.style.top = "40vh";
  n11.style.left = "40vw";
  n11.style.textAlign = "center";
  n11.style.position = "absolute";
  switchingContainer.appendChild(n11);
}

function loadingCoffee() {
  const body = document.body;
  body.innerHTML = ""; // Clear any previous content
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  // Loading text for user
  const n1 = document.createElement("h1");
  n1.textContent = "Loading ALL Drinks";
  n1.style.color = "black";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "6vw";
  n1.style.width = "100vw";
  n1.style.top = "12vh";
  n1.style.left = "27.4vw";
  n1.style.textShadow = "0.7vw 0.6vw 0.6vw rgba(0, 0, 0, 0.2)";
  n1.style.animation = "pulse 2s infinite"; // Pulsing effect
  body.appendChild(n1);

  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
  `;
  document.head.appendChild(style);

  const n11 = document.createElement("h1");
  n11.textContent = "Please Wait...";
  n11.style.color = "black";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "2.5vw";
  n11.style.top = "35vh";
  n11.style.left = "44vw";
  n11.style.width = "50vw";
  n11.style.textShadow = "0.7vw 0.6vw 0.6vw rgba(0, 0, 0, 0.1)";
  body.appendChild(n11);

  // MOODMETER BAR

  // 2️⃣ Create a container for the "MOODMETER" bar (moving bar)
  const meterContainer = document.createElement("div");
  Object.assign(meterContainer.style, {
    position: "absolute",
    top: "53vh", // Position the bar just below the "MOODMETER?" text
    left: "39vw",
    width: "23.9vw", // Smaller width for the meter
    height: "3vh", // Smaller height for the meter
    backgroundColor: "#fff", // Changed to white background for the meter
    borderRadius: "1.5vh", // Slightly rounded corners for style
    overflow: "hidden", // To make sure the bar doesn't overflow
    border: "0.1vw solid black", // Black outline around the bar
    zIndex: "5",
  });
  body.appendChild(meterContainer);

  // 3️⃣ Create the moving "MOODMETER" bar inside the container
  const moodMeterBar = document.createElement("div");
  Object.assign(moodMeterBar.style, {
    width: "4.2vw", // Smaller width for the meter bar
    height: "100%", // Full height of the container
    backgroundColor: "#ffc107", // Start with yellow (middle color)
    borderRadius: "1vh", // Rounded corners for the bar
    animation:
      "moveMeter 3s ease-in-out infinite, colorChange 3s ease-in-out infinite", // Apply both animations
  });
  meterContainer.appendChild(moodMeterBar);

  // 4️⃣ Add the animation keyframes for the left-right motion and color change
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
  @keyframes moveMeter {
    0% { transform: translateX(0); } /* Start at the left */
    50% { transform: translateX(20.3vw); } /* Move to the right */
    100% { transform: translateX(0); } /* Move back to the left */
  }

  @keyframes colorChange {
    0% { background-color: #dc3545; } /* Red when on the left side */
    25% { background-color: #ffc107; } /* Yellow when at the middle */
    50% { background-color: #ffc107; } /* Yellow at the middle */
    75% { background-color: #28a745; } /* Green when on the right side */
    100% { background-color: #dc3545; } /* Red again when moving back to the left */
  }
`;
  document.head.appendChild(styleSheet);

  const quotesArray = [
    "The best way to predict the future is to create it.",
    "Life is 10% what happens to us and 90% how we react to it.",
    "Happiness is not something ready made. It comes from your own actions.",
    "Your time is limited, so don’t waste it living someone else's life.",
    "Success is not the key to happiness. Happiness is the key to success.",
  ];

  const randomIndex = Math.floor(Math.random() * quotesArray.length);
  const rrr = quotesArray[randomIndex];

  const quote = document.createElement("h1");
  quote.textContent = '"' + rrr + '"';
  quote.style.color = "black";
  quote.style.width = "30vw";
  quote.style.fontFamily = "JUA, sans-serif";
  quote.style.position = "absolute";
  quote.style.fontSize = "1.7vw";
  quote.style.top = "60vh";
  quote.style.left = "50%";
  quote.style.transform = "translateX(-50%)";
  quote.style.textAlign = "center";
  quote.style.textShadow = "0.7vw 0.6vw 0.6vw rgba(0, 0, 0, 0.1)";
  body.appendChild(quote);
}

function skip() {
  body.innerHTML = "";
  body.style.backgroundImage = "";
}

function renderAboutUs() {
  // Add bounce animation style once
  const style = document.createElement("style");
  style.textContent = `
    @keyframes bounceIn {
      0% {
        transform: scale(0.8);
        opacity: 0;
      }
      50% {
        transform: scale(1.1);
        opacity: 1;
      }
      100% {
        transform: scale(1);
      }
    }
    .bounce {
      animation: bounceIn 0.6s ease;
    }
  `;
  document.head.appendChild(style);

  // Reset and set background
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(130deg, #f894a4, #f9d1b7)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  // Title
  const n1 = document.createElement("h1");
  n1.textContent = "About Us";
  n1.style.color = "black";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "8vw";
  n1.style.top = "12vh";
  n1.style.left = "17vw";
  n1.style.width = "50vw";
  n1.classList.add("bounce");
  n1.style.fontWeight = "bold";
  n1.style.fontStyle = "italic";
  n1.style.letterSpacing = "0.2vw";
  n1.style.textShadow = "7px 6px 6px rgba(0, 0, 0, 0.3)";
  body.appendChild(n1);

  const oneParagraph = document.createElement("h1");
  oneParagraph.textContent =
    "At Éblouissante Cafe, every cup is a work of art and every visit a touch of magic! We believe that coffee is more than just a drink—it's an experience that brings comfort, creativity, and connection. To make your coffee moments even more special, we introduce Mood Brew, a system designed to help you find the perfect drink based on your mood. Whether you need a bold espresso to kickstart your day or a soothing latte to unwind, Mood Brew has the perfect match for you. Join us at Éblouissante Cafe and let Mood Brew guide you to your next delightful sip!";
  oneParagraph.style.color = "black";
  oneParagraph.style.textAlign = "justify";
  oneParagraph.style.fontFamily = "Helvetica, sans-serif";
  oneParagraph.style.position = "absolute";
  oneParagraph.style.fontSize = "1.5vw";
  oneParagraph.style.top = "38vh"; // You can adjust this if needed
  oneParagraph.style.left = "26vw";
  oneParagraph.style.width = "55vw";
  oneParagraph.style.fontStyle = "italic";
  oneParagraph.style.whiteSpace = "normal";
  oneParagraph.style.lineHeight = "1.6";
  oneParagraph.classList.add("bounce");
  oneParagraph.style.textShadow = "5px 4px 4px rgba(0, 0, 0, 0.2)";
  body.appendChild(oneParagraph);

  // Mood Brew Logo
  const img1 = document.createElement("img");
  img1.src = "tabletmoodbrewlogo.png";
  img1.style.position = "absolute";
  img1.style.width = "13vw";
  img1.style.height = "auto";
  img1.style.top = "5vh";
  img1.style.left = "53vw";
  img1.classList.add("bounce");
  body.appendChild(img1);

  // Éblouissante Logo
  const img2 = document.createElement("img");
  img2.src = "tableteblouissantelogo.png";
  img2.style.position = "absolute";
  img2.style.width = "15vw";
  img2.style.height = "auto";
  img2.style.top = "2vh";
  img2.style.left = "69vw";
  img2.classList.add("bounce");
  body.appendChild(img2);

  // Back Button
  const xim = document.createElement("img");
  xim.src = "BACK_BTN_TABLET.png";
  xim.style.position = "absolute";
  xim.style.width = "10vw";
  xim.style.height = "auto";
  xim.style.top = "80vh";
  xim.style.left = "45vw";
  xim.id = "xxx";
  xim.classList.add("bounce");
  body.appendChild(xim);
  xim.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    Homepage();
  });
}

function orderSummary() {
  const body = document.body;
  body.innerHTML = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const title = document.createElement("h1");
  title.textContent = "Order Summary";
  title.style.color = "black";
  title.style.fontFamily = "JUA, sans-serif";
  title.style.position = "absolute";
  title.style.fontSize = "4vw";
  title.style.top = "4vh";
  title.style.left = "30vw";
  title.classList.add("bounce");
  body.appendChild(title);

  const coffeeName = document.createElement("h2");
  coffeeName.textContent = "You selected:";
  coffeeName.style.position = "absolute";
  coffeeName.style.top = "15vh";
  coffeeName.style.left = "30vw";
  coffeeName.style.fontFamily = "JUA, sans-serif";
  coffeeName.style.fontSize = "3vw";
  coffeeName.style.color = "#4b2e2e";
  body.appendChild(coffeeName);

  const scrollContainer = document.createElement("div");
  scrollContainer.style.position = "absolute";
  scrollContainer.style.top = "35vh";
  scrollContainer.style.left = "30vw";
  scrollContainer.style.width = "40vw";
  scrollContainer.style.height = "40vh";
  scrollContainer.style.overflowY = "auto";
  scrollContainer.style.overflowX = "hidden";
  scrollContainer.style.border = "0.1vw solid #ccc";
  scrollContainer.style.borderRadius = "1vw";
  scrollContainer.style.background = "rgba(255, 255, 255, 0.7)";
  scrollContainer.style.boxShadow = "0 0.2vw 0.4vw rgba(0,0,0,0.2)";
  scrollContainer.style.padding = "1vh";
  const ul = document.createElement("ul");
  ul.style.listStyle = "none";
  ul.style.padding = "0";
  ul.style.margin = "0";
  ul.style.fontFamily = "JUA, sans-serif";
  ul.style.fontSize = "2vw";
  ul.style.color = "#4b2e2e";

  let total = 0;

  selectedCoffees.forEach((coffee, index) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.marginBottom = "1vh";
    li.style.transition = "opacity 0.5s ease";

    const text = document.createElement("span");

    const unitPrice = coffee.size.includes("12")
      ? coffee.price12oz
      : coffee.price16oz;
    const itemTotal = unitPrice * coffee.quantity;
    total += itemTotal;

    text.textContent = `• ${coffee.quantity}x ${coffee.name} (${coffee.size}) - (₱${itemTotal})⠀`;
    text.style.marginRight = "1vw";
    text.style.fontSize = "1.5vw";
    li.appendChild(text);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.style.fontSize = "1.4vw";
    removeBtn.style.fontWeight = "bold";
    removeBtn.style.color = "#fff";
    removeBtn.style.backgroundColor = "#f44336";
    removeBtn.style.border = "none";
    removeBtn.style.width = "2vw";
    removeBtn.style.height = "4vh";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.borderRadius = "0.5vw";
    removeBtn.style.transition = "all 0.3s ease";

    removeBtn.addEventListener("click", () => {
      const unitPrice = coffee.size.includes("12")
        ? coffee.price12oz
        : coffee.price16oz;
      const itemTotal = unitPrice * coffee.quantity;

      total -= itemTotal;

      li.style.opacity = "0";
      setTimeout(() => {
        selectedCoffees.splice(index, 1);
        orderSummary();
      }, 700);
    });

    li.appendChild(removeBtn);
    ul.appendChild(li);
  });

  scrollContainer.appendChild(ul);
  body.appendChild(scrollContainer);

  const totalDisplay = document.createElement("h1");
  totalDisplay.id = "totalDisplay";
  totalDisplay.textContent = `Total: ₱${total}`;
  totalDisplay.style.position = "absolute";
  totalDisplay.style.top = "78vh";
  totalDisplay.style.left = "30vw";
  totalDisplay.style.fontFamily = "JUA, sans-serif";
  totalDisplay.style.fontSize = "3vw";
  body.appendChild(totalDisplay);

  const addMoreBtn = document.createElement("button");
  addMoreBtn.textContent = "Add Another Coffee?";
  addMoreBtn.style.position = "absolute";
  addMoreBtn.style.top = "15vh";
  addMoreBtn.style.right = "23vw";
  addMoreBtn.style.lineHeight = "4vh";
  addMoreBtn.style.width = "15vw";
  addMoreBtn.style.height = "12vh";
  addMoreBtn.style.fontSize = "1.9vw";
  addMoreBtn.style.color = "rgb(250, 217, 240)";
  addMoreBtn.style.fontFamily = "'JUA', sans-serif";
  addMoreBtn.style.backgroundColor = "white";
  addMoreBtn.style.border = "0.1vw solid rgb(0, 0, 0)";
  addMoreBtn.style.borderRadius = "1vw";
  addMoreBtn.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  addMoreBtn.style.boxShadow = "0vw 0.2vw 0.5vw rgba(0, 0, 0, 0.5)";
  addMoreBtn.style.padding = "1vh 2vw";
  addMoreBtn.style.cursor = "pointer";
  addMoreBtn.style.transition = "transform 0.2s";

  addMoreBtn.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    viewCoffeesMM();
  });
  body.appendChild(addMoreBtn);

  const payment = document.createElement("button");
  payment.textContent = "Place your Order!";
  payment.style.position = "absolute";
  payment.style.top = "80vh";
  payment.style.right = "27vw";
  payment.style.lineHeight = "5vh";
  payment.style.width = "15vw";
  payment.style.height = "15vh";
  payment.style.fontSize = "1.9vw";
  payment.style.color = "rgb(250, 217, 240)";
  payment.style.fontFamily = "'JUA', sans-serif";
  payment.style.backgroundColor = "white";
  payment.style.border = "0.1vw solid rgb(0, 0, 0)";
  payment.style.borderRadius = "1vw";
  payment.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  payment.style.boxShadow = "0vw 0.2vw 0.5vw rgba(0, 0, 0, 0.5)";
  payment.style.padding = "1vh 2vw";
  payment.style.cursor = "pointer";
  payment.style.transition = "transform 0.2s";

  payment.addEventListener("click", () => {
    if (total === 0) {
      const warning = document.createElement("div");
      warning.textContent = "There are no orders";
      warning.style.color = "red";
      warning.style.fontSize = "1.6vw";
      warning.style.fontWeight = "bold";
      warning.style.position = "absolute";
      warning.style.top = "54vh";
      warning.style.left = "42vw";
      warning.style.background = "#fff0f0";
      warning.style.padding = "1vh 2vw";
      warning.style.borderRadius = "1vw";
      warning.style.boxShadow = "0vw 0.2vw 0.4vw rgba(0, 0, 0, 0.2)";
      warning.style.zIndex = "999";

      const oldWarning = document.getElementById("no-orders-warning");
      if (oldWarning) oldWarning.remove();

      warning.id = "no-orders-warning";
      document.body.appendChild(warning);

      setTimeout(() => {
        warning.remove();
      }, 3000);
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      sureOrdersMM();
    }
  });
  body.appendChild(payment);
}

function orderSummarySkip() {
  const body = document.body;
  body.innerHTML = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const title = document.createElement("h1");
  title.textContent = "Order Summary";
  title.style.color = "black";
  title.style.fontFamily = "JUA, sans-serif";
  title.style.position = "absolute";
  title.style.fontSize = "4vw";
  title.style.top = "4vh";
  title.style.left = "30vw";
  title.classList.add("bounce");
  body.appendChild(title);

  const coffeeName = document.createElement("h2");
  coffeeName.textContent = "You selected:";
  coffeeName.style.position = "absolute";
  coffeeName.style.top = "15vh";
  coffeeName.style.left = "30vw";
  coffeeName.style.fontFamily = "JUA, sans-serif";
  coffeeName.style.fontSize = "3vw";
  coffeeName.style.color = "#4b2e2e";
  body.appendChild(coffeeName);

  const scrollContainer = document.createElement("div");
  scrollContainer.style.position = "absolute";
  scrollContainer.style.top = "35vh";
  scrollContainer.style.left = "30vw";
  scrollContainer.style.width = "40vw";
  scrollContainer.style.height = "40vh";
  scrollContainer.style.overflowY = "auto";
  scrollContainer.style.overflowX = "hidden";
  scrollContainer.style.border = "0.2vw solid #ccc";
  scrollContainer.style.borderRadius = "1vw";
  scrollContainer.style.background = "rgba(255, 255, 255, 0.7)";
  scrollContainer.style.boxShadow = "0 0.4vw 0.8vw rgba(0,0,0,0.2)";
  scrollContainer.style.padding = "1vh";

  const ul = document.createElement("ul");
  ul.style.listStyle = "none";
  ul.style.padding = "0";
  ul.style.margin = "0";
  ul.style.fontFamily = "JUA, sans-serif";
  ul.style.fontSize = "2vw";
  ul.style.color = "#4b2e2e";

  let total = 0;

  selectedCoffees.forEach((coffee, index) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.marginBottom = "1vh";
    li.style.transition = "opacity 0.5s ease";

    const text = document.createElement("span");

    const unitPrice = coffee.size.includes("12")
      ? coffee.price12oz
      : coffee.price16oz;
    const itemTotal = unitPrice * coffee.quantity;
    total += itemTotal;

    text.textContent = `• ${coffee.quantity}x ${coffee.name} (${coffee.size}) - (₱${itemTotal})⠀`;
    text.style.marginRight = "1vw";
    text.style.fontSize = "1.5vw";
    li.appendChild(text);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.style.fontSize = "1.4vw";
    removeBtn.style.fontWeight = "bold";
    removeBtn.style.color = "#fff";
    removeBtn.style.backgroundColor = "#f44336";
    removeBtn.style.border = "none";
    removeBtn.style.width = "2vw";
    removeBtn.style.height = "4vh";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.borderRadius = "0.5vw";
    removeBtn.style.transition = "all 0.3s ease";

    removeBtn.addEventListener("click", () => {
      const unitPrice = coffee.size.includes("12")
        ? coffee.price12oz
        : coffee.price16oz;
      const itemTotal = unitPrice * coffee.quantity;

      total -= itemTotal;

      li.style.opacity = "0";
      setTimeout(() => {
        selectedCoffees.splice(index, 1);
        orderSummarySkip();
      }, 700);
    });

    li.appendChild(removeBtn);
    ul.appendChild(li);
  });

  scrollContainer.appendChild(ul);
  body.appendChild(scrollContainer);

  const totalDisplay = document.createElement("h1");
  totalDisplay.id = "totalDisplay";
  totalDisplay.textContent = `Total: ₱${total}`;
  totalDisplay.style.position = "absolute";
  totalDisplay.style.top = "78vh";
  totalDisplay.style.left = "30vw";
  totalDisplay.style.fontFamily = "JUA, sans-serif";
  totalDisplay.style.fontSize = "3vw";
  body.appendChild(totalDisplay);

  const addMoreBtn = document.createElement("button");
  addMoreBtn.textContent = "Add Another Coffee?";
  addMoreBtn.style.position = "absolute";
  addMoreBtn.style.top = "15vh";
  addMoreBtn.style.right = "23vw";
  addMoreBtn.style.lineHeight = "4vh";
  addMoreBtn.style.width = "15vw";
  addMoreBtn.style.height = "12vh";
  addMoreBtn.style.fontSize = "1.9vw";
  addMoreBtn.style.color = "rgb(250, 217, 240)";
  addMoreBtn.style.fontFamily = "'JUA', sans-serif";
  addMoreBtn.style.backgroundColor = "white";
  addMoreBtn.style.border = "0.1vw solid rgb(0, 0, 0)";
  addMoreBtn.style.borderRadius = "1vw";
  addMoreBtn.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  addMoreBtn.style.boxShadow = "0vw 0.2vw 0.5vw rgba(0, 0, 0, 0.5)";
  addMoreBtn.style.padding = "1vh 2vw";
  addMoreBtn.style.cursor = "pointer";
  addMoreBtn.style.transition = "transform 0.2s";

  addMoreBtn.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    viewCoffeesSkip();
  });
  body.appendChild(addMoreBtn);

  const payment = document.createElement("button");
  payment.textContent = "Place your Order!";
  payment.style.position = "absolute";
  payment.style.top = "80vh";
  payment.style.right = "27vw";
  payment.style.lineHeight = "5vh";
  payment.style.width = "15vw";
  payment.style.height = "15vh";
  payment.style.fontSize = "1.9vw";
  payment.style.color = "rgb(250, 217, 240)";
  payment.style.fontFamily = "'JUA', sans-serif";
  payment.style.backgroundColor = "white";
  payment.style.border = "0.1vw solid rgb(0, 0, 0)";
  payment.style.borderRadius = "1vw";
  payment.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  payment.style.boxShadow = "0vw 0.2vw 0.5vw rgba(0, 0, 0, 0.5)";
  payment.style.padding = "1vh 2vw";
  payment.style.cursor = "pointer";
  payment.style.transition = "transform 0.2s";

  payment.addEventListener("click", () => {
    if (total === 0) {
      const warning = document.createElement("div");
      warning.textContent = "There are no orders";
      warning.style.color = "red";
      warning.style.fontSize = "1.6vw";
      warning.style.fontWeight = "bold";
      warning.style.position = "absolute";
      warning.style.top = "54vh";
      warning.style.left = "42vw";
      warning.style.background = "#fff0f0";
      warning.style.padding = "1vh 2vw";
      warning.style.borderRadius = "0.6vw";
      warning.style.boxShadow = "0 0.4vw 0.8vw rgba(0, 0, 0, 0.2)";
      warning.style.zIndex = "999";

      const oldWarning = document.getElementById("no-orders-warning");
      if (oldWarning) oldWarning.remove();

      warning.id = "no-orders-warning";
      document.body.appendChild(warning);

      setTimeout(() => {
        warning.remove();
      }, 3000);
    } else {
      nextbuttonsfx.currentTime = 0;
      nextbuttonsfx.play();
      sureOrdersSkip();
    }
  });
  body.appendChild(payment);
}

function sureOrdersMM() {
  const body = document.body;
  body.style.transform = "none";
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "Are you sure you're satisfied with your Order/s?";
  n1.style.color = "black";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "5vw";
  n1.style.top = "10vh";
  n1.style.left = "22vw";
  n1.style.width = "70vw";
  n1.style.textShadow = "0.7vw 0.6vw 0.6vw rgba(0, 0, 0, 0.3)";
  n1.classList.add("bounce");
  body.appendChild(n1);

  const yesBtn = document.createElement("button");
  yesBtn.innerText = "Yes";
  yesBtn.style.position = "absolute";
  yesBtn.style.top = "50vh";
  yesBtn.style.left = "23vw";
  yesBtn.style.width = "20vw";
  yesBtn.style.height = "14vh";
  yesBtn.style.fontSize = "4vw";
  yesBtn.style.fontFamily = "'JUA', sans-serif";
  yesBtn.style.color = "rgb(250, 217, 240)";
  yesBtn.style.backgroundColor = "white";
  yesBtn.style.border = "0.1vw solid rgb(0, 0, 0)";
  yesBtn.style.borderRadius = "1.5vw";
  yesBtn.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  yesBtn.style.boxShadow = "0vw 0.4vw 1vw rgba(0, 0, 0, 0.5)";
  yesBtn.style.cursor = "pointer";
  yesBtn.id = "yes";
  body.appendChild(yesBtn);
  yesBtn.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    loadingsfx.currentTime = 0;
    loadingsfx.play();
    loadingPayment();
    setTimeout(() => {
      payment();
    }, 3000);
  });

  const ximmm = document.createElement("button");
  ximmm.style.position = "absolute";
  ximmm.innerText = "No";
  ximmm.style.width = "15vw";
  ximmm.style.height = "14vh";
  ximmm.style.fontSize = "3vw";
  ximmm.style.color = "rgb(250, 217, 240)";
  ximmm.style.fontFamily = "'JUA', sans-serif";
  ximmm.style.backgroundColor = "white";
  ximmm.style.border = "0.1vw solid rgb(0, 0, 0)";
  ximmm.style.borderRadius = "1.5vw";
  ximmm.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  ximmm.style.boxShadow = "0vw 0.4vw 1vw rgba(0, 0, 0, 0.5)";
  ximmm.style.cursor = "pointer";
  ximmm.style.transition = "transform 0.2s";
  ximmm.style.top = "50vh";
  ximmm.style.left = "60vw";
  ximmm.id = "skip";
  body.appendChild(ximmm);
  ximmm.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    orderSummary();
  });
}

function sureOrdersSkip() {
  const body = document.body;
  body.style.transform = "none";
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "Are you sure you're satisfied with your Order/s?";
  n1.style.color = "black";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "5vw";
  n1.style.top = "10vh";
  n1.style.left = "22vw";
  n1.style.width = "70vw";
  n1.style.textShadow = "0.7vw 0.6vw 0.6vw rgba(0, 0, 0, 0.3)";
  n1.classList.add("bounce");
  body.appendChild(n1);

  const yesBtn = document.createElement("button");
  yesBtn.innerText = "Yes";
  yesBtn.style.position = "absolute";
  yesBtn.style.top = "50vh";
  yesBtn.style.left = "23vw";
  yesBtn.style.width = "20vw";
  yesBtn.style.height = "14vh";
  yesBtn.style.fontSize = "4vw";
  yesBtn.style.fontFamily = "'JUA', sans-serif";
  yesBtn.style.color = "rgb(250, 217, 240)";
  yesBtn.style.backgroundColor = "white";
  yesBtn.style.border = "0.1vw solid rgb(0, 0, 0)";
  yesBtn.style.borderRadius = "1.5vw";
  yesBtn.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  yesBtn.style.boxShadow = "0vw 0.4vw 1vw rgba(0, 0, 0, 0.5)";
  yesBtn.style.cursor = "pointer";
  yesBtn.id = "yes";
  body.appendChild(yesBtn);
  yesBtn.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    loadingsfx.currentTime = 0;
    loadingsfx.play();
    loadingPayment();
    setTimeout(() => {
      payment();
    }, 3000);
  });

  const ximmm = document.createElement("button");
  ximmm.style.position = "absolute";
  ximmm.innerText = "No";
  ximmm.style.width = "15vw";
  ximmm.style.height = "14vh";
  ximmm.style.fontSize = "3vw";
  ximmm.style.color = "rgb(250, 217, 240)";
  ximmm.style.fontFamily = "'JUA', sans-serif";
  ximmm.style.backgroundColor = "white";
  ximmm.style.border = "0.1vw solid rgb(0, 0, 0)";
  ximmm.style.borderRadius = "1.5vw";
  ximmm.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  ximmm.style.boxShadow = "0vw 0.4vw 1vw rgba(0, 0, 0, 0.5)";
  ximmm.style.cursor = "pointer";
  ximmm.style.transition = "transform 0.2s";
  ximmm.style.top = "50vh";
  ximmm.style.left = "60vw";
  ximmm.id = "skip";
  body.appendChild(ximmm);
  ximmm.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    orderSummarySkip();
  });
}

function loadingPayment() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "Placing your Order/s...";
  n1.style.color = "black";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "6vw";
  n1.style.top = "7vh";
  n1.style.left = "24vw";
  n1.style.width = "75vw";
  n1.style.textShadow = "0.7vw 0.6vw 0.6vw rgba(0, 0, 0, 0.2)";
  n1.style.animation = "pulse 2s infinite"; // Pulsing effect
  body.appendChild(n1);

  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
  `;
  document.head.appendChild(style);

  const n11 = document.createElement("h1");
  n11.textContent = "Please Wait";
  n11.style.color = "black";
  n11.style.fontFamily = "JUA, sans-serif";
  n11.style.position = "absolute";
  n11.style.fontSize = "3vw";
  n11.style.top = "33vh";
  n11.style.left = "42vw";
  n11.style.width = "40vw";
  n11.style.textShadow = "0.7vw 0.6vw 0.6vw rgba(0, 0, 0, 0.1)";
  body.appendChild(n11);

  const meterContainer = document.createElement("div");
  Object.assign(meterContainer.style, {
    position: "absolute",
    top: "50vh",
    left: "35vw",
    width: "30vw",
    height: "3vh",
    backgroundColor: "#fff",
    borderRadius: "1.5vh",
    overflow: "hidden",
    border: "0.2vw solid black",
    zIndex: "5",
  });
  body.appendChild(meterContainer);

  const moodMeterBar = document.createElement("div");
  Object.assign(moodMeterBar.style, {
    width: "5.5vw",
    height: "100%",
    backgroundColor: "#ffc107",
    borderRadius: "1vh",
    animation:
      "moveMeter 3s ease-in-out infinite, colorChange 3s ease-in-out infinite",
  });
  meterContainer.appendChild(moodMeterBar);

  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
  @keyframes moveMeter {
    0% { transform: translateX(0); } /* Start at the left */
    50% { transform: translateX(22vw); } /* Move to the right */
    100% { transform: translateX(0); } /* Move back to the left */
  }

  @keyframes colorChange {
    0% { background-color: #dc3545; } /* Red when on the left side */
    25% { background-color: #ffc107; } /* Yellow when at the middle */
    50% { background-color: #ffc107; } /* Yellow at the middle */
    75% { background-color: #28a745; } /* Green when on the right side */
    100% { background-color: #dc3545; } /* Red again when moving back to the left */
  }
`;
  document.head.appendChild(styleSheet);

  const quotesArray = [
    "The best way to predict the future is to create it.",
    "Life is 10% what happens to us and 90% how we react to it.",
    "Happiness is not something ready made. It comes from your own actions.",
    "Your time is limited, so don’t waste it living someone else's life.",
    "Success is not the key to happiness. Happiness is the key to success.",
  ];

  const randomIndex = Math.floor(Math.random() * quotesArray.length);
  const rrr = quotesArray[randomIndex];

  const quote = document.createElement("h1");
  quote.textContent = '"' + rrr + '"';
  quote.style.color = "black";
  quote.style.width = "40vw";
  quote.style.fontFamily = "JUA, sans-serif";
  quote.style.position = "absolute";
  quote.style.fontSize = "1.7vw";
  quote.style.top = "59vh";
  quote.style.left = "50%";
  quote.style.transform = "translateX(-50%)";
  quote.style.textAlign = "center";
  quote.style.textShadow = "0.7vw 0.6vw 0.6vw rgba(0, 0, 0, 0.1)";
  body.appendChild(quote);

  const styleTag = document.createElement("style");
  styleTag.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleTag);
}

function payment() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes bounceIn {
      0% {
        transform: scale(0.8);
        opacity: 0;
      }
      50% {
        transform: scale(1.1);
        opacity: 1;
      }
      100% {
        transform: scale(1);
      }
    }
    .bounce {
      animation: bounceIn 0.6s ease;
    }
  `;
  document.head.appendChild(style);

  const body = document.body;
  body.style.transform = "none";
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent =
    "Before placing your order, would you like to submit your feedback to us?";
  n1.style.color = "black";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "5vw";
  n1.style.top = "5.4vh";
  n1.style.left = "20vw";
  n1.style.width = "70vw";
  n1.classList.add("bounce");
  n1.style.textShadow = "0.7vw 0.6vw 0.6vw rgba(0, 0, 0, 0.3)";
  body.appendChild(n1);

  const yesBtn = document.createElement("button");
  yesBtn.innerText = "Yes";
  yesBtn.style.position = "absolute";
  yesBtn.style.top = "60vh";
  yesBtn.style.left = "29vw";
  yesBtn.style.width = "20vw";
  yesBtn.style.height = "10vh";
  yesBtn.style.fontSize = "3vw";
  yesBtn.style.fontFamily = "'JUA', sans-serif";
  yesBtn.style.color = "rgb(250, 217, 240)";
  yesBtn.style.backgroundColor = "white";
  yesBtn.style.border = "0.1vw solid rgb(0, 0, 0)";
  yesBtn.style.borderRadius = "1.5vw";
  yesBtn.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  yesBtn.style.boxShadow = "0vw 0.4vw 1vw rgba(0, 0, 0, 0.5)";
  yesBtn.style.cursor = "pointer";
  yesBtn.id = "yes";
  yesBtn.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    feedback();
  });
  body.appendChild(yesBtn);

  const ximmm = document.createElement("button");
  ximmm.style.position = "absolute";
  ximmm.innerText = "Skip";
  ximmm.style.lineHeight = "1.5vh";
  ximmm.style.width = "15vw";
  ximmm.style.height = "10vh";
  ximmm.style.fontSize = "3vw";
  ximmm.style.color = "rgb(250, 217, 240)";
  ximmm.style.fontFamily = "'JUA', sans-serif";
  ximmm.style.backgroundColor = "white";
  ximmm.style.border = "0.1vw solid rgb(0, 0, 0)";
  ximmm.style.borderRadius = "1.5vw";
  ximmm.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  ximmm.style.boxShadow = "0vw 0.4vw 1vw rgba(0, 0, 0, 0.5)";
  ximmm.style.padding = "1.5vh 3vw";
  ximmm.style.cursor = "pointer";
  ximmm.style.transition = "transform 0.2s";
  ximmm.style.top = "60vh";
  ximmm.style.left = "56vw";
  ximmm.id = "skip";
  body.appendChild(ximmm);
  ximmm.addEventListener("click", thanksOrderSkip);
  ximmm.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    success.currentTime = 0;
    success.play();
    thanksOrderSkip();
  });
}

function insertOrderReceipt(NameU, selectedCoffees, total) {
  total = 0;

  selectedCoffees.forEach((coffee) => {
    const unitPrice = coffee.size.includes("12")
      ? coffee.price12oz
      : coffee.price16oz;
    const itemTotal = unitPrice * coffee.quantity;
    total += itemTotal;
  });

  const orderData = {
    name: NameU,
    orders: selectedCoffees.map((coffee) => ({
      name: coffee.name,
      size: coffee.size,
      quantity: coffee.quantity,
      price: coffee.size.includes("12") ? coffee.price12oz : coffee.price16oz,
      totalPrice:
        (coffee.size.includes("12") ? coffee.price12oz : coffee.price16oz) *
        coffee.quantity,
    })),
    totalPrice: total,
    timestamp: new Date().toLocaleString(),
  };

  fetch("https://moodbrew-server.onrender.com/collection/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Order successfully saved:", data);
    })
    .catch((error) => {
      console.error("Error saving order:", error);
    });
}

function feedback() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "10vh";
  container.style.left = "23vw";
  container.style.background = "#fff";
  container.style.borderRadius = "1.5vw";
  container.style.background = "linear-gradient(to bottom, #fbd0da, #d8b79c)";
  container.style.boxShadow = "0vw 0.4vw 1vw rgba(0, 0, 0, 0.1)";
  container.style.width = "60vw";
  container.style.height = "70vh";
  container.style.textAlign = "center";

  const title = document.createElement("h2");
  title.textContent =
    "How was your experience using our system?\nClick on the stars below!";
  title.style.fontSize = "2vw";
  title.style.fontFamily = "JUA, sans-serif";
  container.appendChild(title);

  const starContainer = document.createElement("div");
  starContainer.style.fontSize = "4vw";
  starContainer.style.margin = "3vh 0";
  starContainer.style.cursor = "pointer";
  starContainer.style.userSelect = "none";

  let selectedRating = 0;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.innerHTML = "☆";
    star.style.margin = "0 0.5vw";
    star.addEventListener("click", () => {
      selectedRating = i;
      updateStars();
    });
    stars.push(star);
    starContainer.appendChild(star);
  }

  function updateStars() {
    stars.forEach((star, index) => {
      star.innerHTML = index < selectedRating ? "★" : "☆";
      star.style.color = index < selectedRating ? "#59FE7D" : "black";
    });
  }

  container.appendChild(starContainer);

  const message = document.createElement("div");
  message.style.marginTop = "1vh";
  message.style.fontSize = "2vw";
  container.appendChild(message);

  const button = document.createElement("button");
  button.textContent = "SUBMIT";
  button.style.width = "20vw";
  button.style.height = "10vh";
  button.style.padding = "1vh";
  button.style.backgroundColor = "#4caf50";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "0.8vw";
  button.style.cursor = "pointer";
  button.style.fontSize = "2.3vw";
  button.style.fontFamily = "JUA, sans-serif";

  button.addEventListener("mouseenter", () => {
    button.style.backgroundColor = "#45a049";
  });
  button.addEventListener("mouseleave", () => {
    button.style.backgroundColor = "#4caf50";
  });

  button.addEventListener("click", () => {
    const ratingText = `${selectedRating} Star${
      selectedRating !== 1 ? "s" : ""
    }`;

    message.textContent = "Submitting your feedback...";
    message.style.color = "green";

    setTimeout(() => {
      thanksFeedback();
    }, 1000);

    const feedbackData = {
      name: NameU,
      feedback: ratingText,
      timestamp: new Date().toLocaleString(),
    };

    fetch("https://moodbrew-server.onrender.com/collection/feedbacks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedbackData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Feedback successfully saved:", data);
        message.textContent = `Thank you for your feedback! You gave ${ratingText}.`;
        message.style.color = "blue";
        insertOrderReceipt(NameU, selectedCoffees, total);
      })
      .catch((error) => {
        console.error("Error saving feedback:", error);
        message.textContent = "An error occurred while submitting feedback.";
        message.style.color = "red";
      });
  });

  container.appendChild(button);
  document.body.appendChild(container);
}

function thanksFeedback() {
  success.currentTime = 0;
  success.play();
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  Object.assign(document.body.style, {
    margin: "0",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4ede0",
    fontFamily: "'Jua', sans-serif",
  });

  const container = document.createElement("div");
  container.style.textAlign = "center";
  container.style.transition = "transform 1s ease-out";
  container.style.opacity = "1";
  document.body.appendChild(container);

  const checkmark = document.createElement("div");
  checkmark.textContent = "✔";
  checkmark.style.fontSize = "15vw";
  checkmark.style.color = "#4CAF50";
  checkmark.style.display = "none";
  checkmark.style.opacity = "0";
  checkmark.style.transition = "opacity 1s ease-in";
  checkmark.style.position = "absolute";
  checkmark.style.top = "-1vh";
  checkmark.style.left = "50%";
  checkmark.style.transform = "translateX(-50%)";
  checkmark.style.textShadow =
    "0vw 0vw 0.3vw rgba(0, 255, 0, 0.5), 0vw 0vw 1vw rgba(255, 255, 255, 0.7)";
  checkmark.style.webkitTextStroke = "0.2vw white";
  checkmark.style.textStroke = "0.2vw white";
  document.body.appendChild(checkmark);

  const thankyou = document.createElement("div");
  thankyou.style.fontSize = "7vw";
  thankyou.style.color = "#5d4037";
  thankyou.style.opacity = "0";
  thankyou.style.width = "49vw";
  thankyou.style.transition = "opacity 1s ease-in";
  thankyou.style.position = "absolute";
  thankyou.style.top = "37vh";
  thankyou.style.left = "54%";
  thankyou.style.transform = "translateX(-50%)";
  document.body.appendChild(thankyou);

  const styleTag = document.createElement("style");
  styleTag.textContent = `
    @keyframes glow {
      0% { text-shadow: 0vw 0vw 0.3vw rgba(0, 255, 0, 0.5), 0vw 0vw 1vw rgba(255, 255, 255, 0.7); }
      50% { text-shadow: 0vw 0vw 0.6vw rgba(0, 255, 0, 0.7), 0vw 0vw 1.3vw rgba(255, 255, 255, 0.9); }
      100% { text-shadow: 0vw 0vw 0.3vw rgba(0, 255, 0, 0.5), 0vw 0vw 1vw rgba(255, 255, 255, 0.7); }
    }

    @keyframes pulse {
      0% { transform: translateX(-50%) scale(1); }
      50% { transform: translateX(-50%) scale(1.1); }
      100% { transform: translateX(-50%) scale(1); }
    }

    @keyframes waveBounce {
      0% { transform: translateY(0); }
      30% { transform: translateY(-1vh); }
      50% { transform: translateY(0); }
      70% { transform: translateY(-0.5vh); }
      100% { transform: translateY(0); }
    }

    .checkmark-glow {
      animation: glow 1s ease-in-out infinite, pulse 1.2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(styleTag);

  setTimeout(() => {
    checkmark.style.display = "inline";
    checkmark.style.opacity = "1";
    checkmark.classList.add("checkmark-glow");
  }, 1200);

  setTimeout(() => {
    thankyou.style.opacity = "1";

    const message = "Thank you for your feedback!";
    thankyou.textContent = "";
    thankyou.fontFamily = "'Jua', sans-serif";
    thankyou.fontSize = "10vw";
    message.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      span.style.animation = `waveBounce 1s ease ${i * 0.1}s forwards`;
      thankyou.appendChild(span);
    });

    setTimeout(() => {}, 2300);
  }, 2300);

  setTimeout(() => {
    orderFinalPage();
  }, 7000);
}

function thanksOrderSkip() {
  success.currentTime = 0;
  success.play();
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  Object.assign(document.body.style, {
    margin: "0",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4ede0",
    fontFamily: "'Jua', sans-serif",
  });

  const container = document.createElement("div");
  container.style.textAlign = "center";
  container.style.transition = "transform 1s ease-out";
  container.style.opacity = "1";
  document.body.appendChild(container);

  const checkmark = document.createElement("div");
  checkmark.textContent = "✔";
  checkmark.style.fontSize = "15vw";
  checkmark.style.color = "#4CAF50";
  checkmark.style.display = "none";
  checkmark.style.opacity = "0";
  checkmark.style.transition = "opacity 1s ease-in";
  checkmark.style.position = "absolute";
  checkmark.style.top = "-1vh";
  checkmark.style.left = "50%";
  checkmark.style.transform = "translateX(-50%)";
  checkmark.style.textShadow =
    "0vw 0vw 0.3vw rgba(0, 255, 0, 0.5), 0vw 0vw 1vw rgba(255, 255, 255, 0.7)";
  checkmark.style.webkitTextStroke = "0.2vw white";
  checkmark.style.textStroke = "0.2vw white";
  document.body.appendChild(checkmark);

  const thankyou = document.createElement("div");
  thankyou.style.fontSize = "7vw";
  thankyou.style.color = "#5d4037";
  thankyou.style.opacity = "0";
  thankyou.style.width = "49vw";
  thankyou.style.transition = "opacity 1s ease-in";
  thankyou.style.position = "absolute";
  thankyou.style.top = "37vh";
  thankyou.style.left = "54%";
  thankyou.style.transform = "translateX(-50%)";
  document.body.appendChild(thankyou);

  const styleTag = document.createElement("style");
  styleTag.textContent = `
    @keyframes glow {
      0% { text-shadow: 0vw 0vw 0.3vw rgba(0, 255, 0, 0.5), 0vw 0vw 1vw rgba(255, 255, 255, 0.7); }
      50% { text-shadow: 0vw 0vw 0.6vw rgba(0, 255, 0, 0.7), 0vw 0vw 1.3vw rgba(255, 255, 255, 0.9); }
      100% { text-shadow: 0vw 0vw 0.3vw rgba(0, 255, 0, 0.5), 0vw 0vw 1vw rgba(255, 255, 255, 0.7); }
    }

    @keyframes pulse {
      0% { transform: translateX(-50%) scale(1); }
      50% { transform: translateX(-50%) scale(1.1); }
      100% { transform: translateX(-50%) scale(1); }
    }

    @keyframes waveBounce {
      0% { transform: translateY(0); }
      30% { transform: translateY(-1vh); }
      50% { transform: translateY(0); }
      70% { transform: translateY(-0.5vh); }
      100% { transform: translateY(0); }
    }

    .checkmark-glow {
      animation: glow 1s ease-in-out infinite, pulse 1.2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(styleTag);

  setTimeout(() => {
    checkmark.style.display = "inline";
    checkmark.style.opacity = "1";
    checkmark.classList.add("checkmark-glow");
  }, 1200);

  setTimeout(() => {
    thankyou.style.opacity = "1";

    const message = "Thank you for your Order!";
    message.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      span.style.animation = `waveBounce 1s ease ${i * 0.1}s forwards`;
      thankyou.appendChild(span);
    });

    setTimeout(() => {}, 2300);
  }, 2300);

  setTimeout(() => {
    orderFinalPage();
  }, 7000);

  insertOrderReceipt(NameU, selectedCoffees, total);
}

function orderFinalPage() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes bounceIn {
      0% {
        transform: scale(0.8);
        opacity: 0;
      }
      50% {
        transform: scale(1.1);
        opacity: 1;
      }
      100% {
        transform: scale(1);
      }
    }
    .bounce {
      animation: bounceIn 0.6s ease;
    }
  `;
  document.head.appendChild(style);

  const body = document.body;
  body.style.transform = "none";
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const n1 = document.createElement("h1");
  n1.textContent = "Thank You for your Order!";
  n1.style.color = "black";
  n1.style.fontFamily = "JUA, sans-serif";
  n1.style.position = "absolute";
  n1.style.fontSize = "6vw";
  n1.style.top = "14vh";
  n1.style.left = "17.3vw";
  n1.style.width = "80vw";
  n1.classList.add("bounce");
  n1.style.textShadow = "5px 4px 4px rgba(0, 0, 0, 0.4)";
  body.appendChild(n1);

  const subtext = document.createElement("p");
  subtext.textContent =
    "Sit back and relax, your coffee is brewing fresh just for you!";
  subtext.style.position = "absolute";
  subtext.style.top = "38vh";
  subtext.style.left = "65%";
  subtext.style.transform = "translateX(-50%)";
  subtext.style.fontSize = "2vw";
  subtext.style.fontFamily = "'Poppins', sans-serif";
  subtext.style.color = "#333";
  subtext.style.opacity = "0.8";
  subtext.style.width = "80vw";
  document.body.appendChild(subtext);

  const yesBtn = document.createElement("button");
  yesBtn.innerText = "Return to Home";
  yesBtn.style.position = "absolute";
  yesBtn.style.top = "55vh";
  yesBtn.style.left = "29vw";
  yesBtn.style.width = "20vw";
  yesBtn.style.height = "20vh";
  yesBtn.style.fontSize = "2.9vw";
  yesBtn.style.fontFamily = "'JUA', sans-serif";
  yesBtn.style.color = "rgb(250, 217, 240)";
  yesBtn.style.backgroundColor = "white";
  yesBtn.style.border = "1px solid rgb(0, 0, 0)";
  yesBtn.style.borderRadius = "15px";
  yesBtn.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  yesBtn.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.5)";
  yesBtn.style.cursor = "pointer";
  yesBtn.id = "yes";
  yesBtn.style.zIndex = "1";
  body.appendChild(yesBtn);
  yesBtn.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    Homepage();
    selectedCoffees = [];
    moodPoints = 10;
    pageNumber = 1;
    total = 0;
    NameU = "";
  });

  const viewR = document.createElement("button");
  viewR.innerText = "View Receipt";
  viewR.style.position = "absolute";
  viewR.style.top = "57vh";
  viewR.style.left = "53vw";
  viewR.style.width = "20vw";
  viewR.style.height = "13vh";
  viewR.style.fontSize = "2.6vw";
  viewR.style.fontFamily = "'JUA', sans-serif";
  viewR.style.color = "rgb(250, 217, 240)";
  viewR.style.backgroundColor = "white";
  viewR.style.border = "1px solid rgb(0, 0, 0)";
  viewR.style.borderRadius = "15px";
  viewR.style.textShadow =
    "-1px -1px 0 rgb(0, 0, 0), 1px -1px 0 rgb(15, 7, 9), -1px 1px 0 rgb(15, 6, 8), 1px 1px 0 rgb(19, 7, 9)";
  viewR.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.5)";
  viewR.style.cursor = "pointer";
  viewR.id = "yes";
  viewR.classList.add("pulse");
  viewR.style.zIndex = "1";
  body.appendChild(viewR);
  viewR.addEventListener("click", () => {
    nextbuttonsfx.currentTime = 0;
    nextbuttonsfx.play();
    viewReceipt();
  });
}

function viewReceipt() {
  const body = document.body;
  body.innerHTML = "";
  body.style.backgroundImage = "";
  body.style.background = "linear-gradient(to bottom, #d8b79c, #fbd0da)";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "20vh";
  container.style.left = "23vw";

  container.style.background = "#fff";
  container.style.top = "5vh";
  container.style.borderRadius = "1.5vw";
  container.style.background = "linear-gradient(to bottom, #fbd0da, #d8b79c)";
  container.style.boxShadow = "0 0.4vw 1vw rgba(0, 0, 0, 0.1)";
  container.style.width = "60vw";
  container.style.height = "80vh";
  container.style.textAlign = "center";

  const title = document.createElement("h2");
  title.textContent = "Your Receipt!";
  title.style.fontSize = "4vw";
  title.style.position = "absolute";
  title.style.top = "-5vh";
  title.style.left = "17vw";
  title.style.fontFamily = "'JUA', sans-serif";
  container.appendChild(title);

  const namelol = document.createElement("h2");
  namelol.textContent = "Name: " + NameU;
  namelol.style.fontSize = "3vw";
  namelol.style.position = "absolute";
  namelol.style.top = "6vh";
  namelol.style.left = "2vw";
  namelol.style.fontFamily = "'JUA', sans-serif";
  container.appendChild(namelol);

  const lbls = document.createElement("h2");
  lbls.textContent = "Your placed orders is/are:";
  lbls.style.fontSize = "1.5vw";
  lbls.style.position = "absolute";
  lbls.style.top = "16vh";
  lbls.style.left = "2vw";
  lbls.style.fontFamily = "'JUA', sans-serif";
  container.appendChild(lbls);

  let total = 0;

  const scrollContainer = document.createElement("div");
  scrollContainer.style.position = "absolute";
  scrollContainer.style.top = "24vh";
  scrollContainer.style.left = "2vw";
  scrollContainer.style.width = "55vw";
  scrollContainer.style.height = "44vh";
  scrollContainer.style.overflowY = "auto";
  scrollContainer.style.paddingRight = "1vw";
  scrollContainer.style.border = "0.2vw solid #8a675e";
  scrollContainer.style.borderRadius = "1vw";
  scrollContainer.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
  scrollContainer.style.boxShadow = "inset 0 0 0.5vw rgba(0, 0, 0, 0.1)";

  const coffeeListElement = (() => {
    const ul = document.createElement("ul");
    ul.style.listStyle = "none";
    ul.style.padding = "0";
    ul.style.margin = "0";
    ul.style.fontFamily = "JUA, sans-serif";
    ul.style.fontStyle = "italic";
    ul.style.fontSize = "2.5vw";
    ul.style.color = "#4b2e2e";

    selectedCoffees.forEach((coffee) => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.marginBottom = "1vh";
      li.style.transition = "opacity 0.5s ease";

      const text = document.createElement("span");

      const unitPrice = coffee.size.includes("12")
        ? coffee.price12oz
        : coffee.price16oz;
      const itemTotal = unitPrice * coffee.quantity;
      total += itemTotal;

      text.textContent = `• ${coffee.quantity}x ${coffee.name} (${coffee.size}) - (₱${itemTotal})⠀`;
      text.style.fontSize = "2.7vw";
      text.style.marginRight = "1vw";
      text.style.fontFamily = "'JUA', sans-serif";

      li.appendChild(text);
      ul.appendChild(li);
    });

    return ul;
  })();

  scrollContainer.appendChild(coffeeListElement);
  container.appendChild(scrollContainer);

  const totalDisplay = document.createElement("h1");
  totalDisplay.id = "totalDisplay";
  totalDisplay.textContent = `Total: ₱${total}`;
  totalDisplay.style.position = "absolute";
  totalDisplay.style.top = "70vh";
  totalDisplay.style.left = "3vw";
  totalDisplay.style.fontFamily = "'JUA', sans-serif";
  totalDisplay.style.fontSize = "2vw";
  container.appendChild(totalDisplay);

  const textOV = document.createElement("h1");
  textOV.textContent = `This is just an overview. Please take your receipt over the counter`;
  textOV.style.position = "absolute";
  textOV.style.top = "80vh";
  textOV.style.left = "11vw";
  textOV.style.width = "40vw";
  textOV.style.fontFamily = "'Roboto', sans-serif";
  textOV.style.fontStyle = "italic";
  textOV.style.fontSize = "1.6vw";
  container.appendChild(textOV);

  const xim = document.createElement("img");
  xim.src = "BACK_BTN_TABLET.png";
  xim.style.position = "absolute";
  xim.style.width = "7vw";
  xim.style.height = "auto";
  xim.style.top = "3vh";
  xim.style.left = "51vw";
  xim.id = "xxx";
  xim.addEventListener("click", () => {
    backbtnsfx.currentTime = 0;
    backbtnsfx.play();
    orderFinalPage();
  });
  container.appendChild(xim);

  document.body.appendChild(container);

  let countdownTime = 30;
  const countdownDisplay = document.createElement("p");
  countdownDisplay.textContent = `Returning in ${countdownTime} seconds...`;

  countdownDisplay.style.position = "absolute";
  countdownDisplay.style.top = "77vh";
  countdownDisplay.style.left = "57%";
  countdownDisplay.style.transform = "translateX(-50%)";
  countdownDisplay.style.fontFamily = "'JUA', sans-serif";
  countdownDisplay.style.fontStyle = "italic";
  countdownDisplay.style.fontSize = "2vw";
  countdownDisplay.style.color = "#fa003f";
  countdownDisplay.style.zIndex = "9999";
  countdownDisplay.style.opacity = "1";
  countdownDisplay.style.margin = "0";
  countdownDisplay.classList.add("pulse");

  document.body.appendChild(countdownDisplay);

  const countdownInterval = setInterval(() => {
    countdownTime--;
    countdownDisplay.textContent = `Returning in ${countdownTime} seconds...`;

    if (countdownTime <= 0) {
      clearInterval(countdownInterval);
      Homepage();
    }
  }, 1000);

  window.addEventListener("beforeunload", () => {
    clearInterval(countdownInterval);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(countdownInterval);
    } else {
      countdownInterval = setInterval(() => {
        countdownTime--;
        countdownDisplay.textContent = `Returning in ${countdownTime} seconds...`;

        if (countdownTime <= 0) {
          clearInterval(countdownInterval);
          Homepage();
        }
      }, 1000);
    }
  });

  function Homepage() {
    window.location.href = "index.html";
  }
}

Homepage();
rainingCoffee();
applyCustomFont();

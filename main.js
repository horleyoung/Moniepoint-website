
// nigeria dropdown
const countries = document.querySelectorAll(".nig-dropdown");
  countries.forEach(country => {
    country.addEventListener("click", function () {
   document.getElementById("customAlert").classList.remove("hidden");
  });
  }) 
  function closeAlert() {
    document.getElementById("customAlert").classList.add("hidden");
  }

// hamburger for mobile screen
const hamburger = document.querySelector(".hamburger");
hamburger.addEventListener("click", function() {
  document.getElementById("three-lines").classList.remove("hidden");
});
function closeHamburger() {
  document.getElementById("three-lines").classList.add("hidden")
}
// inside hamburger
const compDropdown = document.querySelector(".comp-dropdown");
const innerComp = document.getElementById("inner-comp");

compDropdown.addEventListener("click", function () {
  innerComp.classList.toggle("hidden");
});





// mouse-over containers 
// Select all containers and buttons
const containers = document.querySelectorAll(".tool-container");
const tabButtons = document.querySelectorAll(".tab-btn");

// Function to update the active tab on scroll
function updateActiveTabOnScroll() {
  let currentTarget = null;

  containers.forEach(container => {
    const rect = container.getBoundingClientRect();

    // Check if container is in view (near top of viewport)
     if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
      currentTarget = container.dataset.target;
    }
  });

  if (currentTarget) {
    setActiveTab(currentTarget);
  }
}


// Function to highlight the correct tab
function setActiveTab(target) {
  tabButtons.forEach(btn => {
    if (btn.dataset.target === target) {
      btn.classList.add("bg-[#c4e9fd]", "text-[#092256]", "font-medium", "p-3", "rounded-3xl");
    } else {
      btn.classList.remove("bg-[#c4e9fd]", "text-[#092256]", "font-medium", "p-3", "rounded-3xl");
    }
  });
}

// Scroll behavior
window.addEventListener("scroll", updateActiveTabOnScroll);

// Mouseover behavior
containers.forEach(container => {
  container.addEventListener("mouseover", () => {
    setActiveTab(container.dataset.target);
  });
});



// animation countdown
document.addEventListener("DOMContentLoaded", () => {
  const testimonies = document.querySelectorAll(".testimony");
  const texts = document.querySelectorAll(".testimony-text");
  const circles = document.querySelectorAll('circle[data-animation="testimony-circle"]');

  const leftBtns = document.querySelectorAll(".leftbtn");
  const rightBtns = document.querySelectorAll(".rightbtn");

  const duration = 9000; // ms (9s)
  const DASH = circles.length ? circles[0].getAttribute("stroke-dasharray") : "251.2";

  // build sequence: 0,1,2,3,2,1  (works for any n > 2)
  function buildSequence(n) {
    if (n <= 1) return [0];
    if (n === 2) return [0, 1]; // simple alternation
    const seq = [];
    for (let i = 0; i < n; i++) seq.push(i);
    for (let i = n - 2; i > 0; i--) seq.push(i);
    return seq;
  }

  const seq = buildSequence(testimonies.length);
  let seqPos = 0;             
  let cycleTimeout = null;

  // helper: stop any running circle animations and reset dash offset
  function resetAllCircles() {
    circles.forEach(circle => {
      circle.style.animation = "none";         
      circle.offsetHeight; // Force reflow
      circle.style.strokeDashoffset = DASH;    
    });
  }

  // animate a single circle
  function animateCircle(index) {
    const circle = circles[index];
    if (!circle) return;
    circle.style.animation = `smallCircle ${duration / 1000}s linear forwards`;
  }

  // show testimony image/text for given index
  function showByIndex(index) {
    testimonies.forEach((t, i) => t.classList.toggle("hidden", i !== index));
    texts.forEach((txt, i) => txt.classList.toggle("hidden", i !== index));
  }

  function setActiveBySeqPos(pos) {
    const index = seq[pos];
    resetAllCircles();
    showByIndex(index);
    animateCircle(index);
  }

  function scheduleNext() {
    clearTimeout(cycleTimeout);
    cycleTimeout = setTimeout(() => {
      seqPos = (seqPos + 1) % seq.length;
      setActiveBySeqPos(seqPos);
      scheduleNext();
    }, duration);
  }

  function goNextManual() {
    seqPos = (seqPos + 1) % seq.length;
    setActiveBySeqPos(seqPos);
    scheduleNext();
  }

  function goPrevManual() {
    seqPos = (seqPos - 1 + seq.length) % seq.length;
    setActiveBySeqPos(seqPos);
    scheduleNext();
  }

  // ✅ attach to all arrow buttons
  rightBtns.forEach(btn => {
    btn.addEventListener("click", goNextManual);
  });

  leftBtns.forEach(btn => {
    btn.addEventListener("click", goPrevManual);
  });

  // INITIALIZE
  resetAllCircles();
  seqPos = 0;
  setActiveBySeqPos(seqPos);
  scheduleNext();
});


//movt for stepper
const stepperSection = document.querySelector(".get-started");
console.log("stepperSection:", stepperSection);

const stepperList = stepperSection?.querySelector("ul");
console.log("stepperList:", stepperList);

const steps = stepperList?.querySelectorAll("li") || [];
console.log("steps found:", steps.length);

const progressBars = stepperList?.querySelectorAll(".animated") || [];
console.log("progress bars found:", progressBars.length);

const stepCircles = stepperList?.querySelectorAll(".step-circle") || [];
console.log("step circles found:", stepCircles.length);


// const stepperSection = document.querySelector(".get-started");
// const stepperList = stepperSection.querySelector(".get-started ul");
// const steps = stepperList.querySelectorAll(".get-started ul li");
// const progressBars = stepperList.querySelectorAll(".animated");
// const stepCircles = stepperList.querySelectorAll(".step-circle"); 

let inStepper = false;        // whether we’re “trapped” in the stepper
let stepperProgress = 0;      // between 0 and 1
let maxProgress = steps.length - 1; // 0 → 3 (for 4 steps)

// listen for scroll position
window.addEventListener("scroll", () => {
  const rect = stepperSection.getBoundingClientRect();

  // Enter trap zone: section top hits viewport top & section not finished
  if (rect.top <= 0 && rect.bottom > window.innerHeight) {
    inStepper = true;
  }
});

window.addEventListener("wheel", (e) => {
  if (!inStepper) return;

  e.preventDefault(); // stop normal page scroll

  // Convert wheel delta into stepper progress
  stepperProgress += e.deltaY * 0.003; // adjust sensitivity
  stepperProgress = Math.min(Math.max(stepperProgress, 0), maxProgress);

  updateStepper(stepperProgress);

  // Release when finished at the end
  if (stepperProgress >= maxProgress) {
    document.body.style.overflow = "";
    inStepper = false;
  }

  // Release when fully back at start (scrolling up)
  if (stepperProgress <= 0) {
    document.body.style.overflow = "";
    inStepper = false;
  }
}, { passive: false });

// update UI according to progress
function updateStepper(progress) {
  const stepIndex = Math.floor(progress);
  const stepFraction = progress - stepIndex;

  // Translate list horizontally
  const translateX = -(progress * (stepperList.scrollWidth / steps.length));
  stepperList.style.transform = `translateX(${translateX}px)`;

  // Fill bars up to current step
  progressBars.forEach((bar, i) => {
    if (i < stepIndex) {
      bar.style.width = "100%";
    } else if (i === stepIndex) {
      bar.style.width = `${stepFraction * 100}%`;
    } else {
      bar.style.width = "0";
    }
  });
  stepCircles.forEach((circle, i) => {
    if (i < stepIndex) {
      circle.style.color = "#0357ee"
      circle.style.borderColor = "rgba(3, 87, 238, 1.0)"
    } else if (i === stepIndex) {
      circle.style.color = "#0357ee"
      circle.style.borderColor = `rgba(3, 87, 238, ${Math.min(Math.max(stepFraction * 3, 0), 1)})`
      if(i === 3) {
      circle.style.borderColor = "rgba(3, 87, 238, 1.0)"
      }
    } else {
      circle.style.color = "#54668b"
      circle.style.borderColor = "rgba(3, 87, 238, 0)"
    }
    if (i === 0) {
        if (stepFraction === 0) {
          circle.style.color = "#54668b"
      }
    }    
  })
}





//movt for blog container 
const container = document.querySelector(".business-blog-viewport"); 
const items = document.querySelectorAll(".blog-item");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

// Show item by scrolling and updating dots
function showItem(index) {
  // Scroll to the selected item
    items[index].scrollIntoView({
        behaviour: "smooth",
        inline: "center",
        block: "nearest"
    })

  // Reset all dots
  dots.forEach(dot => dot.classList.remove("bg-blue-600", "bg-blue-200"));
  dots.forEach(dot => dot.classList.add("bg-blue-200"));

  // Highlight the active one
  dots[index].classList.remove("bg-blue-200");
  dots[index].classList.add("bg-blue-600");
}

// Handle prev click
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  showItem(currentIndex);
});

// Handle next click
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1 ) % items.length;
  showItem(currentIndex);
});

// Initialize the first view
showItem(currentIndex);

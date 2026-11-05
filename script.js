// EcoPulse - simple JavaScript project

// Load old totals, or start from zero.
let totals = JSON.parse(localStorage.getItem("ecoTotals")) || {
  power: 0,
  water: 0,
  food: 0
};

// Show the totals on the website.
function showTotals() {
  document.getElementById("powerTotal").textContent = totals.power.toFixed(2);
  document.getElementById("waterTotal").textContent = totals.water.toFixed(2);
  document.getElementById("foodTotal").textContent = totals.food.toFixed(2);
}

showTotals();

// Add a new resource entry.
document.getElementById("trackerForm").addEventListener("submit", function(event) {
  event.preventDefault();

  let resource = document.getElementById("resource").value;
  let amount = Number(document.getElementById("amount").value);

  if (amount <= 0 || amount > 100000 || !Number.isFinite(amount)) {
    document.getElementById("message").textContent = "Enter a valid amount.";
    return;
  }

  totals[resource] += amount;
  localStorage.setItem("ecoTotals", JSON.stringify(totals));
  showTotals();

  document.getElementById("message").textContent = "Entry added successfully!";
  document.getElementById("amount").value = "";
});

// Clear the totals after confirmation.
document.getElementById("reset").addEventListener("click", function() {
  if (confirm("Clear all recorded totals?")) {
    totals = { power: 0, water: 0, food: 0 };
    localStorage.setItem("ecoTotals", JSON.stringify(totals));
    showTotals();
    document.getElementById("message").textContent = "Totals cleared.";
  }
});

// Three easy sustainability questions.
let questions = [
  {
    question: "Your school wastes electricity. What should you do?",
    good: "Use LED lights and switch off unused devices",
    bad: "Leave everything switched on"
  },
  {
    question: "A tap is leaking. What should you do?",
    good: "Report it and get it repaired",
    bad: "Ignore the leak"
  },
  {
    question: "There is extra edible food at home. What should you do?",
    good: "Store it safely and use it later",
    bad: "Throw it away immediately"
  }
];

let current = 0;
let score = 0;
let answered = false;

// Check the selected answer.
function answer(correct) {
  if (answered) return;
  answered = true;

  if (correct) {
    score += 10;
    document.getElementById("result").textContent = "Great choice! +10 points 🌱";
  } else {
    document.getElementById("result").textContent = "Try a more sustainable choice next time.";
  }

  document.getElementById("score").textContent = score;
  document.getElementById("next").hidden = false;
}

// Show the next question.
function nextQuestion() {
  current++;

  if (current === questions.length) {
    document.getElementById("question").textContent =
      "Game finished! Your final EcoScore is " + score + "/30.";
    document.getElementById("answers").innerHTML = "";
    document.getElementById("next").hidden = true;
    return;
  }

  let q = questions[current];
  document.getElementById("question").textContent = q.question;
  document.getElementById("answers").innerHTML =
    '<button onclick="answer(true)">' + q.good + '</button>' +
    '<button onclick="answer(false)">' + q.bad + '</button>';

  answered = false;
  document.getElementById("result").textContent = "";
  document.getElementById("next").hidden = true;
}

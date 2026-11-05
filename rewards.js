// EcoRewards — simple, self-reported DEMO rewards. No real cash is paid.
const rewardPrices = {
  bottle: ["Plastic bottle", 10], can: ["Aluminium can", 15],
  paper: ["1 kg paper", 30], cardboard: ["1 kg cardboard", 25],
  plastic: ["1 kg plastic", 50], reuse: ["Reusable container", 10],
  water: ["Water-saving action", 20], power: ["Energy-saving action", 20]
};
const rewardKey = "ecopulse-rewards-demo-v1";
let wallet = {points: 0, redeemed: 0, history: []};
try {
  const old = JSON.parse(localStorage.getItem(rewardKey));
  if (old && Number.isFinite(old.points) && old.points >= 0 &&
      Number.isInteger(old.redeemed) && old.redeemed >= 0 && Array.isArray(old.history)) wallet = old;
} catch (error) { /* Start a fresh demo wallet if stored data is invalid. */ }

function saveWallet() {
  localStorage.setItem(rewardKey, JSON.stringify(wallet));
}
function showWallet() {
  document.getElementById("wallet-points").textContent = wallet.points;
  document.getElementById("wallet-value").textContent = "AED " + (wallet.points * 5 / 300).toFixed(2);
  document.getElementById("wallet-redeemed").textContent = wallet.redeemed;
  document.getElementById("wallet-actions").textContent = wallet.history.filter(item => item.type === "earn").length;
  const list = document.getElementById("reward-history");
  list.replaceChildren();
  if (wallet.history.length === 0) {
    list.textContent = "No activity yet. Record your first green action!";
    return;
  }
  wallet.history.slice(-8).reverse().forEach(item => {
    const row = document.createElement("div");
    row.className = "activity-item";
    const label = document.createElement("span");
    label.textContent = item.label;
    const amount = document.createElement("b");
    amount.textContent = (item.points > 0 ? "+" : "") + item.points + " pts";
    row.append(label, amount);
    list.append(row);
  });
}

document.getElementById("reward-form").addEventListener("submit", function(event) {
  event.preventDefault();
  const action = document.getElementById("reward-action").value;
  const quantity = Number(document.getElementById("reward-quantity").value);
  if (!rewardPrices[action] || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) return;
  const [label, points] = rewardPrices[action];
  const earned = points * quantity;
  wallet.points += earned;
  wallet.history.push({type: "earn", label: label + " × " + quantity, points: earned});
  saveWallet();
  showWallet();
  document.getElementById("reward-message").textContent = "Added " + earned + " demo points!";
});

document.getElementById("redeem-reward").addEventListener("click", function() {
  const message = document.getElementById("redeem-message");
  if (wallet.points < 300) {
    message.textContent = "You need " + (300 - wallet.points) + " more points.";
    return;
  }
  wallet.points -= 300;
  wallet.redeemed += 1;
  wallet.history.push({type: "redeem", label: "AED 5 demo voucher (not real cash)", points: -300});
  saveWallet();
  showWallet();
  message.textContent = "Demo voucher claimed! No actual payment has been made.";
});

document.getElementById("reset-rewards").addEventListener("click", function() {
  if (!confirm("Reset your demo points and reward history?")) return;
  wallet = {points: 0, redeemed: 0, history: []};
  saveWallet();
  showWallet();
  document.getElementById("redeem-message").textContent = "Demo wallet reset.";
});
showWallet();

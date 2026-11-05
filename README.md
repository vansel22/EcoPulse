# EcoPulse — Build More, Waste Less

A school tech fest website built with HTML, CSS and vanilla JavaScript.

## Features
- Dashboard with a **real seven-day line graph** for electricity, water or food waste
- Resource entry form and saved history
- **Week-on-week comparisons** (only when previous-week data exists)
- Weekly usage targets
- **Load demo data** for a quick judge presentation, and clear demo entries separately
- Five-round EcoCity decisions game
- Six EcoQuests with points
- CSV export, localStorage and mobile-responsive layout

## Run
Open `index.html` in Chrome, Firefox or Edge. No server, API key or framework is required.

## Update your existing GitHub Pages website
1. Open your existing `EcoPulse` repository.
2. Upload **index.html**, **style.css** and **app.js** to the repository root, replacing the old versions.
3. Commit the changes. GitHub Pages will redeploy if already enabled.
4. If Pages isn't enabled, use Settings > Pages > Deploy from a branch > main > / (root).

**Important:** This version uses `app.js`, not `script.js`. The old `script.js` can remain unused, or you can delete it to avoid confusion.

## Demo
Click **Load demo data** on the dashboard, choose the water chart, log a resource entry, complete an EcoQuest and try EcoCity.

## Honest limitations
Readings are entered by users. The charts display recorded amounts, not verified savings. The comparison requires prior-week data. EcoCity scores are fictional educational examples, not scientific environmental models. All data is saved in the browser only.

## SDGs
SDG 12 (primary), SDG 6, SDG 7 and SDG 13.

## License
MIT — see LICENSE.

## EcoRewards demo wallet
The **EcoRewards** page awards points for self-reported recycling and sustainability actions. It uses a proposed demonstration conversion of **300 points = AED 5** and allows simulated voucher redemptions. **It does not pay real money.** A real program would require sponsor funding, secure user accounts, activity verification, fraud controls and payment integration. Wallet data is stored only in the visitor's browser. The reward code is in `rewards.js`.

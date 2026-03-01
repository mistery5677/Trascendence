# Online chess platform

## The game

### Gaming and user experience (Pages 16 - 17) (5 points)

* **--> (2 pts) Major: Implement a complete web-based game where users can play against each other.**
    * The game can be real-time multiplayer (e.g., Pong, Chess, Tic-Tac-Toe, Card games, etc.).
    * Players must be able to play live matches.
    * The game must have clear rules and win/loss conditions.
    * The game can be 2D or 3D.

* **--> (2 pts) Major: Remote players — Enable two players on separate computers to play the same game in real-time.**
    * Handle network latency and disconnections gracefully.
    * Provide a smooth user experience for remote gameplay.
    * Implement reconnection logic.

* **-> (1 pts) Minor: Game customization options.**
    * Power-ups, attacks, or special abilities. (You can promote your peaces and "power up" your pawn)
    * Different maps or themes.
    * Customizable game settings.
    * Default options must be available.

---

### Web (Pages 12 - 13) (5 points)

* **--> (2 pts) Major: Use a framework for both the frontend and backend.**
    * Use a frontend framework (React, Vue, Angular, Svelte, etc.).
    * Use a backend framework (Express, NestJS, Django, Flask, Ruby on Rails,etc.).
    * Full-stack frameworks (Next.js, Nuxt.js, SvelteKit) count as both if you use both their frontend and backend capabilities.

* **--> (2 pts) Major: Implement real-time features using WebSockets or similar technology.**
    * Real-time updates across clients.
    * Handle connection/disconnection gracefully.
    * Efficient message broadcasting.

* **--> (1 pts) Minor: Use an ORM for the database.**

---

### User Management (Page 14) (3 points)

* **--> (2 pts) Major: Standard user management and authentication.**
    * Users can update their profile information.
    * Users can upload an avatar (with a default avatar if none provided).
    * Users can add other users as friends and see their online status.
    * Users have a profile page displaying their information.

* **--> (1 pts) Minor: Game statistics and match history (requires a game module).**
    * Track user game statistics (wins, losses, ranking, level, etc.).
    * Display match history (1v1 games, dates, results, opponents).
    * Show achievements and progression.
    * Leaderboard integration.
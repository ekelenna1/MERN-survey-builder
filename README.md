# Dynamic Survey Builder (MERN Stack)

### Overview
A full-stack web application that allows users to create, manage, and distribute dynamic surveys with live updates. Built using the **MERN stack** (MongoDB, Express.js, React, Node.js), this platform features secure authentication, complex data modeling, and real-time result aggregation.

### Key Features
* **Secure Authentication:** Implemented robust user registration, login, and logout functionality with password security, ensuring users can only manage their own data.
* **Dynamic Poll Creation:** Authenticated users can build custom polls with five distinct question types:
    * Multiple Choice
    * Checkbox
    * Text Area
    * Likert Scale
    * Ranked Choice
* **User Dashboard:** Features a "My Polls" dashboard where users can view active polls, track engagement, and manage survey lifecycles.
* **Public Voting Interface:** Unregistered users can access surveys via unique URLs to submit votes anonymously.
* **Data Security:** relational modeling in MongoDB ensures strict access control—users cannot access or modify polls belonging to others.

### "Creative Portion" & Advanced Logic
* **Data Export & Visualization:** Added functionality for poll owners to export results as **CSV files** formatted for chart generation and external analysis.
* **Poll Expiration & Lifecycle Management:**
    * Implemented logic allowing owners to set automatic expiration dates for polls.
    * Includes editing capabilities to "close early" or "re-open" polls by modifying the expiration timestamp, preventing access after the set time.

### Technologies Used
* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (NoSQL)
* **Best Practices:** HTML5 Validation, Clean/Modular Code Architecture

### How to Run
1.  Clone the repository.
2.  Install dependencies for both client and server:
    ```bash
    cd client && npm install
    cd ../server && npm install
    ```
3.  Set up your environment variables (MongoDB URI, JWT Secret) in a `.env` file.
4.  Run the application (concurrently if configured, or separate terminals):
    ```bash
    # Terminal 1 (Server)
    npm start
    
    # Terminal 2 (Client)
    npm start
    ```

Note: 

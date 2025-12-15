# Dynamic Survey Builder (MERN Stack)

### Overview
A full-stack web application designed for creating, distributing, and analyzing dynamic polls in real-time. Built with the **MERN stack** (MongoDB, Express, React, Node.js), this project demonstrates secure user authentication, complex data modeling, and automated data visualization features.


### Technical Stack
* **Frontend:** React.js, React Router, CSS3
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Utilities:** Axios (Fetch API), JWT, BCrypt

### Core Architecture & Features

#### 🔐 Secure Authentication System
* **JWT Authorization:** Implemented custom middleware (`auth.js`) to protect private routes using JSON Web Tokens.
* **Password Security:** Utilizes `bcryptjs` for hashing and salting passwords before storage in MongoDB.
* **Session Management:** Users can securely register, login, and manage their session state via local storage.

#### 📊 Dynamic Poll Engine
* **Complex Question Types:** The application supports five distinct data input types, handled via a flexible MongoDB schema:
    * Multiple Choice
    * Checkbox (Multi-select)
    * Short Answer (Text)
    * Likert Scale (1-5)
    * Ranked Choice
* **Lifecycle Management:** Poll owners can set specific **expiration dates**. The backend automatically rejects votes submitted after the `expiresAt` timestamp.
* **Validation:** Server-side validation ensures questions cannot be submitted without required fields or with invalid data types.

#### 📈 Data Analysis & Export
* **Custom CSV Algorithm:** Built a client-side algorithm in `PollResults.jsx` that aggregates nested JSON vote data and converts it into a downloadable CSV format for external analysis (Excel/Sheets).
* **Real-time Aggregation:** Vote counts are calculated on-the-fly to display instant results to the poll creator.

### Data Export Logic
The system iterates through every vote and maps answers back to their original question indices to ensure column alignment.

```javascript
// Logic from PollResults.jsx
const downloadCSV = () => {
    const headers = ['Submission Date', ...poll.questions.map(q => `"${q.text}"`)];
    const rows = poll.votes.map(vote => {
        // ... mapping logic to align answers with headers
        return [dateStr, ...answers].join(',');
    });
    // ... Blob creation and download trigger
};

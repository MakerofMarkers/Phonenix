import React from "react";
import "./Statistics.css"; // Import the CSS file

export default function Statistics({ firstName, setPage }) {
  return (
    <>
      {/* Header Bar */}
      <div className="headerBar">
        <button className="homeButton" onClick={() => setPage("Menu")}>
          Home
        </button>
        <button className="homeButton" onClick={() => setPage("Menu")}>
          Logout
        </button>
      </div>

      {/* Main Statistics Page Layout */}
      <div className="statsContainer">
        <h1 className="statsTitle">{firstName}'s Statistics</h1>

        {/* Statistics Summary Cards */}
        <div className="statsCards">
          <div className="statsCard">
            <h2>Total Sessions</h2>
            <p>25</p>
          </div>
          <div className="statsCard">
            <h2>Words Practiced</h2>
            <p>176</p>
          </div>
          <div className="statsCard">
            <h2>Sentences Completed</h2>
            <p>78</p>
          </div>
        </div>
        {/* History Table */}
        <div className="statsHistory">
          <h2>Practice History</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Words Practiced</th>
                <th>Sentences Practiced</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>02/15/2025</td>
                <td>45</td>
                <td>50</td>
              </tr>
              <tr>
                <td>02/16/2025</td>
                <td>131</td>
                <td>28</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

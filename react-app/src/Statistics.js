import React from "react";
import "./Statistics.css"; // Import the CSS file

export default function Statistics({ setPage }) {
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
        <h1 className="statsTitle">User Statistics</h1>

        {/* Statistics Summary Cards */}
        <div className="statsCards">
          <div className="statsCard">
            <h2>Total Sessions</h2>
            <p>25</p>
          </div>
          <div className="statsCard">
            <h2>Words Practiced</h2>
            <p>120</p>
          </div>
          <div className="statsCard">
            <h2>Sentences Completed</h2>
            <p>80</p>
          </div>
        </div>

        {/* Progress Chart Placeholder */}
        <div className="statsChart">
          <h2>Performance Over Time</h2>
          <div className="chartPlaceholder">[Chart Goes Here]</div>
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
                <td>02/07/2025</td>
                <td>15</td>
                <td>10</td>
              </tr>
              <tr>
                <td>02/06/2025</td>
                <td>10</td>
                <td>8</td>
              </tr>
              <tr>
                <td>02/05/2025</td>
                <td>12</td>
                <td>6</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const TimeDropdown = () => {
  const [selectedTime, setSelectedTime] = useState("");

  const times = Array.from({ length: 24 }, (_, hour) =>
    `${hour.toString().padStart(2, '0')}:00`
  );

  const handleChange = (event) => {
    setSelectedTime(event.target.value);
  };

  return (
    <div className="container my-4">
      <div className="card p-4">
        <h5 className="card-title text-center mb-3">Select Time</h5>
        <div className="form-group">
          <label htmlFor="time-dropdown" className="form-label">Choose a Time:</label>
          <select
            id="time-dropdown"
            className="form-select"
            value={selectedTime}
            onChange={handleChange}
          >
            <option value="" disabled>Select a time</option>
            {times.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
        {selectedTime && <p className="mt-3 text-center">Selected Time: <strong>{selectedTime}</strong></p>}
      </div>
    </div>
  );
};

export default TimeDropdown;

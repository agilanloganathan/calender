import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const EventScheduler = () => {
  const [events, setEvents] = useState([
    { id: 1, title: "Meeting", start: "2024-01-01T10:00:00", end: "2024-01-01T12:00:00" },
    { id: 2, title: "Workshop", start: "2024-01-03T14:00:00", end: "2024-01-03T16:00:00" },
  ]);

  const [modal, setModal] = useState({
    isOpen: false,
    mode: "add",
    event: { id: null, title: "", startDate: "", startTime: "", endDate: "", endTime: "" },
  });

  const handleDateSelect = (selectInfo) => {
    setModal({
      isOpen: true,
      mode: "add",
      event: {
        id: null,
        title: "",
        startDate: selectInfo.startStr.split("T")[0],
        startTime: "",
        endDate: selectInfo.startStr.split("T")[0],
        endTime: "",
      },
    });
  };

  const handleEventClick = (clickInfo) => {
    const startDate = clickInfo.event.startStr.split("T")[0];
    const startTime = clickInfo.event.startStr.split("T")[1];
    const endDate = clickInfo.event.endStr.split("T")[0];
    const endTime = clickInfo.event.endStr.split("T")[1];

    setModal({
      isOpen: true,
      mode: "edit",
      event: {
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        startDate,
        startTime,
        endDate,
        endTime,
      },
    });
  };

  const handleCloseModal = () => {
    setModal({
      isOpen: false,
      mode: "add",
      event: { id: null, title: "", startDate: "", startTime: "", endDate: "", endTime: "" },
    });
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0");
      times.push(`${hour}:00`, `${hour}:30`);
    }
    return times;
  };

  const isTimeDisabled = (date, time) => {
    for (let event of events) {
      const eventDate = event.start.split("T")[0];
      const eventStartTime = event.start.split("T")[1];
      const eventEndTime = event.end.split("T")[1];
      if (
        date === eventDate &&
        ((time >= eventStartTime && time < eventEndTime) ||
          (time > eventStartTime && time <= eventEndTime))
      ) {
        return true;
      }
    }
    return false;
  };

  const handleSaveEvent = () => {
    const { startDate, startTime, endDate, endTime, title } = modal.event;
    if (startDate && startTime && endDate && endTime && title) {
      const newEvent = {
        id: modal.mode === "add" ? Date.now() : modal.event.id,
        title,
        start: `${startDate}T${startTime}`,
        end: `${endDate}T${endTime}`,
      };

      setEvents((prev) =>
        modal.mode === "add"
          ? [...prev, newEvent]
          : prev.map((event) => (event.id === newEvent.id ? newEvent : event))
      );
      handleCloseModal();
    }
  };

  return (
    <div className="container-fluid my-4 custom-calendar">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        events={events}
        select={handleDateSelect}
        eventClick={handleEventClick}
        height={"90vh"}
      />

      {modal.isOpen && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0, 0, 0, 0.4)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog" style={{ marginTop: "5em" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modal.mode === "add" ? "Add Event" : "Edit Event"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="eventTitle" className="form-label">
                    Event Title
                  </label>
                  <input
                    type="text"
                    id="eventTitle"
                    className="form-control"
                    value={modal.event.title}
                    onChange={(e) =>
                      setModal({
                        ...modal,
                        event: { ...modal.event, title: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="row">
                  <div className="col-6">
                    <label className="form-label">Start Time</label>
                    <select
                      className="form-control"
                      value={modal.event.startTime}
                      onChange={(e) =>
                        setModal({
                          ...modal,
                          event: { ...modal.event, startTime: e.target.value },
                        })
                      }
                    >
                      <option value="">Select Start Time</option>
                      {generateTimeOptions().map((time) => (
                        <option
                          key={time}
                          value={time}
                          disabled={isTimeDisabled(modal.event.startDate, time)}
                        >
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label">End Time</label>
                    <select
                      className="form-control"
                      value={modal.event.endTime}
                      onChange={(e) =>
                        setModal({
                          ...modal,
                          event: { ...modal.event, endTime: e.target.value },
                        })
                      }
                    >
                      <option value="">Select End Time</option>
                      {generateTimeOptions().map((time) => (
                        <option
                          key={time}
                          value={time}
                          disabled={isTimeDisabled(modal.event.endDate, time)}
                        >
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={handleSaveEvent}>
                  {modal.mode === "add" ? "Add Event" : "Save Changes"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventScheduler;

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Assuming you have a CSS file for custom styles

const EventScheduler = () => {
    const [events, setEvents] = useState([
        { id: 1, title: 'Meeting', start: '2024-01-01T10:00:00', end: '2024-01-01T12:00:00' },
        { id: 2, title: 'Workshop', start: '2024-01-03T14:00:00', end: '2024-01-03T16:00:00' },
    ]);

    const [modal, setModal] = useState({
        isOpen: false,
        mode: 'add', // 'add' or 'edit'
        event: { id: null, title: '', startDate: '', startTime: '', endDate: '', endTime: '' },
    });

    // const handleDateSelect = (selectInfo) => {
    // setModal({
    //     isOpen: true,
    //     mode: 'add',
    //     event: { id: null, title: '', startDate: selectInfo.startStr.split('T')[0], startTime: '', endDate: '', endTime: '' },
    // });
    // };

    const handleDateSelect = (selectInfo) => {
        const selectedDate = new Date(selectInfo.startStr); 
        const today = new Date(); // Current date
        today.setHours(0, 0, 0, 0); // Normalize to midnight for comparison

        if (selectedDate < today) {
            alert("Cannot select a past date for events.");
            return; // Block further processing
        }

        setModal({
            isOpen: true,
            mode: 'add',
            event: { id: null, title: '', startDate: selectInfo.startStr.split('T')[0], startTime: '', endDate: '', endTime: '' },
        });
    };


    const handleEventClick = (clickInfo) => {
        const startDate = clickInfo.event.startStr.split('T')[0];
        const startTime = clickInfo.event.startStr.split('T')[1];
        const endDate = clickInfo.event.endStr.split('T')[0];
        const endTime = clickInfo.event.endStr.split('T')[1];

        setModal({
            isOpen: true,
            mode: 'edit',
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
            mode: 'add',
            event: { id: null, title: '', startDate: '', startTime: '', endDate: '', endTime: '' },
        });
    };

    const generateTimeOptions = () => {
        const times = [];
        for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0');
            times.push(`${hour}:00`, `${hour}:30`);
        }
        return times;
    };

    const timeOptions = generateTimeOptions();
    const handleSaveEvent = () => {
        if (modal.event.title && modal.event.startDate && modal.event.startTime) {
            const start = `${modal.event.startDate}T${modal.event.startTime}`;
            const end = modal.event.endDate && modal.event.endTime ? `${modal.event.endDate}T${modal.event.endTime} ` : start; // Default end same as start if empty

            if (modal.mode === 'add') {
                // Add a new event
                setEvents((prevEvents) => [
                    ...prevEvents,
                    {
                        id: Date.now(),
                        title: modal.event.title,
                        start,
                        end,
                    },
                ]);
            } else if (modal.mode === 'edit') {
                // Update an existing event
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.id === modal.event.id ? { ...modal.event, start, end } : event
                    )
                );
            }
            handleCloseModal();
        }
    };

    const handleDeleteEvent = () => {
        debugger
        if (modal.mode === 'edit') {
            setEvents((prevEvents) =>
                prevEvents.filter((event) => event.id !== modal.event.id)
            );
            handleCloseModal();
        }
    };

    return (
        <div className="container-fluid my-4 custom-calendar">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                buttonText={{
                    today: 'Today',
                    month: 'Month',
                    week: 'Week',
                    day: 'Day',
                    prev: 'Prev',
                    next: 'Next',
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
                <div className="modal show d-block" style={{ background: "rgba(0, 0, 0, 0.4)" }} tabIndex="-1">
                    <div className="modal-dialog" style={{ marginTop: '5em' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {modal.mode === 'add' ? 'Add Event' : 'Edit Event'}
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
                                            setModal({ ...modal, event: { ...modal.event, title: e.target.value } })
                                        }
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        {/* Start Date and Time Inputs */}
                                        <div className="mb-3">
                                            <label htmlFor="startDate" className="form-label">
                                                Start Date
                                            </label>
                                            {/* <input
                                        type="date"
                                        id="startDate"
                                        className="form-control"
                                        value={modal.event.startDate}
                                        onChange={(e) =>
                                            setModal({ ...modal, event: { ...modal.event, startDate: e.target.value } })
                                        }

                                    /> */}
                                            <input
                                                type="date"
                                                id="startDate"
                                                className="form-control"
                                                value={modal.event.startDate}
                                                min={new Date().toISOString().split('T')[0]} // Disable past dates
                                                onChange={(e) =>
                                                    setModal({ ...modal, event: { ...modal.event, startDate: e.target.value } })
                                                }
                                            />


                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="startTime" className="form-label">
                                                Start Time
                                            </label>
                                            <select
                                                id="startTime"
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
                                                {timeOptions.map((time) => (
                                                    <option key={time} value={time}>
                                                        {time}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        {/* End Date and Time Inputs */}
                                        <div className="mb-3">
                                            <label htmlFor="endDate" className="form-label">
                                                End Date
                                            </label>
                                            {/* <input
                                                type="date"
                                                id="endDate"
                                                className="form-control"
                                                value={modal.event.endDate}
                                                onChange={(e) =>
                                                    setModal({ ...modal, event: { ...modal.event, endDate: e.target.value } })
                                                }
                                            /> */}
                                               <input
                                                        type="date"
                                                        id="endDate"
                                                        className="form-control"
                                                        value={modal.event.endDate}
                                                        min={modal.event.startDate || new Date().toISOString().split('T')[0]} // Ensure end date is not before start date or today
                                                        onChange={(e) =>
                                                            setModal({ ...modal, event: { ...modal.event, endDate: e.target.value } })
                                                        }
                                                    />

                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="endTime" className="form-label">
                                                End Time
                                            </label>
                                            <select
                                                id="endTime"
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
                                                {timeOptions.map((time) => (
                                                    <option
                                                        key={time}
                                                        value={time}
                                                        disabled={
                                                            modal.event.startTime &&
                                                            time <= modal.event.startTime
                                                        }
                                                    >
                                                        {time}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className="modal-footer">
                                {modal.mode === 'edit' && (
                                    <button
                                        type="button"
                                        className="btn btn-danger me-auto"
                                        onClick={handleDeleteEvent}
                                    >
                                        Delete Event
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleSaveEvent}
                                >
                                    {modal.mode === 'add' ? 'Add Event' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
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
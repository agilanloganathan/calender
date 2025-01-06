import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Assuming you have a CSS file for custom styles
import timeArray from '../time.json';

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

    // const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');

    const handleDateSelect = (selectInfo) => {
        setModal({
            isOpen: true,
            mode: 'add',
            event: { id: null, title: '', startDate: selectInfo.startStr.split('T')[0], startTime: '', endDate: '', endTime: '' },
        });
    };

    const handleEventClick = (clickInfo) => {
        const startDate = clickInfo.event.startStr.split('T')[0];
        const startTime = clickInfo.event.startStr.split('T')[1].substring(0, 5);
        const endDate = clickInfo.event.endStr.split('T')[0];
        const endTime = clickInfo.event.endStr.split('T')[1].substring(0, 5);

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

    const deleteEventById = (id) => {
        setEvents((prevEvents) => prevEvents.filter((event) => modal.event.id !== id));
    };

    const handleSaveEvent = () => {
        if (modal.event !== '') {
            const start = `${modal.event.startDate}T${modal.event.startTime}`;
            const end = modal.event.endDate && modal.event.endTime ? `${modal.event.endDate}T${modal.event.endTime} `: start; // Default end same as start if empty

            if (modal.mode === 'add') {
                // Add a new event
                setEvents((prevEvents) => [
                    ...prevEvents,
                    {
                        id: Date.now(),
                        title: modal.event.title.charAt(0).toUpperCase() + modal.event.title.slice(1),
                        start,
                        end,
                    },
                ]);
            } else {
                // Update an existing event
                
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.id === modal.event.id ? { ...modal.event, start, end } : event
                    )
                );
                
                if(modal.event.id !== ""){
                    deleteEventById(modal.event.id);
                }
            }
            handleCloseModal();
        }
    };

    // const handleDeleteEvent = () => {
    //     debugger
    //     if (modal.mode === 'edit') {
    //         setEvents((prevEvents) =>
    //             prevEvents.filter((event) => event.id !== modal.event.id)
    //         );
    //         handleCloseModal();
    //     }
    // };

    const isTimeDisabled = (time, date) => {
        const dateTime = `${date}T${time}`;
        return events.some(
            (event) =>
                new Date(event.start) <= new Date(dateTime) && new Date(dateTime) < new Date(event.end)
        );
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
                                            <input
                                                type="date"
                                                id="startDate"
                                                className="form-control"
                                                value={modal.event.startDate}
                                                min={new Date().toISOString().split('T')[0]} // Disable past dates
                                                // disabled={!!modal.event.startDate} // Disable if Start Date is already set
                                                onChange={(e) =>
                                                    setModal({ ...modal, event: { ...modal.event, startDate: e.target.value } })
                                                }
                                                // onChange={(e) => {
                                                //     const selectedDate = e.target.value;
                                                //     if (new Date(selectedDate) >= new Date()) { // Validate the date is not in the past
                                                //         setModal({ ...modal, event: { ...modal.event, startDate: selectedDate, endDate: '' } }); // Reset End Date
                                                //     } else {
                                                //         alert("You cannot select a date in the past."); // Alert if invalid date is selected
                                                //     }
                                                // }}
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
                                                className="form-select"
                                                value={modal.event.startTime}
                                                onChange={(e) =>
                                                    setModal({ ...modal, event: { ...modal.event, startTime: e.target.value } })
                                                }
                                            >
                                                {timeArray.map((time) => (
                                                <option
                                                    key={time.value}
                                                    value={time.value}
                                                    disabled={isTimeDisabled(time.value, modal.event.startDate)}
                                                >
                                                    {time.label}
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
                                            <input
                                                type="date"
                                                id="endDate"
                                                className="form-control"
                                                value={modal.event.endDate}
                                                min={modal.event.startDate || new Date().toISOString().split('T')[0]} // Disable past dates or dates before Start Date
                                                // disabled={!!modal.event.endDate} // Disable if End Date is already se
                                                onChange={(e) =>
                                                    setModal({ ...modal, event: { ...modal.event, endDate: e.target.value } })
                                                }
                                                // onChange={(e) => {
                                                //     const selectedDate = e.target.value;
                                                //     if (
                                                //         modal.event.startDate &&
                                                //         new Date(selectedDate) >= new Date(modal.event.startDate)
                                                //     ) {
                                                //         setModal({ ...modal, event: { ...modal.event, endDate: selectedDate } });
                                                //     } else {
                                                //         alert("The end date must be on or after the start date.");
                                                //     }
                                                // }}
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
                                                className="form-select"
                                                value={modal.event.endTime}
                                                onChange={(e) =>
                                                    setModal({ ...modal, event: { ...modal.event, endTime: e.target.value } })
                                                }
                                            >
                                                {timeArray.map((time) => (
                                                <option
                                                    key={time.value}
                                                    value={time.value}
                                                    disabled={isTimeDisabled(time.value, modal.event.endDate || modal.event.startDate)}
                                                >
                                                    {time.label}
                                                </option>
                                            ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className="modal-footer">
                                {/* {modal.mode === 'edit' && (
                                    <button
                                        type="button"
                                        className="btn btn-danger me-auto"
                                        onClick={handleDeleteEvent}
                                    >
                                        Delete Event
                                    </button>
                                )} */}
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleSaveEvent}
                                >
                                    {modal.mode === 'add' ? 'Add Event' : ' Delete Event'}
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
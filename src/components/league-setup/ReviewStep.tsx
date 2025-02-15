
import React from 'react';
import { format } from "date-fns";
import { LeagueFormData } from './types';

interface ReviewStepProps {
  leagueData: LeagueFormData;
}

export function ReviewStep({ leagueData }: ReviewStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Review League Details</h2>
      <div className="mb-4">
        <strong>League Name:</strong> {leagueData.leagueName}
      </div>
      <div className="mb-4">
        <strong>Sport:</strong> {leagueData.sport}
      </div>
      <div className="mb-4">
        <strong>City:</strong> {leagueData.city}
      </div>
      <div className="mb-4">
        <strong>Description:</strong> {leagueData.description}
      </div>
      {leagueData.logo && (
        <div className="mb-4">
          <strong>Logo:</strong> {leagueData.logo.name}
        </div>
      )}
      <h3 className="text-xl font-bold mt-4 mb-2">Events:</h3>
      {leagueData.events.map((event, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <h4 className="text-lg font-semibold">Event {index + 1}</h4>
          <div><strong>Title:</strong> {event.title}</div>
          <div><strong>Location:</strong> {event.location}</div>
          <div><strong>Number of Teams:</strong> {event.numTeams}</div>
          <div><strong>Roster Spots per Team:</strong> {event.rosterSpots}</div>
          <div><strong>RSVP Deadline:</strong> {event.rsvpDeadlineOption} hours before</div>
          <h5 className="text-md font-semibold mt-2">Event Dates:</h5>
          {event.eventDates.map((date, dateIndex) => (
            <div key={dateIndex} className="mb-2 p-2 border rounded">
              <div><strong>Date:</strong> {date.date ? format(date.date, "PPP") : 'Not set'}</div>
              <div><strong>Start Time:</strong> {date.startHour}:{date.startMinute} {date.startAmPm}</div>
              <div><strong>End Time:</strong> {date.endHour}:{date.endMinute} {date.endAmPm}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

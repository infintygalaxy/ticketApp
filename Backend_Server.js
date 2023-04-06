// Import necessary libraries
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an instance of the express application
const app = express();

// Use middleware to parse incoming JSON data and enable CORS
app.use(bodyParser.json());
app.use(cors());

// Start listening on port 3000 and log a message when the server is started
app.listen(3000, () => {
console.log('Server started');
});

// Initialize arrays for storing data
let ticketsList = [];
let showTimings = [];
let customers = [];
let moviesList = [
{
id: 1,
title: 'Avengers: Endgame',
description:"sample text",
image:
'https://www.gstatic.com/tv/thumb/v22vodart/15861846/p15861846_v_v8_aa.jpg',
duration: 181,
language: 'English',
genre: 'Action, Adventure, Drama',
releaseDate: new Date('2019-04-26'),
},
{
id: 2,
title: 'Joker',
description:"sample text",
image:
'https://www.gstatic.com/tv/thumb/v22vodart/16593865/p16593865_v_v8_aa.jpg',
duration: 122,
language: 'English',
genre: 'Crime, Drama, Thriller',
releaseDate: new Date('2019-10-04'),
},
];
let audis = [
{
id: 1,
name: 'Audi 1',
rows: 10,
seatsPerRow: 10,
},
{
id: 2,
name: 'Audi 2',
rows: 8,
seatsPerRow: 8,
},
];

// Endpoint to get a specific movie by ID
app.get('/moviesList/:id', (req, res) => {
const movieId = parseInt(req.params.id);
const movie = moviesList.find((movie) => movie.id === movieId);
if (movie) {
res.json(movie);
} else {
res.status(404).send('Movie not found');
}
});

// Endpoint to get a list of movies, optionally filtered by title
app.get('/moviesList', (req, res) => {
const { title } = req.query;
if (title) {
const filteredMovies = moviesList.filter((movie) =>
movie.title.toLowerCase().includes(title.toLowerCase())
);
res.json(filteredMovies);
} else {
res.json(moviesList);
}
});

// Endpoint to book a ticket
app.post('/ticketsList', (req, res) => {
const ticket = req.body;
const { showTimingId, seatNumber } = ticket;

// Check if the show timing ID is valid
const showTiming = showTimings.find(
(showTiming) => showTiming.id === showTimingId
);
if (!showTiming) {
return res.status(400).send('Invalid show timing ID');
}

// Check if the audi ID is valid
const audi = audis.find((audi) => audi.id === showTiming.audiId);
if (!audi) {
return res.status(400).send('Invalid audi ID');
}

// Check if the seat number is valid
if (seatNumber.row > audi.rows || seatNumber.seat > audi.seatsPerRow) {
return res.status(400).send('Invalid seat number');
}

// Check if the seat is already booked
  const existingTicket = ticketsList.find(
    (ticket) =>
      ticket.showTimingId === showTimingId &&
      ticket.seatNumber.row === seatNumber.row &&
      ticket.seatNumber.seat === seatNumber.seat
  );
  if (existingTicket) {
    return res.status(400).send('Seat already booked');
  }

  const ticketId = ticketsList.length + 1;
  const newTicket = {
    id: ticketId,
    showTimingId,
    seatNumber,
  };
  ticketsList.push(newTicket);
  res.json(newTicket);
});

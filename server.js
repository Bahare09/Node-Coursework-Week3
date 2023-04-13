const express = require("express");
const cors = require("cors");
const moment = require("moment");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

//Create a new booking
app.post("/bookings", (req, res) => {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = req.body;

  //check all field been filled up
  if (
    !title ||
    !firstName ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate
  ) {
    res.send("newBooking has empty field");
  } else {
    //creating id for the new booking
    const newBooking = req.body;
    newBooking.id = Math.max(...bookings.map((booking) => booking.id), 0) + 1;
    bookings.push(newBooking);
    res.json(bookings);
  }
});
//search by date

app.get("/bookings/search", (req, res) => {
  const date = moment(req.query.date, "YYYY-MM-DD");
  if (date.isValid()) {
    res.json(
      bookings.filter((booking) => {
        return date.isBetween(
          booking.checkInDate,
          booking.checkOutDate,
          null,
          "[]"
        );
      })
    );
  } else {
    res
      .status(400)
      .json({ msg: "please enter the date format correctly YYYY-MM-DD" });
  }
});

//read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});
// Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  let filtered = bookings.find((booking) => booking.id === bookingId);
  if (filtered) {
    res.json(filtered);
  } else {
    res.status(404).send("the booking to be read cannot be found by id");
  }
});
//Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id === bookingId
  );
  if (bookingIndex === -1) {
    res.status(404).send("the booking to be delete cannot be found by id");
  } else {
    bookings.splice(bookingIndex, 1);
    res.json(bookings);
  }
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

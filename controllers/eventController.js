const Event = require('../models/event');
const moment = require('moment');

function indexRoute(req, res, next) {
  Event.find().then(events => {
    events.sort(function(event1, event2){
      return new Date(event1.date) - new Date(event2.date);
    });
    res.json(events);
  })
    .catch(next);
}

function showRoute(req, res, next) {
  Event.findById(req.params.eventId)
    .populate('createdBy comments.user attendees.attendee')
    .then(event => res.json(event))
    .catch(next);
}

function createRoute(req, res, next) {
  req.body.createdBy = req.tokenUserId;
  req.body.date = moment(req.body.date).format('DD MMMM YYYY, HH:mm');
  req.body.dateTo = moment(req.body.dateTo).format('DD MMMM YYYY, HH:mm');
  Event.create(req.body)
    .then(event => res.status(201).json(event))
    .catch(next);
}

function updateRoute(req, res, next) {
  req.body.date = moment(req.body.date).format('DD MMMM YYYY, HH:mm');
  req.body.dateTo = moment(req.body.dateTo).format('DD MMMM YYYY, HH:mm');
  Event.findById(req.params.eventId)
    .then(event => event.set(req.body))
    .then(event => event.save())
    .then(event => res.json(event))
    .catch(next);
}

function deleteRoute(req, res, next) {
  Event.findByIdAndDelete(req.params.eventId)
    .then(() => res.sendStatus(204))
    .catch(next);
}

function addAttendee(req, res, next) {
  Event.findById(req.params.eventId)
    .then(event => {
      if(!event.attendees.find(att => att.attendee.toString() === req.tokenUserId)){
        event.attendees.push({attendee: req.tokenUserId});
        return event.save();
      } else {
        res.status(422).json({message: 'Already attending'});
        next();
      }
    })
    .then(event => Event.populate(event, 'createdBy comments.user attendees.attendee'))
    .then(event => res.json(event))
    .catch(next);
}

function removeAttendee(req, res, next) {
  Event
    .findById(req.params.eventId)
    .then(event => {
      if (!event.attendees.find(att => att.attendee.toString() === req.tokenUserId)) {
        res.status(422).json({ message: 'Must first be an attendee in order to remove.'});
      } else {
        event.attendees = event.attendees.filter(x => x.attendee.toString() !== req.tokenUserId);
        console.log('removed!');
        return event.save();
      }
    })
    .then(event => Event.populate(event, 'createdBy comments.user attendees.attendee'))
    .then(event => res.json(event))
    .catch(next);
}

module.exports = {
  index: indexRoute,
  show: showRoute,
  create: createRoute,
  edit: updateRoute,
  delete: deleteRoute,
  add: addAttendee,
  remove: removeAttendee
};

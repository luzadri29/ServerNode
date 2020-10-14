const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Leaders = require('../model/leaders');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get(cors.cors, (req, res, next) => {
    Leaders.find({})
     .then((leaders) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(leaders);
     }, (err) => next(err))
     .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Leaders.create(req.body)
     .then((leader) => {
         console.log('Leader created', leader);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(leader);
     }, (err) => next(err))
     .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403
    res.end('put operation not supported on leader');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Leaders.remove({})
     .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
     }, (err) => next(err))
     .catch((err) => next(err));
});

leaderRouter.route('/:leaderId')
.get(cors.cors, (req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
  res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    },{
        new: true
    })
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
     }, (err) => next(err))
     .catch((err) => next(err));
});

module.exports = leaderRouter;
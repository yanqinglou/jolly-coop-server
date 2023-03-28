const express = require("express");
const router = express.Router();
const { Game, User, Group, Countdown } = require("../models");
const jwt = require("jsonwebtoken");
const { afterBulkSync } = require("../models/User");
const sequelize = require('../config/connection');

//find all countdown
router.get("/", (req, res) => {
  Countdown.findAll({
    include: [User, Group],
  })
    .then((allCountdown) => {
      res.json(allCountdown);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: "womp womp womp",
        err,
      });
    });
});

//find countdown by group
router.get("/group/:groupId", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to find a group!" });
  }
  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  Countdown.findAll({
    where: {
      GroupId: req.params.groupId
    },
    order: [
      [sequelize.literal('enddate'), 'ASC']
  ]
  })
    .then((allCountdown) => {
      res.json(allCountdown);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: "womp womp womp",
        err,
      });
    });
});

//find one group
router.get("/:id", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to find a group!" });
  }
  try{
    Group.findByPk(req.params.id, { include: [User, Game] })
    .then((allGroups) => {
      res.json(allGroups);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: "womp womp womp",
        err,
      })
    });
  }catch (err) {
    console.log(err);
    return res.status(403).json(err);
  }

});

// create a countdown and then add in users
router.post("/", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to create a group!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const createCountdown = await Countdown.create(
      {
        UserId:tokenData.id,
        GroupId:req.body.GroupId,
        enddate: req.body.enddate,
        status: req.body.status,
      },
      { include: [User, Group] }
    );
    res.json(createCountdown);
  } catch (err) {
    console.log(err);
    return res.status(403).json(err);
  }
});

// delete one countdown PROTECTED
router.delete("/:eventid", async(req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to delete a play!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const foundCountdown= await Countdown.findByPk(req.params.eventid)
        if (!foundCountdown) {
          return res.status(404).json({ msg: "no such group!" });
        }
        if (foundCountdown.UserId !== tokenData.id) {
          return res
            .status(403)
            .json({ msg: "you can only delete countdown you created!" });
        }
    const delCountdown = await Countdown.destroy({
          where: {
            id: req.params.eventid
          },
        }) 
    res.json(delCountdown);
  } catch (err) {
    return res.status(403).json({ msg: "invalid token" });
  }
});

module.exports = router;

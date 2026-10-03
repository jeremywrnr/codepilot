// accepting screenshots at the feedback url
// curl --data "feedback={...}" http://localhost:3000/feedback/

import express from "express";
import { WebApp } from "meteor/webapp";
import { addIssue } from "./issues";

WebApp.handlers.post(
  "/feedback/",
  express.urlencoded({ extended: false, limit: "10mb" }), // screenshots are big
  async (req, res) => {
    try {
      const issue = JSON.parse(req.body.feedback);
      if (await Meteor.users.findOneAsync(issue.user)) // dont take junk
        await addIssue(issue);
      res.status(201).json({ status: "added" });
    } catch (err) {
      console.error(err);
      res.status(400).json({ status: "error" });
    }
  }
);

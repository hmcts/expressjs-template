import * as healthcheck from "@hmcts/nodejs-healthcheck";
import * as express from "express";

const router = express.Router();

router.get("/health", healthcheck.configure({
  checks: {
    // TODO: replace this sample check with proper checks for your application
    sampleCheck: healthcheck.raw(() => healthcheck.up()),
  },
}));

module.exports = router;

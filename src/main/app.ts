import * as logging from "@hmcts/nodejs-logging";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as expressNunjucks from "express-nunjucks";
import * as path from "path";
import { RouterFinder } from "router/routerFinder";
import * as favicon from "serve-favicon";

const env = process.env.NODE_ENV || "development";
export const app: express.Express = express();
app.locals.ENV = env;

// TODO: adjust these values to your application
logging.config({
  environment: process.env.NODE_ENV,
  microservice: "expressjs-template",
  team: "platform-engineering",
});

// setup logging of HTTP requests
app.use(logging.express.accessLogger());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "njk");

app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "/public/img/favicon.ico")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

expressNunjucks(app);

app.use("/", RouterFinder.findAll(path.join(__dirname, "routes")));

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = env === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

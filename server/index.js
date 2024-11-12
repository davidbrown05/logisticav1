require("dotenv").config();
const morgan = require("morgan")
const express = require("express");
const mongoose = require("mongoose");
const productRoute = require("./routes/productRoute");
const partnersRoute = require("./routes/partnersRoute");
const compradorRoute = require("./routes/compradorRoute");
const juridicoRoute = require("./routes/juridicoRoute");
const pagosRoute = require("./routes/pagosRoute");
const comisionesRoute = require("./routes/comisionesRoute");
const propertyDeudaRoute = require("./routes/propertyDeudaRoute");
const adeudosRoute = require("./routes/adeudosRoute");
const ventasRoute = require("./routes/ventasRoute");
const userRoute = require("./routes/usersRoute");
const authRouter = require("./routes/authRoute");
const permisosRouter = require("./routes/permisosRoute");
const reporteJuridicoRoute = require("./routes/reporteJuridicoRoute");
const atrasoJuridico = require("./routes/atrasoJuridicoRoute");
const juridicoNot = require("./routes/juridicoNotRoute");
const pagosNot = require("./routes/pagosNotRoute");
const recordatoriosRouter  = require("./routes/recordatoriosRoute")
const errorMiddleware = require("./middleware/errorMiddleware");
const cors = require("cors");
const MenuModel = require("./models/Property");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
const FRONTEND = process.env.FRONTEND;

var corsOptions = {
  origin: FRONTEND,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204,
  credentials: true,
};



app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"))

//routes

app.use("/api/products", productRoute);
app.use("/api/recordatorios", recordatoriosRouter);
app.use("/api/partners", partnersRoute);
app.use("/api/comprador", compradorRoute);
app.use("/api/juridicoData", juridicoRoute);
app.use("/api/pagosData", pagosRoute);
app.use("/api/comisionesData", comisionesRoute);
app.use("/api/propertyDeudaData", propertyDeudaRoute);
app.use("/api/adeudosData", adeudosRoute);
app.use("/api/ventasData", ventasRoute);
app.use("/api/permisosData", permisosRouter);
app.use("/api/usersData", userRoute);
app.use("/api/auth", authRouter);
app.use("/api/reportejuridico", reporteJuridicoRoute);

app.use("/api/juridiconot", juridicoNot);
app.use("/api/pagosnot", pagosNot);

app.get("/", (req, res) => {
  res.send("hello node api");
});

app.get("/blog", (req, res) => {
  res.send("hello blog, blink innovations");
});

app.use(errorMiddleware);

mongoose.set("strictQuery", false);
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`NODE API is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

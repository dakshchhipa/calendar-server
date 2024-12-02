const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const CompanyRoutes = require('./routes/companyRoutes');
const CommRoutes = require('./routes/communicationMethodRoutes');
const AuthRoutes = require('./routes/authRoutes');
const NotificationRoutes = require('./routes/notificationRoutes');
const CommunicationRoutes = require('./routes/communicationRoutes');
const dotenv = require('dotenv');
const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config({ path: "./server.env" });

app.use(express.json());
const DB = process.env.MONGO_URL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
      w: "majority",
      j: true,
      wtimeout: 1000,
    },
  })
  .then(() => {
    console.log("DB 1 CONNECTION SUCCESSFULL");
  });

app.use("/api/companies", CompanyRoutes);
app.use("/api/communications", CommRoutes);
app.use("/api/notifications", NotificationRoutes);
app.use("/api/communications-user", CommunicationRoutes);
app.use("/api", AuthRoutes);

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n\nServer running on http://localhost:${PORT}✅\n\n`);
});






//AUTHENTICATION



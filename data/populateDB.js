const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({ path: "../server.env" });
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
    console.log("DB 2 CONNECTION SUCCESSFUL");
  });

// Models
const Company = mongoose.model("Company", new mongoose.Schema({
  name: String,
  location: String,
  linkedIn: String,
  emails: [String],
  phoneNumbers: [String],
  comments: String,
  periodicity: String,
}));

const CommunicationMethod = mongoose.model("CommunicationMethod", new mongoose.Schema({
  name: String,
  description: String,
  sequence: Number,
  mandatory: Boolean
}));

// Communication Model
const Communication = mongoose.model("Communication", new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  type: { type: mongoose.Schema.Types.ObjectId, ref: "CommunicationMethod" },
  date: Date,
  notes: String,
}));

// Notification Model
const Notification = mongoose.model("Notification", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  communication: { type: mongoose.Schema.Types.ObjectId, ref: "Communication" },
  type: String, // 'overdue' or 'due today'
  message: String,
}));

// Seed Data
const seedData = async () => {
  await Company.deleteMany();
  await CommunicationMethod.deleteMany();
  await Communication.deleteMany();
  await Notification.deleteMany();

  // New companies
  const companies = [
    {
      name: "Vasu Technologies",
      location: "Delhi",
      linkedIn: "https://linkedin.com/company/vasutechnologies",
      emails: ["contact@vasutech.com"],
      phoneNumbers: ["+91 123 456 7890"],
      comments: "Leading tech company in India.",
      periodicity: "1 month",
    },
    {
      name: "Ansh Innovations",
      location: "Mumbai",
      linkedIn: "https://linkedin.com/company/anshinnovations",
      emails: ["info@anshinnovations.com"],
      phoneNumbers: ["+91 987 654 3210"],
      comments: "Innovative solutions for startups.",
      periodicity: "2 weeks",
    },
    {
      name: "Daksh Systems",
      location: "Bangalore",
      linkedIn: "https://linkedin.com/company/dakshsystems",
      emails: ["support@dakshsystems.com"],
      phoneNumbers: ["+91 999 888 7777"],
      comments: "Specializing in cloud-based solutions.",
      periodicity: "1 month",
    },
    {
      name: "Shahil Enterprises",
      location: "Chennai",
      linkedIn: "https://linkedin.com/company/shahilenterprises",
      emails: ["contact@shahilenterprises.com"],
      phoneNumbers: ["+91 777 666 5555"],
      comments: "Diversified business conglomerate.",
      periodicity: "3 weeks",
    },
    {
      name: "Tanya Technologies",
      location: "Hyderabad",
      linkedIn: "https://linkedin.com/company/tanyatechnologies",
      emails: ["info@tanyatech.com"],
      phoneNumbers: ["+91 111 222 3333"],
      comments: "Software and app development services.",
      periodicity: "2 weeks",
    },
    {
      name: "Janvi Solutions",
      location: "Kolkata",
      linkedIn: "https://linkedin.com/company/janvisolutions",
      emails: ["support@janvisolutions.com"],
      phoneNumbers: ["+91 444 555 6666"],
      comments: "Consulting and IT services.",
      periodicity: "1 month",
    },
  ];

  const createdCompanies = await Company.insertMany(companies);

  // New communication methods
  const communications = [
    { name: 'LinkedIn Post', description: 'Post on LinkedIn', sequence: 1, mandatory: true },
    { name: 'LinkedIn Message', description: 'Direct LinkedIn message', sequence: 2, mandatory: true },
    { name: 'Email', description: 'Send an email', sequence: 3, mandatory: true },
    { name: 'Phone Call', description: 'Make a phone call', sequence: 4, mandatory: false },
    { name: 'Other', description: 'Any other communication', sequence: 5, mandatory: false },
  ];

  const createdMethods = await CommunicationMethod.insertMany(communications);

  // Adding communications for companies
  const communicationEntries = [
    {
      company: createdCompanies[0]._id, // Vasu Technologies
      type: createdMethods[0]._id, // LinkedIn Post
      date: new Date('2024-12-02'),
      notes: "Introductory post on LinkedIn for Vasu Technologies."
    },
    {
      company: createdCompanies[0]._id, // Vasu Technologies
      type: createdMethods[2]._id, // Email
      date: new Date('2024-11-30'),
      notes: "Follow-up email sent to Vasu Technologies."
    },
    {
      company: createdCompanies[0]._id, // Vasu Technologies
      type: createdMethods[3]._id, // Phone Call
      date: new Date('2024-11-29'),
      notes: "Call to Vasu Technologies regarding partnership."
    },
    {
      company: createdCompanies[1]._id, // Ansh Innovations
      type: createdMethods[1]._id, // LinkedIn Message
      date: new Date('2024-11-28'),
      notes: "Message to Ansh Innovations on LinkedIn."
    },
    {
      company: createdCompanies[1]._id, // Ansh Innovations
      type: createdMethods[2]._id, // Email
      date: new Date('2024-12-01'),
      notes: "Follow-up email to Ansh Innovations."
    },
    {
      company: createdCompanies[1]._id, // Ansh Innovations
      type: createdMethods[0]._id, // LinkedIn Post
      date: new Date('2024-12-02'),
      notes: "LinkedIn Post to promote Ansh Innovations."
    },
    {
      company: createdCompanies[2]._id, // Daksh Systems
      type: createdMethods[3]._id, // Phone Call
      date: new Date('2024-12-03'),
      notes: "Phone call to Daksh Systems for a business discussion."
    },
    {
      company: createdCompanies[3]._id, // Shahil Enterprises
      type: createdMethods[0]._id, // LinkedIn Post
      date: new Date('2024-11-25'),
      notes: "Post for Shahil Enterprises' new product launch."
    },
    {
      company: createdCompanies[4]._id, // Tanya Technologies
      type: createdMethods[1]._id, // LinkedIn Message
      date: new Date('2024-11-22'),
      notes: "LinkedIn Message to Tanya Technologies for a potential partnership."
    },
    {
      company: createdCompanies[5]._id, // Janvi Solutions
      type: createdMethods[2]._id, // Email
      date: new Date('2024-11-19'),
      notes: "Email communication to Janvi Solutions about project updates."
    },
  ];

  await Communication.insertMany(communicationEntries);

  // Adding notifications for overdue or due communications
  const notifications = [
    {
      user: new mongoose.Types.ObjectId("6748460ea8ccd99f8fae3010"),  // Replace with actual user ID
      company: createdCompanies[0]._id, // Vasu Technologies
      communication: communicationEntries[0]._id, // LinkedIn Post
      type: 'overdue',
      message: 'Vasu Technologies LinkedIn Post communication is overdue.'
    },
    {
      user: new mongoose.Types.ObjectId("6748460ea8ccd99f8fae3010"),  // Replace with actual user ID
      company: createdCompanies[0]._id,
      communication: communicationEntries[1]._id, // Email
      type: 'due today',
      message: 'Email follow-up to Vasu Technologies is due today.'
    },
    {
      user: new mongoose.Types.ObjectId("6748460ea8ccd99f8fae3010"),  // Replace with actual user ID
      company: createdCompanies[0]._id,
      communication: communicationEntries[2]._id, // Phone Call
      type: 'due today',
      message: 'Phone call to Vasu Technologies is due today.'
    },
    {
      user: new mongoose.Types.ObjectId("67484f7b1ebb59a6291f394d"),  // Replace with actual user ID
      company: createdCompanies[1]._id, // Ansh Innovations
      communication: communicationEntries[1]._id, // LinkedIn Message
      type: 'due today',
      message: 'LinkedIn Message to Ansh Innovations is due today.'
    },
    {
      user: new mongoose.Types.ObjectId("67484f7b1ebb59a6291f394d"),  // Replace with actual user ID
      company: createdCompanies[1]._id, // Ansh Innovations
      communication: communicationEntries[2]._id, // Email
      type: 'overdue',
      message: 'Follow-up email to Ansh Innovations is overdue.'
    },
    {
      user: new mongoose.Types.ObjectId("67484f7b1ebb59a6291f394d"),  // Replace with actual user ID
      company: createdCompanies[3]._id, // Shahil Enterprises
      communication: communicationEntries[3]._id, // LinkedIn Post
      type: 'due today',
      message: 'Shahil Enterprises LinkedIn Post due today.'
    },
  ];

  await Notification.insertMany(notifications);

  console.log("\n\nSeed data added successfully!✅\n\n");
  mongoose.connection.close();
};

seedData();

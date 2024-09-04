var express = require("express");
var cors = require("cors");
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

var http = require("http").Server(app);

app.use(express.static(__dirname + "/www"));

let users = [
  {
    username: "super",
    email: "super@gmail.com",
    password: "123",
    id: 1,
    roles: ["Super Admin"],
    groups: [
      {
        id: 1,
        name: "Group 1",
        approved: true,
      },
      {
        id: 2,
        name: "Group 2",
        approved: true,
      },
      {
        id: 3,
        name: "Group 3",
        approved: true,
      },
    ],
  },
  {
    username: "test",
    email: "test@gmail.com",
    password: "test",
    id: 1,
    roles: ["User"],
    groups: [
      {
        id: 1,
        name: "Group 1",
        approved: true,
      },
    ],
  },
];

app.post("/api/auth", function (req, res) {
  console.log("Request body: ", req.body);
  const customer = users.find(
    (user) =>
      user.username === req.body.username && user.password === req.body.password
  );
  if (customer) {
    customer.valid = true;
    res.send(customer);
  } else {
    res.send({ valid: false });
  }
});

app.post("/api/register", function (req, res) {
  console.log("Request body: ", req.body);
  const isUsernameTaken = users.find(
    (user) => user.username === req.body.username
  );
  const isEmailTaken = users.find((user) => user.email === req.body.email);
  if (isUsernameTaken) {
    res.status(400).send({ valid: false, message: "Username already exists" });
  } else if (isEmailTaken) {
    res.status(400).send({ valid: false, message: "Email already exists" });
  } else if (
    users
      .find((user) => user.id === req.body.userId)
      .groups.find((group) => group.id === req.body.groupId)
  ) {
    res.status(400).send({
      valid: false,
      message: "User already in or requested that group",
    });
  } else {
    users.push({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      id: users.length + 1,
      roles: ["User"],
      groups: [],
    });
    res.status(200).send({ valid: true });
  }
});

app.post("/api/groups/requestAccess", function (req, res) {
  console.log("Request body: ", req.body);
  const user = users.find((user) => user.id === req.body.userId);
  if (user) {
    user.groups.push({
      id: req.body.groupId,
      name: req.body.groupName,
      approved: false,
    });
    res.status(200).send({ valid: true, user: user });
  } else {
    res.status(400).send({ valid: false });
  }
});

let server = http.listen(3000, function () {
  console.log("Running wk3 Server...");
  console.log("Server is listening on port " + server.address().port);
});

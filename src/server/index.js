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

const users = [
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
      },
      {
        id: 2,
        name: "Group 2",
      },
      {
        id: 3,
        name: "Group 3",
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

let server = http.listen(3000, function () {
  console.log("Running wk3 Server...");
  console.log("Server is listening on port " + server.address().port);
});

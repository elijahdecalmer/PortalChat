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
    reported: false,
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
    ],
  },
  {
    username: "test",
    email: "test@gmail.com",
    password: "test",
    id: 2,
    roles: ["User"],
    reported: false,
    groups: [
      {
        id: 1,
        name: "Group 1",
        approved: true,
      },
    ],
  },
];

let groups = [
  {
    id: 1,
    name: "Group 1",
    admin: "super",
    members: ["super", "test"],
    pendingRequests: [],
    bannedUsers: [],
    channels: [
      {
        name: "General",
        messages: [],
      },
    ],
  },
];

const findUserById = (userId) => users.find((user) => user.id === userId);
const findGroupById = (groupId) => groups.find((group) => group.id === groupId);
const isUserAdminOfGroup = (user, group) =>
  user.username === group.admin || user.roles.includes("Super Admin");

const sendSuccessResponse = (res, data = {}, message = "Success") => {
  res.status(200).send({ valid: true, message, data });
};

const sendErrorResponse = (res, message = "Error", statusCode = 400) => {
  res.status(statusCode).send({ valid: false, message });
};

// Authentication endpoint
app.post("/api/auth", (req, res) => {
  const customer = users.find(
    (user) =>
      user.username === req.body.username && user.password === req.body.password
  );
  if (customer) {
    sendSuccessResponse(res, customer, "Authenticated successfully");
  } else {
    sendErrorResponse(res, "Invalid username or password");
  }
});

// Register new user
app.post("/api/register", (req, res) => {
  const { username, email, userId, groupId } = req.body;
  if (users.find((user) => user.username === username)) {
    return sendErrorResponse(res, "Username already exists");
  }
  if (users.find((user) => user.email === email)) {
    return sendErrorResponse(res, "Email already exists");
  }
  const user = findUserById(userId);
  if (user && user.groups.find((group) => group.id === groupId)) {
    return sendErrorResponse(res, "User already in or requested that group");
  }
  users.push({
    username,
    email,
    password: req.body.password,
    id: users.length + 1,
    roles: ["User"],
    groups: [],
  });
  sendSuccessResponse(res, {}, "User registered successfully");
});

// Request group access
app.post("/api/groups/requestAccess", (req, res) => {
  const user = findUserById(req.body.userId);
  if (user) {
    user.groups.push({
      id: req.body.groupId,
      name: req.body.groupName,
      approved: false,
    });
    sendSuccessResponse(res, user, "Request for group access sent");
  } else {
    sendErrorResponse(res, "User not found");
  }
});

// Leave a group
app.post("/api/groups/leaveGroup", (req, res) => {
  const user = findUserById(req.body.userId);
  if (user) {
    user.groups = user.groups.filter((group) => group.id !== req.body.groupId);
    sendSuccessResponse(res, user, "Left the group successfully");
  } else {
    sendErrorResponse(res, "User not found");
  }
});

// Delete user account
app.post("/api/account/delete", (req, res) => {
  const userIndex = users.findIndex((user) => user.id === req.body.userId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    sendSuccessResponse(res, {}, "Account deleted successfully");
  } else {
    sendErrorResponse(res, "User not found");
  }
});

// Create a group
app.post("/api/groups/create", (req, res) => {
  const user = findUserById(req.body.userId);
  if (
    user &&
    (user.roles.includes("Super Admin") || user.roles.includes("Group Admin"))
  ) {
    const newGroup = {
      id: groups.length + 1,
      name: req.body.groupName,
      admin: user.username,
      members: [user.username],
      pendingRequests: [],
      bannedUsers: [],
      channels: [],
    };
    groups.push(newGroup);
    sendSuccessResponse(res, newGroup, "Group created successfully");
  } else {
    sendErrorResponse(res, "Unauthorized to create group", 403);
  }
});

// Request upgrade to Group Admin
app.post("/api/groups/requestUpgrade", (req, res) => {
  const user = findUserById(req.body.userId);
  if (user) {
    if (user.roles.includes("Group Admin")) {
      sendErrorResponse(res, "Already a Group Admin");
    } else {
      user.roles.push("Group Admin Request");
      sendSuccessResponse(res, {}, "Upgrade request sent");
    }
  } else {
    sendErrorResponse(res, "User not found");
  }
});

// Add a channel to a group
app.post("/api/groups/:groupId/addChannel", (req, res) => {
  const user = findUserById(req.body.userId);
  const group = findGroupById(parseInt(req.params.groupId, 10));

  if (user && group && isUserAdminOfGroup(user, group)) {
    const newChannel = {
      name: req.body.channelName,
      messages: [],
    };
    group.channels.push(newChannel);
    sendSuccessResponse(res, group, "Channel added successfully");
  } else {
    sendErrorResponse(res, "Unauthorized to add channel", 403);
  }
});

// Ban a user from a specific channel and report them
app.post("/api/groups/:groupId/banUser", (req, res) => {
  const groupId = parseInt(req.params.groupId, 10);
  const userId = req.body.userId;
  const targetUsername = req.body.targetUsername;
  const channelId = req.body.channelId;

  const user = findUserById(userId);
  const group = findGroupById(groupId);
  const targetUser = users.find((u) => u.username === targetUsername);

  if (user && group && isUserAdminOfGroup(user, group) && targetUser) {
    const channel = group.channels.find((ch) => ch.id === channelId);
    if (!channel) {
      return sendErrorResponse(res, "Channel not found");
    }

    if (!group.bannedUsers.includes(targetUsername)) {
      group.bannedUsers.push(targetUsername);
      channel.bannedUsers = channel.bannedUsers || [];
      channel.bannedUsers.push(targetUsername);
      targetUser.reported = true;

      sendSuccessResponse(
        res,
        group,
        `User ${targetUsername} banned from channel ${channelId} and reported successfully`
      );
    } else {
      sendErrorResponse(res, "User already banned");
    }
  } else {
    sendErrorResponse(res, "Unauthorized to ban user or user not found", 403);
  }
});

// Existing imports and setup code

// List all users (for Super Admins)
app.get("/api/users", (req, res) => {
  sendSuccessResponse(res, users, "List of all users");
});

app.get("/api/groups", (req, res) => {
  sendSuccessResponse(res, groups, "List of all groups");
});

// Promote a user to Group Admin
app.post("/api/users/:userId/promoteToGroupAdmin", (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const user = findUserById(userId);

  if (user) {
    if (!user.roles.includes("Group Admin")) {
      user.roles.push("Group Admin");
      sendSuccessResponse(res, {}, "User promoted to Group Admin");
    } else {
      sendErrorResponse(res, "User is already a Group Admin");
    }
  } else {
    sendErrorResponse(res, "User not found");
  }
});

// Get user by ID
app.post("/api/user", (req, res) => {
  const userId = req.body.userId;
  console.log("userId", userId);
  const user = findUserById(userId);

  if (user) {
    sendSuccessResponse(res, user, "User data retrieved successfully");
  } else {
    sendErrorResponse(res, "User not found");
  }
});

// Promote a user to Super Admin
app.post("/api/users/:userId/promoteToSuperAdmin", (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const user = findUserById(userId);

  if (user) {
    if (!user.roles.includes("Super Admin")) {
      user.roles.push("Super Admin");
      sendSuccessResponse(res, {}, "User promoted to Super Admin");
    } else {
      sendErrorResponse(res, "User is already a Super Admin");
    }
  } else {
    sendErrorResponse(res, "User not found");
  }
});

// Remove a user from a group
app.post("/api/groups/:groupId/removeUser", (req, res) => {
  const groupId = parseInt(req.params.groupId, 10);
  const userId = req.body.userId;

  const group = findGroupById(groupId);
  const user = findUserById(userId);

  if (group && user) {
    group.members = group.members.filter((member) => member !== user.username);
    sendSuccessResponse(res, group, `User removed from ${group.name}`);
  } else {
    sendErrorResponse(res, "Group or User not found");
  }
});

// Existing banUser endpoint with adjustments
app.post("/api/groups/:groupId/banUser", (req, res) => {
  const groupId = parseInt(req.params.groupId, 10);
  const userId = req.body.userId;
  const targetUsername = req.body.targetUsername;

  const user = findUserById(userId);
  const group = findGroupById(groupId);
  const targetUser = users.find((u) => u.username === targetUsername);

  if (user && group && isUserAdminOfGroup(user, group) && targetUser) {
    if (!group.bannedUsers.includes(targetUsername)) {
      group.bannedUsers.push(targetUsername);
      targetUser.reported = true;
      sendSuccessResponse(
        res,
        group,
        `User ${targetUsername} banned and reported`
      );
    } else {
      sendErrorResponse(res, "User already banned");
    }
  } else {
    sendErrorResponse(res, "Unauthorized or user not found", 403);
  }
});

// Start the server
let server = http.listen(3000, function () {
  console.log("Running wk3 Server...");
  console.log("Server is listening on port " + server.address().port);
});

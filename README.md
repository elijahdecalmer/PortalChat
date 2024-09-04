Chat Application with Group and Channel Management
Overview
This project implements a chat application where users can create and join groups, manage channels, and exchange messages in real time. The solution is built using Angular for the frontend and Node.js/Express for the backend.

Git Repository Organization
Branchign was only used in the end stage to ensure that main would not be broken at submission point. If there were more than one developer, branches would be used constantly.

Data Structures
Server-side Data Structures
User:

username: string
email: string
password: string
id: number
roles: string[]
reported: boolean
groups: array of objects with id (number), name (string), and approved (boolean)
Group:

id: number
name: string
admin: string (username of the admin)
members: string[] (array of usernames)
pendingRequests: array of User objects
bannedUsers: string[] (usernames of banned users)
channels: array of channel objects
Channel:

name: string
messages: array of objects with from (string), message (string), and timestamp (string)
Client-side Data Structures (Angular)
User:

username: string
email: string
groups: array of group objects
id: number
roles: string[]
reported: boolean
Group:

id: number
name: string
admin: string
members: array of User objects
pendingRequests: array of User objects
channels: array of channel objects
Channel:

name: string
messages: array of message objects
Message:

text: string
timestamp: string
incoming: boolean
showTimestamp: boolean
Angular Architecture
Components:

app.component.ts
Purpose: The root component of the application. It serves as the base for the entire application, rendering the main layout and containing router outlets for navigating between different views.
Template: app.component.html is the main container for all the dynamic content, where the router outlet injects other components as the user navigates.
Styles: app.component.css provides global styles for the layout.
browse-groups.component.ts
Purpose: Handles the display of all available groups that a user can browse, request access to, or create if they have the appropriate permissions.
Key Features:
Displays the list of available groups.
Allows users to request access to groups.
Provides functionality for Group Admin and Super Admin to create new groups.
The component interacts with the AuthService to fetch groups and manage access.
Template: browse-groups.component.html contains the layout for group browsing, displaying the group name, user count, and action buttons for requesting access or creating a new group.
home.component.ts
Purpose: Serves as the landing page for the application after login. Provides a brief overview and links to other parts of the app like group browsing, user management, etc.
Template: home.component.html defines the main layout for the home screen, which could include navigation links and introductory content.
login.component.ts
Purpose: Manages the user authentication (login) process.
Key Features:
Accepts username and password inputs.
Authenticates the user using the AuthService.
On successful login, navigates to the home page or the last visited page.
Template: login.component.html provides the user interface for logging in, including input fields and login buttons.
manage-users.component.ts
Purpose: Provides functionality for managing users within groups, such as promoting them to group admin, approving access requests, and removing users from groups.
Key Features:
Displays a list of all users (for Super Admin).
Allows actions like promoting users, removing users from groups, banning users, and approving pending requests.
Interacts with the AuthService to execute these actions.
Template: manage-users.component.html contains the layout for managing users, including lists of users, action buttons for each user, and group-related management features.
register.component.ts
Purpose: Handles user registration for the application.
Key Features:
Accepts new user details such as username, email, and password.
Sends registration requests to the server via the AuthService.
Displays error messages if registration fails (e.g., username already exists).
Template: register.component.html contains the form for user registration.
view-channel.component.ts
Purpose: Displays a specific channel within a group and manages the exchange of messages in real time.
Key Features:
Shows a list of all messages within the channel.
Allows users to send new messages.
Timestamps and message direction (incoming/outgoing) are displayed for each message.
Interacts with the AuthService to send and receive messages.
Template: view-channel.component.html defines the layout for the message list, the message input field, and the send button.
view-group.component.ts
Purpose: Displays details about a specific group, including its channels and members.
Key Features:
Lists all channels within the group.
Allows navigation to individual channels.
Displays group information, such as the admin and members.
Provides actions like leaving the group or managing channels (for Group Admin or Super Admin).
Template: view-group.component.html contains the layout for displaying group details, including a list of channels and a list of members.

Services:

AuthService: Handles user authentication, group access, messaging, and general API communication.
Routes:

/browsegroups: Displays available groups.
/viewgroup/:groupid: Displays group details, including channels.
/viewchannel/:groupid/:channelid: Displays messages and allows message exchange in a channel.
Node Server Architecture
Modules: Express.js is used for the HTTP server and routing. CORS is used for handling cross-origin requests.

Global Variables:

users: Stores user data.
groups: Stores group and channel data.
Functions:

findUserById(userId): Finds a user by their id.
findGroupById(groupId): Finds a group by its id.
isUserAdminOfGroup(user, group): Checks if a user is the admin of a group.
Files:

server.js: Contains all the server logic, including routes for authentication, messaging, and group management.
List of Server-side Routes
POST /api/auth: Authenticates a user.

Parameters: username, password
Returns: User object upon successful login.
POST /api/groups/create: Creates a new group.

Parameters: userId, groupName
Returns: Newly created group.
POST /api/groups/:groupId/approveUser: Approves a user to join a group.

Parameters: groupId, userId
Returns: Updated group with the user added.
POST /api/groups/:groupId/channels/:channelId/message: Sends a message in a channel.

Parameters: groupId, channelId, userId, message
Returns: Sent message.
Interaction Between Client and Server
Authentication:

The user logs in via the /api/auth endpoint. The authenticated user is stored in session storage on the client side.
Group Management:

Users with Super Admin or Group Admin roles can create groups via the /api/groups/create endpoint. This request is initiated from the BrowseGroupsComponent on the frontend.
Messaging:

Messages sent via the ViewChannelComponent are transmitted to the server using the /api/groups/:groupId/channels/:channelId/message endpoint. Upon successful message delivery, the UI is updated by adding the message to the message list in real time.
Angular Component Display Updates
After Group Creation: The BrowseGroupsComponent will call the getGroups() method from AuthService, which fetches the updated list of groups from the server.

After Sending a Message: In ViewChannelComponent, after sending a message, the message array is updated locally, and the new message is displayed immediately in the UI.

**Text/Video Chat System**

This project is a real-time text and video chat application built using the MEAN stack (MongoDB, Express, Angular, Node.js) along with Socket.io and Peer.js. The application supports different levels of user permissions, including Super Admin, Group Admin, and regular Users. It facilitates communication within groups and channels.

**Project Description**

The chat system allows users to:

Communicate in Real-Time: Users can send and receive messages instantly within designated groups and channels.
Video Chat: Users can initiate video calls with others in the same group or channel using Peer.js.
Manage Groups and Channels: Group Admins and Super Admins can create, manage, and delete groups and channels.
User Roles and Permissions: The system supports three levels of roles:
Super Admin: Has complete control over all users, groups, and channels.
Group Admin: Can manage the groups they create, including adding/removing users and creating channels.
User: Can join groups, participate in chats, and use video chat features.
UI Overview

**Login Page**
Description: The entry point for users. Users need to log in using their username and password to access the chat system.
Features: Authentication and role-based access control. A default user ('super' with password '123') is provided initially.
**Dashboard Page**
Description: Displays an overview of all the groups and channels that a user is a part of.
Features: Allows navigation to specific groups and channels. Displays different options based on user roles (e.g., group creation for admins).
**Group Management Page**
Description: Available to Group Admins and Super Admins. Provides interfaces for creating, editing, and deleting groups.
Features: Lists all groups the admin has created or is managing. Allows for group-related actions like adding/removing users.
**Channel Management Page**
Description: Similar to the group management page but focused on channels within a specific group.
Features: Create, rename, or delete channels. Manage which users have access to specific channels.
**Chat Page**
Description: The main area where users can participate in text or video chat.
Features: Real-time messaging with other users in the same channel, view chat history, send images or videos, initiate video calls.
**User Management Page**
Description: For Super Admins to manage all users of the system.
Features: View user profiles, promote users to admin roles, or delete users from the system.

**Usage**

This chat system can be used for:

Team Collaboration: Organizations can use this system for internal team communications, allowing team members to create groups and channels for different projects or departments.
Community Building: Community managers can set up various interest-based groups and channels for members to interact.
Educational Purposes: Teachers and students can use it for classroom discussions, group projects, and direct communication.
How to Access

Login: Users must log in with their credentials. The default Super Admin account (super, password 123) can be used initially.
Navigate: Users can navigate through the dashboard to access their groups and channels.
Chat: Users can enter a chat room within a channel to start sending text messages or initiate a video chat.

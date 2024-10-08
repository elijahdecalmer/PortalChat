# Welcome to Portal Chat

Portal Chat allows users to be a part of groups (and the channels within those groups).

Within a channel, users can chat over text, send videos, photos, and even audio clips like mp3s.

By clicking the **Video Chat** toggle in the top right of a channel, you can start a video chat with up to one other person in the channel.



To RUN:

clone repo
npm install
ng serve -o


## Structure of Client Side - Angular

The client side is written entirely in Angular, with standalone modules. It is organized with services and components to ensure modularity and ease of maintenance.

The application uses **Tailwind CSS** for styling to facilitate rapid development and maintain a clean, consistent codebase.

### Project Folder Structure

Below is an overview of the key components of the application, organized by feature and functionality:

- **browse-groups**: Contains components for browsing and discovering groups.
- **home**: Handles the home page of the application.
- **login**: Manages user authentication and login functionality.
- **manage-groups**: Includes components for creating and managing groups.
- **manage-users**: Handles user management operations, such as viewing and editing user profiles.
- **pipes**: Contains custom pipes used throughout the application.
- **register**: Manages user registration functionality.
- **services**: Includes all the Angular services for handling data and business logic.
- **view-channel**: Displays channel-specific content and chat interfaces.
- **view-group**: Displays group details and member information.

### Services Overview

The application includes four primary services, each corresponding to a major data structure and functionality grouping. These services are tightly integrated with the REST API, handling data operations and communication with the backend.

| Service Name        | Purpose                                                                                      |
|---------------------|----------------------------------------------------------------------------------------------|
| Admin Service       | Handles all admin-related operations like promoting users to admin roles, deleting users, and managing group memberships. It also allows the reporting of users to super admins. |
| Auth Service        | Manages user authentication, including registration, login, session management, and logout. It also handles account deletion and session validation.                              |
| Channel Service     | Facilitates operations related to channels within groups, such as creating channels, managing users, uploading files, and retrieving channel details.                            |
| Group Service       | Manages group-related functionalities like creating groups, handling membership requests, managing user access, and retrieving group details.                                   |

### Detailed Breakdown of Services

#### Admin Service

The Admin Service handles all admin-related actions for the application:

- Promoting users to group or super admin roles.
- Deleting users.
- Reporting users to super admins.
- Retrieving groups administered by the logged-in user.
- Managing users' roles within groups.

#### Auth Service

The Auth Service is responsible for authentication and session management:

- **Register:** Handles the registration of new users.
- **Login:** Authenticates users and manages their session.
- **Refetch User:** Fetches the latest user data to keep the session updated.
- **Logout:** Clears the user session and navigates to the login page.
- **Delete Account:** Deletes the user account and ends the session.
- **Session Management:** Uses `BehaviorSubject` to manage the user session state across the application.

#### Channel Service

The Channel Service handles channel operations within groups:

- **Create Channel:** Allows creating new channels within a specified group.
- **Delete Channel:** Deletes a specified channel from a group.
- **Ban User:** Bans a user from a specific channel.
- **Upload Files:** Handles file uploads within channels.
- **Get Channel Details:** Retrieves detailed information about a specific channel.

#### Group Service

The Group Service manages group-related functionalities:

- **Get All Groups:** Retrieves all groups available to the user.
- **Create Group:** Allows users to create new groups with specified details.
- **Manage Membership:** Handles user requests to join groups, approves or rejects members, and manages the removal of users from groups.
- **Ban User from Channel:** Manages banning of users from channels within groups.
- **Leave Group:** Enables users to leave a group.
- **Get Group Details:** Provides detailed information about a specified group.

### Conclusion

The Angular client side is structured to communicate seamlessly with the backend REST API through these services. Each service is focused on a specific aspect of the application's functionality, ensuring that the codebase remains modular, organized, and easy to maintain. The use of **Tailwind CSS** enhances development speed and code readability, keeping the design clean and responsive.

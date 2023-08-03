# Any.do Clone Server

## Introduction

Welcome to the Any.do Clone Server repository! This project is part of my effort to build a task management desktop application similar to [Any.do](https://www.any.do/). The server is built using Typescript, Express.js and utilizes the Sequelize ORM to interact with the PostgreSQL database.

## Features

- User Authentication: Users can sign up, log in, and log out. User authentication is implemented using JWT (JSON Web Tokens).
- Task Management: Users can create, update, and delete tasks. Tasks can have titles, notes, reminder times, and status (e.g., "in progress" or "completed").
- Task Archiving: Users can archive tasks to soft delete them from the main list but keep them accessible in the archive.
- Tagging: Users can tag tasks with different tags, allowing for easy categorization and organization.
- Subtasks: Users can create subtasks for each task to further break down complex tasks into smaller steps.
- Task Filtering and Sorting: Users can filter and sort tasks based on various criteria, such as status, tags, and creation date.
- Pagination: To handle large numbers of tasks, pagination is implemented to fetch tasks in manageable chunks.
- Soft and Force Deletion: Tasks can be soft-deleted (archived) or force-deleted (permanently removed) based on user preferences.

## Additional Features (Maybe I Will Add In The Future 😅)
- Tasks can be added to specific lists, allowing users to organize their tasks efficiently.
- Users can update and delete lists, and tasks associated with a list can be managed accordingly.
- Users can create workspaces and invite other users to collaborate on tasks within those workspaces.
- Workspaces serve as containers for task management systems shared among team members.
- Tasks can be assigned to specific users within a workspace, allowing for task distribution and accountability.
- Users will receive notifications for task deadlines, reminders, and task assignments within the workspace.

## Technologies Used

- Typescript
- Express.js
- Sequelize ORM
- PostgreSQL (SQL Database)
- JWT (JSON Web Tokens) for User Authentication
- Class-validator

## FAQ

### Why have the additional features not been completed?

The decision to leave some additional features incomplete was intentional. The main purpose of this project was to practice working with SQL databases and Sequelize ORM. While the basic features of the Any.do Clone Server was implemented successfully, the additional features were left for future development. As I continue to learn and grow as a developer, I may revisit this project and add the remaining features at a later time. Now, I learned NestJs. So, I Decided To Practice On it.


# Welcome to ProjectHub! 

This lightweight and intuitive app is designed to help you manage your projects, ToDo lists, and notes efficiently, all while keeping your data private and stored locally on your device.

With a focus on simplicity and organization, the app allows you to create a hierarchical structure for your projects, track tasks with checkboxes, and maintain detailed notes for each project. The application includes role-based user management, a customizable light/dark mode interface, and robust tools for searching, editing, and organizing your data—all without relying on cloud storage.

Whether you're managing personal tasks or team-based projects, ProjectHub is built to provide a seamless, secure, and user-friendly experience. Get started today and bring structure to your workflow!


# Interface
![Screenshot from 2024-11-13 21-53-10](https://github.com/user-attachments/assets/e6786b0b-9f06-4a9f-9256-82a6df10f313)


# ProjectHub
The start of a basic application for managing notes and todo lists for projects. 

# Install
1.) npm install
2.) npm run dev

# Features
- [x] MVP
- [x] Add Tasks / Delete Task / Mark Task As Complete
- [x] Add Note / Delete Note
- [x] Add Project
- [x] Delete Project
- [x] Rename Project
- [x] Edit Note
- [x] Edit Task
- [x] Markdown Editor
- [x] Login
- [x] Settings as part of the admin page
- [x] Admin Page
- [x] Dark Mode
- [x] Registration Page
- [x] User management
- [ ] Mobile friendly
- [x] Directory setting for data storage
- [x] Directory browser for data storage
- [ ] Stop using the browsers local storage API and switch to actual local 
- [x] project sharing with other users
- [ ] support for project hierarchy (left menu display)
- [ ] add creation date/time stamp to notes and tasks
- [ ] dashboard sort tasks by completed and data

# Storage Settings

The storage directory is:

- Optional - Projects can exist without a storage directory
- Configurable per project through the Admin Panel
- Initially empty until set by an admin user

To set a storage directory for a project:

1. Log in as an admin user
2. Go to the Admin Panel
3. Find the project you want to configure
4. Click the folder icon next to the project
5. Use the directory browser to select a path
6. Click "Select This Directory" to save

# Financy

Links:
- https://project-financy.onrender.com
- https://project-api-financy.onrender.com

Short project description:
Our project is a personal CRM to manage finance recruiting / networking. We want you to see what firms you’ve networked with, see your notes from your networking calls, and track and manage resume versions and cover letters for each firm. We will solve the need of having somewhere to store notes on a person/thing with an integrate calendar (put future dates) and email templating.


## Architecture
TODO:  descriptions of code organization and tools and libraries used

Tools:
1) React
2) ReactDOM and React-router-dom
3) Axios
4) Zustand
5) Tailwind
6) AWS S3
7) ReactToastify

Folders: src, src/components, src/store, src/views
Main files: 
1) starter pack files
2) README.md
3) .gitignore
4) index.html

src files:
1) index.jsx
2) style.scss

src/components:
1) Auth/ = setting up user authentication
2) contactComponents/ = all components needed for individual and company contacts
    - Includes create..., contactsBy..., infoBars, and more
3) emailComponents/ = templates, email formatting, and more
4) app.jsx = runs everything
5) Dashboard components to set up dashboard
6) All others are multi use components (back button, navBar, etc.)

src/store:
1) index.js - access to all slices
2) contactSlice.js - all information on each individual
3) companySlice.js - all information on each company
4) emailSlice - all information on each email template
5) taskSlice - all information on each calendar event
6) authSlice - all information on each user
7) s3.js = for storing large images (headshots)

src/views:
1) Dashboard Page - Shows applications, tasks, reminders, suggested outreach
2) Contacts Page - List of all firms and contacts
3) Email Page - templates to send emails from
4) Calendar Page - Attached to your Google Calendar
5) Calls Page - List of all previous calls
6) Landing Page - Page seen when first entering website

## Setup
TODO: how to get the project dev environment up and running, npm install etc
1) Use npm install
2) npm run build
Can also do npm run dev locally

## Deployment
In Render

## Authors

Authors: Nate A., Jacob F., Ansh M., and Mitchelle N.

## Acknowledgments
External Sources: ChatGPT, Cursor, CS52 TAs, Brunch Lab

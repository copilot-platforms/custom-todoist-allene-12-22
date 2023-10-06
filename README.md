ToDoist App

Setup:
1. run npm install
2. touch .env
3. in .env: 
    add PORTAL_API_KEY set to Copilot API key 
    add TODO_API_KEY set to Todoist API key
    add COPILOT_CLIENT_ID set to Copilot production test client ID
4. in the Todoist web app, create a *project* with the exact full name of the test client
5. run 'npx next dev' and visit localhost:3000

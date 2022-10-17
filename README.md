API Workflow:

Portal
-GET client by query param

Airtable 
# figure out how to get base from web app dynamically

# get view from metadata?

-POST Portal ClientId to AT School Owner Table from web app
    -this will be linked to students table to avoid additional calls
    -(look into adding all to airtable via automation and having added outside of web app for new clients)

-GET List Records Students Table filtered by:
    -WHERE Students.School Owner Portal ID field === Portal ClientId exact match)


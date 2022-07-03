# BookingSys

1. Go to apps/backend-api and run "npm install" 
2. Go to apps/client-admin and run "npm install" 
3. Go to apps/client-form and run "npm install" 
4. Install Docker.
5. Run "docker-compose up" to setup the containers. It will take awhile for the setup and installing the packages.

backend-api - uses nestjs and mysql. 
http://localhost:8000 

client-admin - uses reactjs 
http://localhost:5000 - Edit / Delete Bookings. 
http://localhost:5000/login - login to view bookings. 
http://localhost:5000/register - to create admin 

client-form - uses nestjs 
http://localhost:4000 - For Public to make bookings.

Current Booking Rules,
1. Each session are 1 hour, Meaning there's 9 sessions max in a day.
2. Currently there's only one session per hour, maybe we can more in future.
3. Booking can be made 2 business day in advance, and not more than 3 weeks.
4. Only weekdays (Monday - Friday).

Can be implemented in future.
1. Adding email notifications.
2. Emails with options to add to calendar, modify booking links.
3. Manually block out some dates/hours ( Public Holidays)
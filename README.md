# Start Page Reddit Version

My interactive background startpage minus the personal information and API keys.
Please note this is a work in progress and so the page contains certain bugs. 

## API information

This startpage uses three APIs. The IP API is free and doesn’t require a specific key. the two remaining APIs are:
 - Google Maps Embed API:
   https://developers.google.com/maps/documentation/embed/get-api-key
   (used on script.js line: 77 & 79. replace 'INSERT_API_KEY_HERE' with the API Key)
 
 - Open Weather Map API:
   https://openweathermap.org/price
   Subscribe to the free tier API which includes the ;5day / 3hour' forecast needed for the weather app.
   (used on script.js line: 95. replace 'INSERT_API_KEY_HERE' with the API Key)
   
## Features:

* Time and Date
* Google Maps integration as interactive background with custom css colouring
* multi-engine search bar with switchable icons
* GUI box's containing further Features (do not have the map in focus or any text-boxes! | press 'esc' to close box)
  - Settings Page: press 's' 
  - Uni Links: press 'u'
  - localStorage Todo list: press 't'
  - 5-day weather forcast: press 'w'
* IP api, collecting lat and long coordinates for map position and weather.

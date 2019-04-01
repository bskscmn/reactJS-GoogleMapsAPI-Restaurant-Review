This front-end project is a simple service that offers reviews of restaurants around you.

[Demo ](http://www.basaksecmen.com/projects/p7/build/)

[GitHub repository of the project](https://github.com/bskscmn/reactJS-GoogleMapsAPI-Restaurant-Review)

## Features

- A Google Maps map loaded with the Google Maps API 
- Map focusses immediately on the position of the user with the help of JavaScript geolocation API
- A list of restaurants on the right side of the page that are within the area displayed on the map
- A list of restaurants is provided as JSON data in a separate file. (Normally, this data would be returned to the backend of the application by an API)
- Add a review about an existing restaurant
- Add a restaurant by right-clicking on a specific place on the map


## Folder Structure

```
  .gitignore
  README.md
  package.json
  yarn.lock
  node_modules/
  public/
    index.html
    favicon.ico
    manifest.json
  src/
    components/
      CommentForm.js
      Filters.js
      GooglePlaces.js
      Header.js
      Map.js
      NewVenueForm.js
      PlaceDetails.js
      Places.js
    css/
      App.css		
      index.css
    images/
      hover-icon-restaurant.png
      icon-restaurant.png
      icon-restaurant.psd
      logo.png
      restoico.png
      you-are-here.png
    App.js
    App.test.js
    index.js
    myplaces.json
    registerServiceWorker.js
    README.md
```

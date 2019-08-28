/*
  Author: Sean Carroll
*/

var textInputs = [];

makeLocalStorage();

window.onload = function() {
  clockChange();
  dateChange();
  getIP();

  //localStorage.setItem('todos', '');
  getTodos();
  displayTodo();


  if(themeOP == 'true'){
    $('#changeTheme').bootstrapToggle('on');
  }else{
    $('#changeTheme').bootstrapToggle('off');
  }

  textInputs.push(document.getElementById('todo-text'));
  textInputs.push(document.getElementById('sBAR'));

  applySearch();
  changeLogo();
}

var themeOP = localStorage.getItem('darkTheme');
var searchEngine = localStorage.getItem('searchEngine');

function makeLocalStorage(){
  if(localStorage.getItem('searchEngine') == null){
    localStorage.setItem('searchEngine', 1);
  }
  if(localStorage.getItem('todos') == null){
    localStorage.setItem('todos', '');
  }
  if(localStorage.getItem('darkTheme') == null){
    console.log("reached statement");
    localStorage.setItem('darkTheme', true);
  }
}

/* IP */

var ip;
var lat;
var long;
var country;

function getIP(){
  $.getJSON('https://ipapi.co/json', function(data) {
    ip = data.ip;
    lat = data.latitude;
    long = data.longitude;
    country = data.country;
    console.log("lat = " + lat + "!! long = " + long);
    changeMap();
  });
  //https://ipapi.co/api/
}

//changes the map position

/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  Get Google Embeded map Api for free from: https://developers.google.com/maps/documentation/embed/get-api-key
*/


function changeMap(){
  var map = document.getElementById('map');
  if(country == 'GB' || country == 'undefined'){
    map.setAttribute("src", "https://www.google.com/maps/embed/v1/view?key=INSERT_API_KEY_HERE&center=54.296007,-4.069787&zoom=6&maptype=roadmap");
  }else{
    map.setAttribute("src", "https://www.google.com/maps/embed/v1/view?key=INSERT_API_KEY_HERE&center=" + lat + "," + long + "&zoom=6&maptype=roadmap");
  }
  console.log("reached");
  //getWeather();

  console.log(get12(10));
}

/* WEATHER */

/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  Get openWeathermap api from here: https://openweathermap.org/price
*/

function getWeather(){
  console.log("accessed");
  $.getJSON("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=metric&APPID=INSERT_API_KEY_HERE", function(data) {
    //console.log(JSON.stringify(data));
    var dataArray = data.list;

    dayArray = splitDays(dataArray);
    console.log(dayArray);

    //gets all boxs for displaying purpose
    var displayBox = document.getElementsByClassName('weatherBox');

    //new date object for dynamic text input
    var currentDate = new Date();

    for(var i = 0; i < displayBox.length; i++){
      //gets the day array of information
      var day = dayArray[i];
      //gets the objects of the displayBox
      var objects = displayBox[i].children;
      console.log(objects);

      //new date which increase by 1 everytime
      textDate = new Date();
      textDate.setDate(currentDate.getDate() + i);

      //changes the day name and date
      objects[0].children[0].children[0].textContent = textDate.toUTCString().substr(0,3);
      objects[0].children[0].children[1].textContent = suffix(textDate.getDate());

      //if its the first result then give the closest temp else give the average temp of that day
      //same goes for the font awesome picture and the description
      if(i == 0){
        objects[0].children[1].children[0].children[0].textContent = day[0].main.temp;
        objects[0].children[2].children[0].setAttribute("class", getIcon(day[0].weather[0].main));
        objects[0].children[2].children[1].textContent = day[0].weather[0].description;
      }else{
        var mainValue = getWDescription(day);
        objects[0].children[1].children[0].children[0].textContent = averageTemp(day);
        objects[0].children[2].children[0].setAttribute("class", getIcon(mainValue));
        objects[0].children[2].children[1].textContent = getWBigDescription(mainValue, day);
      }

      var code = "";
      for(var x = 0; x < day.length; x++){

        var time = new Date(day[x].dt_txt);
        var hours = get12(time.getHours());
          //\
        if(x % 2 == 0){
          var baseCode = "<div class=\"wDetail1\"><h5>" + hours + "</h5><h5><span>" + day[x].main.temp + "</span>&#8451;</h5><h5>" + day[x].weather[0].description + "</h5></div>";
        }else{
          var baseCode = "<div class=\"wDetail2\"><h5>" + hours + "</h5><h5><span>" + day[x].main.temp + "</span>&#8451;</h5><h5>" + day[x].weather[0].description + "</h5></div>";
        }
        code = code + baseCode;
      }

      objects[1].innerHTML = code;
    }

  });
}

//aplits list of days into specific days from current day to 5 days in advance
function splitDays(dataArray){
  var dates = [];
  var testInput = dataArray[0].dt_txt;
  var currentDate = new Date(testInput.substr(0,10));

  //generates current date plus 4 more days in an array as the 5 day forecast
  for(var a = 0; a < 6; a++){
    var d = new Date();
    d.setDate(currentDate.getDate() + a);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    dates.push(d);
  }

  var dayArray = [[],[],[],[],[]];

  //splits each list item into its specific day
  //note, 12AM is included in the previous day and not in the current day no easy workaround found
  for(var b = 0; b < dataArray.length; b++){
    var inputDate = new Date(dataArray[b].dt_txt);
    inputDate.setHours(inputDate.getHours() - 1);

    if(inputDate.getTime() >= dates[0].getTime() && inputDate.getTime() < dates[1].getTime()){
      dayArray[0].push(dataArray[b]);
    }

    if(inputDate >= dates[1] && inputDate < dates[2]){
      dayArray[1].push(dataArray[b]);
    }

    if(inputDate >= dates[2] && inputDate < dates[3]){
      dayArray[2].push(dataArray[b]);
    }

    if(inputDate >= dates[3] && inputDate < dates[4]){
      dayArray[3].push(dataArray[b]);
    }

    if(inputDate >= dates[4] && inputDate < dates[5]){
      dayArray[4].push(dataArray[b]);
    }
  }
  return dayArray;
}


//gathers all temp information and averages a score
function averageTemp(certainDay){
  var averageTemp = 0;
  for(var i = 0; i < certainDay.length; i++){
    averageTemp += certainDay[i].main.temp;
  }
  averageTemp = ((averageTemp / certainDay.length).toFixed(2));
  return averageTemp;
}

function getWDescription(certainDay){
  //list of possibles: Snow, Thunderstorm, Rain, Drizzle, Clear, Clouds, Clear, Fog, Mist,
  var possible = [0,0,0,0,0,0,0,0];

  //my order of what i want to see if theres a duplicating number
  var text = ["Snow", "Thunderstorm", "Rain", "Drizzle", "Clear", "Clouds", "Fog", "Mist"];
  for(var i = 0; i < certainDay.length; i++){
    var inputMain = certainDay[i].weather[0].main;

    if(inputMain == "Snow"){
      possible[0]++;
    }else if(inputMain == "Thunderstorm"){
      possible[1]++;
    }
    else if(inputMain == "Rain"){
      possible[2]++;
    }
    else if(inputMain == "Drizzle"){
      possible[3]++;
    }
    else if(inputMain == "Clear"){
      possible[4]++;
    }
    else if(inputMain == "Clouds"){
      possible[5]++;
    }
    else if(inputMain == "Fog"){
      possible[6]++;
    }
    else if(inputMain == "Mist"){
      possible[7]++;
    }
  }

  //whats the max number in the array
  var max = Math.max(...possible);
  //gets the first instance of that max number in my important order above
  var pos = possible.indexOf(max);
  //returns string of the main weather event of that day
  console.log(text[pos]);
  return text[pos];
}

function getWBigDescription(mainValue, certainDay){
  console.log("getbiggerDeascription: " + mainValue);
  for(var i = 0; i < certainDay.length; i++){
    if(mainValue == certainDay[i].weather[0].main){
      return certainDay[i].weather[0].description;
    }
  }
  return "No Data";
}

//returns the fontawesome icon associated with the mainDescription
function getIcon(weatherDetail){
  if(weatherDetail == "Snow"){
    return "fas fa-cloud-meatball";
  }else if(weatherDetail == "Thunderstorm"){
    return "fas fa-bolt";
  }else if(weatherDetail == "Rain"){
    return "fas fa-cloud-showers-heavy";
  }else if(weatherDetail == "Drizzle"){
    return "fas fa-cloud-rain";
  }else if(weatherDetail == "Clear"){
    return "fas fa-sun";
  }else if(weatherDetail == "Clouds"){
    return "fas fa-cloud";
  }else if(weatherDetail == "Fog"){
    return "fas fa-smog";
  }else if(weatherDetail == "Mist"){
    return "fas fa-smog";
  }
  return "fas fa-cloud";
}

function get12(hours){
  if(hours == 0){
    return "12AM";
  }else if(hours == 12){
    return "12PM";
  }else{
    if(hours > 12){
      hours = hours % 12;
      return ("" + hours + "PM");
    }else {
      return ("" + hours + "AM");
    }
  }
}

var openNumber = -1;

function openMoreDetails(number){
    var arrayOfBoxes = document.getElementsByClassName('boxDetail');

    if(openNumber == number){
      arrayOfBoxes[(number -1)].style.display="none";
    }else{
      for(var i = 0; i < arrayOfBoxes.length; i++){
        arrayOfBoxes[i].style.display = "none";
      }
      arrayOfBoxes[(number -1)].style.display = "block";
      openNumber = number;
    }
}



/* CLOCK AND DATE */

//runs the functions on every amount of milliseconds
setInterval(clockChange, 1000);
setInterval(dateChange, 180000);

/* Time and Date Change */
function clockChange(){
  var time = new Date();
  var hours = time.getHours().toString();
  var min = time.getMinutes().toString();

  if(hours.length<2){
    hours = '0' + hours;
  }
  if(min.length <2){
    min = '0' + min;
  }
  var newTimeHM = hours + ':' + min;
  document.getElementById("clock").innerHTML = newTimeHM;
}

function dateChange(){
  var date = new Date();
  var year = date.getFullYear().toString();
  var month = date.getMonth();
  var datenum = date.getDate();
  var datenumstr = datenum.toString();
  var day = date.getDay();

  var months = ["January", "Febuary", "March", "April", "May", "June", "July",
                "August", "September", "October", "Novemeber", "December"];

  var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  month = months[month];

  if(day == 0){
    day = days[6];
  }else{
      day = days[day -1];
  }

  var newDate = day + ' The ' + suffix(datenum) + ' of ' + month + ' ' + year;

  document.getElementById("date").innerHTML = newDate;

}

function suffix(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

/* SEARCH BAR */

function changeSearch(){
  if(searchEngine == 5){
    searchEngine = 1;
  }else{
    searchEngine++;
  }

  localStorage.setItem('searchEngine', searchEngine);
  applySearch();
  changeLogo();
}

function applySearch(){
  var engine = document.getElementById('searchContainer');
  var btn = document.getElementById('sBTN');
  if(searchEngine == 1){
      engine.action = "https://www.google.co.uk/search";
      btn.setAttribute('type', 'submit');
  }else if(searchEngine == 2){
    engine.action = "https://duckduckgo.com/";
    btn.setAttribute('type', 'submit');
  }else{
    btn.setAttribute('type', 'button');
  }

  engine.addEventListener("submit", function(event){
    event.preventDefault()
  });
}


function otherSearch(){
  if(searchEngine == 3){
    var txt = 'https://solarmoviex.to/search?keyword=' + noSpaces(document.getElementById('sBAR').value);
    window.location.assign(txt);
  }
  if(searchEngine == 4){
    var txt = 'https://rarbgmirror.org/torrents.php?search=' + noSpaces(document.getElementById('sBAR').value);
    window.location.assign(txt);
  }
  if(searchEngine == 5){
    var txt = 'https://piratebay.icu/search.php?q=' + noSpaces(document.getElementById('sBAR').value) + "&page=0&orderby=99";
    window.location.assign(txt);
  }

}

function noSpaces(search){
  var finalText = "";
  var num = search.length;
  for(var i = 0; i<num; i++){
    var c = search.substring(0, 1);
    if(c == ' '){
      finalText = finalText + '+';
    }
    else{
      finalText = finalText + c;
    }
    search = search.substr(1);
  }
  return finalText;
}

function changeLogo(){
  var logo = ['google-', 'duck-', 'm-', 'r-', 'pirate-'];
  var ext = ['.svg', '.svg', '.png', '.png', '.svg'];

  if(localStorage.getItem('darkTheme') === 'true'){
    var path = 'img/' + logo[searchEngine-1] + 'Light' + ext[searchEngine-1];
    document.getElementById('search-Logo').setAttribute('src', path);
  }else{
    var path = 'img/' + logo[searchEngine-1] + 'Dark' + ext[searchEngine-1];
    document.getElementById('search-Logo').setAttribute('src', path);
  }
}


/*TOGGLE BETWEEN LIGHT AND DARK THEME
toggle info provided by: https://gitbrent.github.io/bootstrap4-toggle/
*/
$(function() {
   $('#changeTheme').change(function() {
     if(document.getElementById('changeTheme').checked){
       document.getElementById('pageStyle').setAttribute('href', 'css/dark.css');
       localStorage.setItem('darkTheme', true);
       changeLogo();
     }else{
       document.getElementById('pageStyle').setAttribute('href', 'css/light.css');
       localStorage.setItem('darkTheme', false);
       changeLogo();
     }
   })
 })

 /* TOGGLE MAP CLICKABLE */
 $(function() {
    $('#mapClick').change(function() {
      if(document.getElementById('mapClick').checked){
        document.getElementById('map').style.pointerEvents = "all"
      }else{
        document.getElementById('map').style.pointerEvents = "none"
      }
    })
  })


/* BOX OPENING FUNCTION */
function openSetting(){
  document.getElementById('box').style.display = "block";
  document.getElementById('settings').style.display = "block";
  document.getElementById('uni').style.display = "none";
  document.getElementById('todo').style.display = "none";
  document.getElementById('weather').style.display = "none";
}
function openUni(){
  document.getElementById('box').style.display = "block";
  document.getElementById('settings').style.display = "none";
  document.getElementById('uni').style.display = "block";
  document.getElementById('todo').style.display = "none";
  document.getElementById('weather').style.display = "none";
}

function openTodo(){
  document.getElementById('box').style.display = "block";
  document.getElementById('settings').style.display = "none";
  document.getElementById('uni').style.display = "none";
  document.getElementById('todo').style.display = "block";
  document.getElementById('weather').style.display = "none";
}

var gotWeather = false;
function openWeather(){
  if(!gotWeather){
    getWeather();
    gotWeather = true;
  }
  document.getElementById('box').style.display = "block";
  document.getElementById('settings').style.display = "none";
  document.getElementById('uni').style.display = "none";
  document.getElementById('todo').style.display = "none";
  document.getElementById('weather').style.display = "block";
}

function closeBox(){
  document.getElementById('box').style.display = "none";
  document.getElementById('settings').style.display = "none";
  document.getElementById('uni').style.display = "none";
  document.getElementById('todo').style.display = "none";
}

/*  KeyPress Shortcuts

*/
window.addEventListener("keydown", checkKeyPress, false); //ENABLE FOR BOX TO APPEAR

function checkKeyPress(key){
  if(key.keyCode == "27"){ //ESC
    closeBox();
  }
  if(textInputs.includes(document.activeElement) !== true){
    if(key.keyCode == "83"){ // S
      openSetting();
    }
    if(key.keyCode == "85"){ //U
      openUni();
    }
    if(key.keyCode == "84"){ //T
      openTodo();
    }
    if(key.keyCode == "87"){ //T
      openWeather();
    }
  }

  if(key.keyCode == "13" && textInputs.includes(document.activeElement)){
    if(document.activeElement == document.getElementById('todo-text')){
      addTodo();
    }else if(document.activeElement == document.getElementById('sBAR')){
      if(searchEngine == 1 || searchEngine == 2){
        //set action to nothing
        document.getElementById('searchContainer').submit();
      }else{
        console.log("happened");
        otherSearch();
      }
    }
  }

}


/* TODO SCRIPTS */

//initializes the array of todos
var todoArray = [];

//pulls todos from the localStroage and stores them in an array
function getTodos(){
  var pulledData = localStorage.getItem('todos');
  if(pulledData != ''){
    todoArray = JSON.parse(localStorage.getItem('todos'));
  }
}

//gets text from text-box, generates ID number from the last todo.id + 1
//pushes the todo to the array and updates the localstorage and display
function addTodo(){
  var text = document.getElementById('todo-text').value;
  if(text != '' && todoArray.length <= 10){
    var idNum = 0;

    if(todoArray.length == 0){
      idNum = 1;
    }else{
      idNum = todoArray[(todoArray.length - 1)].id + 1;
    }

    todoArray.push({
      id: idNum,
      content: text,
      completed: false
    });

    updateTodo();
    document.getElementById('todo-text').value = "";
    document.getElementById('todo-text').focus();
    displayTodo();
  }
}

//saves the todo array into the localstorage using JSON
function updateTodo(){
  localStorage.setItem('todos', JSON.stringify(todoArray));
  todoArray = JSON.parse(localStorage.getItem('todos'));
}

//displays all todos that are not completed first then the todos that have been completed
function displayTodo(){
  var toCompleteCode = "";
  var completedCode = "";

  for(var i = 0; i < todoArray.length; i++){
    console.log(todoArray[i].completed);
    if(todoArray[i].completed != true){
       var code = "<div class=\"todo\"><p>"+ todoArray[i].content + "</p><button onclick=\"completeTodo("+ todoArray[i].id +")\"><i class=\"far fa-check-circle\"></i></button></div>";
       toCompleteCode += code;
    }else{
      var code = "<div class=\"todoCompleted\"><p>"+ todoArray[i].content + "</p><button onclick=\"deleteTodo("+ todoArray[i].id +")\"><i class=\"far fa-times-circle\"></i></button></div>";
      completedCode += code;
    }
  }

  document.getElementById('todos').innerHTML = toCompleteCode + completedCode;
}

//finds the todo with the corresponding id to num and changes completed to true
function completeTodo(num){
  for(var i = 0; i < todoArray.length; i++){
    if(todoArray[i].id === num){
      todoArray[i].completed = true;
      updateTodo();
      displayTodo();
    }
  }
}

//removes the todo witht the corresponding id to num and removes it from the todo todoArray
function deleteTodo(num){
  var tempTodo = [];
  for(var i = 0; i < todoArray.length; i++){
    if(todoArray[i].id !== num){
      tempTodo.push(todoArray[i]);
    }
  }

  todoArray = tempTodo;
  updateTodo();
  displayTodo();
}

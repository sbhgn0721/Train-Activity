//1. Initialize Firebase

var config = {
  apiKey: "AIzaSyBWwjdWkznsTGNC5ZBpx2l6CRLEU55n408",
  authDomain: "train-scheduler-basic.firebaseapp.com",
  databaseURL: "https://train-scheduler-basic.firebaseio.com",
  projectId: "train-scheduler-basic",
  storageBucket: "",
  messagingSenderId: "1055078149420"
};
firebase.initializeApp(config);

var database = firebase.database();

//2. Submit button for adding new train schedule
$("#add-new-train").on("click", function (event) {
  event.preventDefault();

  
  //Grabs user input
  var trainName = $("#train-name").val().trim();
  var trainDestination = $("#destination").val().trim();
  var firstTrainTime = moment($("#first-train-time").val().trim(), "HHmm").format("X");
  var trainFrequency = $("#frequency").val().trim();

  //Creats local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    time: firstTrainTime,
    frequency: trainFrequency
  };
  
  //check form inputs and do not allow to submit empty form
  var x = $("#first-train-time").val().trim();
  if (x == "" || trainName == "" || trainDestination == "" || trainFrequency == "") {
  alert ("Please fill out the form");
  return false;}

  else {


  //Uploads data to the database
  database.ref().push(newTrain);

  //Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.time);
  console.log(newTrain.frequency);

  alert("Train has been successfully added");

  //Clears all of the text-boxes
  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train-time").val("");
  $("#frequency").val("");
  }

})

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  //Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().time;
  var trainFrequency = childSnapshot.val().frequency;

  //Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(firstTrainTime);
  console.log(trainFrequency);


  //Calculate how many minutes away from next train arrival
  var currentToStartTime = moment().diff(moment(firstTrainTime, "X"), "minutes");
  console.log(currentToStartTime);
  var remainder = currentToStartTime % trainFrequency;
  console.log(remainder);
  var minutesAway;

  if (remainder < 0) {
    minutesAway = trainFrequency + remainder;
  }
  else {
    minutesAway = trainFrequency - remainder;
  }

  //Calculate next train arrival time
  var nextArrivalTime = moment().add(minutesAway, 'minutes').format("hh:mm A");

  //Create new row in the current train schdule table
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(nextArrivalTime),
    $("<td>").text(minutesAway)
  );

  //Append the new row to the table
  $("#current-train-schedule").append(newRow);

})

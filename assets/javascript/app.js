// Initialize Firebase
var config = {
  apiKey: "AIzaSyAA9VpP5La5ysc0JTlsMuZQVuWxvyGsoS4",
  authDomain: "train-schedule-68ef7.firebaseapp.com",
  databaseURL: "https://train-schedule-68ef7.firebaseio.com",
  projectId: "train-schedule-68ef7",
  storageBucket: "train-schedule-68ef7.appspot.com",
  messagingSenderId: "634275696503"
};
firebase.initializeApp(config);

var database = firebase.database();

//BUtton for adding Train
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  //Grabs user input
  var trainName = $("#train-input").val().trim();
  var destName = $("#destination-input").val().trim();
  var firstTrainTime = $("#firsttrain-input").val().trim();
  var freqTime = $("#frequency-input").val().trim();

  //create local "temporary" object for holding train data
  var newTrain = {
    train: trainName,
    destination: destName,
    firstTrain: firstTrainTime,
    frequency: freqTime,
    timeStamp: firebase.database.ServerValue.TIMESTAMP
  };

  //Uploads train data to the database
  database.ref().push(newTrain);

  //Log all to the console
  console.log(newTrain.train);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  //alert
  alert("Train Added!");

  //Clears all of the text-boxes
  $("#train-input").val("");
  $("#destination-input").val("");
  $("#firsttrain-input").val("");
  $("#frequency-input").val("");
});

//Create Firebase event for adding train to the database and a row in the html when a user adds Train
database.ref().on("child_added", function(childSnapshot) {

  console.log(childSnapshot.val());

  //store everything into a variable
  var trainName = childSnapshot.val().train;
  var destName = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().firstTrain;
  var freqTime = childSnapshot.val().frequency;

  //Train information
  console.log(trainName);
  console.log(destName);
  console.log(firstTrainTime);
  console.log(freqTime);


  //Prettify the train start
  // var firstTrainTimePretty = moment.unix(firstTrainTime).format("HH:mm");

  //Current time
  var currentTime = moment();
  console.log("Current Time: " + moment(currentTime).format("HH:mm"));

  //reformat frequency
  var tFreq = parseInt(freqTime);

  //calculate the time to the next train using math to calculate the difference between the added train and now
  var firstTrainTimeConverted = moment(childSnapshot.val().firstTrain, "HH:mm").subtract(1, 'years');
  console.log("First Time Conv: " + firstTrainTimeConverted);

  var trainTime = moment(firstTrainTimeConverted).format('HH:mm');
  console.log("Train Time: " + trainTime);

  //Difference between the times
  // var diffTime = moment().diff(moment(firstTrainTime), "minutes");
  // console.log("DIFFERENCE IN TIME: " + diffTime);
  var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
  var diffTime = moment().diff(moment(tConverted), 'minutes');

  //Time apart (remainder)
  var tRemainder = diffTime % tFreq;
  console.log("tRemainder : " + tRemainder);

  //Minute until train
  var tMinutesTillTrain = tFreq - tRemainder;
  console.log("Minutes until train: " + tMinutesTillTrain);

  //Next TRAIN
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("Arrival Time: " + moment(nextTrain).format("HH:mm"));

  // $("#train-table > tbody").append("<tr>" +
  // "<td>" + trainName + "</td><td>" + destName + "</td>" +
  // "<td>" + freqTime + "</td>" +
  // "<td>" + nextTrain + "</td>" +
  // "<td>" + tillTrainPrettify + "/td>" +
  // "</tr>"
  // );

  //push current time to page
  $("#currentTime").text(currentTime);

  $("#train-table").append(
    "<tr><td>" + childSnapshot.val().train +
    "<tr><td>" + childSnapshot.val().frequency +
    "<tr><td>" + childSnapshot.val().destination +
    "<tr><td>" + moment(nextTrain).format("HH:mm") +
    "<tr><td>" + tMinutesTillTrain + "</td></tr>");


});

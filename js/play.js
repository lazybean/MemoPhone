(function() {
  var btn,
  answer,
  question,
  scoreUI,
  correctAnswer,
  currentQuestion,
  score,
  totalAnswers,
  contacts,
  callOnFail = false,
  reqContacts,
  clickEvent = "touchstart" in document.documentElement ? "touchstart" : "click";

  //we try to get contacts from phone
  //and then init the rest.
  if ( navigator.mozContacts && navigator.mozContacts.getAll ) {
    console.log('ContactManager enabled');
    contacts = [];
    reqContacts = navigator.mozContacts.getAll({sortBy: "familyName", sortOrder: "descending"});
    //if we get them iterate on the DomCursor and push results in contacts array
    reqContacts.onsuccess = function(evt) {
      var cursor = evt.target,
      contact;
      console.log('reqContacts: got  contacts');
      if ( cursor.result ) {
        console.log('contacts result found');
        contact = {
          "givenName": cursor.result.givenName[0],
          "number": cursor.result.tel[0].value
        };
        console.log('add contact ' + JSON.stringify(contact));
        contacts.push(contact);
        cursor.continue();
      } else {
        console.log('number of contacts: ' + contacts.length);
        init();
      }
    };
    reqContacts.onerror = function () {
      console.log('reqContacts: unable to get contacts');
    };
  } else {
    console.log('ContactManager not available');
    contacts = [
      {givenName: 'Dodo', number: "42"},
      {givenName: 'Pom', number: "12"}
    ];
    init();
  }


  function init() {
    btn = document.getElementById('btnOk');
    answer = document.getElementById('answer');
    question = document.getElementById('question');
    scoreUI = document.getElementById('score');
    callOnFail = document.location.href.indexOf('callOnFail') >= 0;
    console.log('init: btn is '+ btn);
    score = 0;
    totalAnswers = 0;
    bindUI();
    nextQuestion();
  }

  function setupQuestion(contactInfo) {
    currentQuestion = contactInfo.givenName; 
    correctAnswer  = contactInfo.number;
  }

  function handleAnswer() {
    console.log('handleAnser: proposal == ' + answer.value + ' ?= ' + correctAnswer);
    var result = answer.value === correctAnswer;
    if (result) {
      score += 1;
      totalAnswers +=1;
    } else {
      totalAnswers +=1;
      if (callOnFail) {
        callNumber(correctAnswer);
      }
    }
    nextQuestion();
  }
  function nextQuestion() {
    setupQuestion(contacts[( (Math.random() * contacts.length)|0) ]);
    refreshUI();
  }

  //refresh the UI with current status
  function refreshUI () {
    question.innerHTML = currentQuestion;
    scoreUI.innerHTML = score + " / " + totalAnswers;
    answer.value = "";

  }

  //attach the DOM events
  function bindUI () {
    console.log('bindUI : btn is '+ btn);
    btn.addEventListener(clickEvent, function (evt) {
      console.log('handle click');
      handleAnswer();
    });
    [].forEach.call(document.getElementsByClassName('icon-close'), function (el) {
      el.addEventListener(clickEvent, closeApp); 
    });
  }

  //start 'dial' activity for @number
  function callNumber(number) {
    console.log('callNumber: make call to ' + number);
    var activity = new MozActivity({
      name: "dial",
      // Provide de data required by the filters of the activity
      data: {
        type: "webtelephony/number",
        number: correctAnswer 
      }
    });
    activity.onsuccess = function() {
      console.log('call success');
    };
    activity.onerror = function(data) {
      console.log('call failed: ');
    };
  }

  function closeApp(evt) {
  evt.preventDefault();
    console.log('Close app');
    window.close();
  }
}());

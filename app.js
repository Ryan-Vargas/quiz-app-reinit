'use strict';
const store = {
  questions: [
    {
      question:
        'Hopoo Games is an indie studio, comprised of how many developers?',
      answers: ['Three', 'Ten', 'Seventeen', 'Forty'],
      correctAnswer: 0,
      incorrectDesc: 'Hopoo currently employs three devs.',
      factoid:
        'Hopoo Games has three employees, four if you count the composer writing the soundtrack.',
    },
    {
      question:
        'There are items in both installments that are references to the devs. What is one such item?',
      answers: [
        'Halcyon Seed',
        '56 Leaf Clover',
        'Hopoo Feather',
        'Happiest Mask',
      ],
      correctAnswer: 2,
      incorrectDesc:
        "Hopoo Feather, Paul's Goat Hoof, and Ghor's Tome all reference a developer.",
      factoid:
        "Ghor's Tome did not exist in the original game, as Hopoo Games was comprised of only Paul and Hopoo until 2018.",
    },
    {
      question:
        'Which environment in Risk of Rain 2 is the only returning stage from the first game?',
      answers: [
        'Abandoned Aqueduct',
        'Sky Meadow',
        'Distant Roost',
        'Desolate Forest',
      ],
      correctAnswer: 1,
      incorrectDesc:
        'Sky Meadow is the only stage that has been reimagined for the second installment.',
      factoid:
        "The soundtrack for this stage is also the only soundtrack anywhere in the game that uses interpolations from the first game's soundtrack.",
    },
    {
      question:
        'What item can you only acquire after having unlocked the achievement Never Back Down?',
      answers: [
        'Strides of Heresy',
        'Transcendence',
        'Focused Convergence',
        'Shaped Glass',
      ],
      correctAnswer: 2,
      incorrectDesc: 'Never Back Down unlocks Focused Convergence for use.',
      factoid:
        'Focused Convergence is a Lunar item that increases teleporter charge rate by 30%, but reduces teleporter charge radius by 50% for each stack of the item.',
    },
    {
      question: 'Who composed the soundtrack for Risk of Rain 2?',
      answers: [
        'Chris Christodoulou',
        'Daniel Doulou',
        'Chris Doulou',
        'Daniel Christodoulou',
      ],
      correctAnswer: 0,
      incorrectDesc:
        'Chris Christodoulou composed the soundtrack for Risk of Rain 2',
      factoid:
        "Chris has also composed the soundtrack for all of Hopoo's games, including Deadbolt and the original Risk of Rain.",
    },
  ],
  quizStarted: false,
  questionNumber: 0,
  score: 0,
  answer: '',
};

/*
 *
 * Technical requirements:
 * Your app should include a render() function, that regenerates the view each time the store is updated.
 * [See your course material, consult your instructor, and reference the slides for more details.]
 * NO additional HTML elements should be added to the index.html file.
 * You may add attributes (classes, ids, etc) to the existing HTML elements, or link stylesheets or additional scripts if necessary.
 * SEE BELOW FOR THE CATEGORIES OF THE TYPES OF FUNCTIONS YOU WILL BE CREATING.
 */

/********** TEMPLATE GENERATION FUNCTIONS **********/
// These functions return HTML templates

function generateQuizQuestion() {
  let html = '';
  html = `<section class='js-main-screen'>
            <h2 class='js-question-box'>${
              store.questions[store.questionNumber].question
            }</h2>
            <form action="#" id='js-answer-form' class='js-answer-box'>`;

  let i = 1;
  store.questions[store.questionNumber].answers.forEach((quizAnswer) => {
    html += `<div class='input-container'>
    <input type="radio" required name="answer" id="answer${i}" value="${quizAnswer}">
    <label for="answer${i}">${quizAnswer}</label>
    </div>`;
    i++;
  });

  html += `<section class="js-answer-eval"></section>
         <button type ="submit" class="js-answer-button">Submit</button>`;
  html += generateQuizCount();
  html += `</form>
         </section>`;
  return html;
}

function generateQuizFeedback() {
  let html = '';
  let incorrectFlag = false;
  let currentQuestion = store.questions[store.questionNumber];
  let correct = currentQuestion.answers[currentQuestion.correctAnswer];
  html += `<section class="js-main-screen">
              <h2 class="js-question-box">${currentQuestion.question}</h2>
              <form action="#" id="js-answer-form" class="js-answer-box">`;

  let i = 1;
  currentQuestion.answers.forEach((quizAnswer) => {
    if (quizAnswer !== correct && quizAnswer === store.answer) {
      incorrectFlag = !incorrectFlag;
      html += '<div class="input-container incorrect">';
    } else {
      if (quizAnswer === correct) {
        html += '<div class="input-container correct">';
        if (correct === store.answer) {
          store.score++;
        }
      } else {
        html += '<div class = "input-container">';
      }
    }
    html += `<input disabled ${
      store.answer === quizAnswer ? 'checked' : ''
    } type="radio" name="answer" id="answer${i}" value="${quizAnswer}">`;
    html += `<label for="answer${i}">${quizAnswer}</label>`;
    html += '</div>';
    i++;
  });

  if (incorrectFlag) {
    html += `<section class="js-answer-eval incorrect"><strong>
    Incorrect!</strong> ${currentQuestion.incorrectDesc} ${currentQuestion.factoid}
    </section>`;
  } else {
    html += `<section class="js-answer-eval correct"><strong>
    Correct!</strong> ${currentQuestion.factoid}
    </section>`;
  }

  html += '<button type ="submit" class="js-continue-button">Continue</button>';
  html += generateQuizCount();
  html += `</form>
          </section>`;

  store.questionNumber++;
  return html;
}

function generateQuizCount() {
  return `<h3>Question ${store.questionNumber + 1}/${store.questions.length}. ${
    store.score
  } correct.</h3>`;
}

function generateTitleScreen() {
  return `<section class = "js-main-screen">
              <h2 class = "center-text">Test your Risk of Rain knowledge with this quiz!</h2> 
              <button type="submit" class = "js-start-button">Start!</button>
          </section>`;
}

function generateEndScreen() {
  return `<section class="js-main-screen">
            <div class="results-container">
              <h2 class="js-results-text">Your Results</h2>
              <h3 class="js-results-text">You got ${store.score} out of ${
    store.questions.length
  } right!</h2>
              <h3 class="js-results-text">${Math.floor(
                (store.score / store.questions.length) * 100
              )}%</h2>
              <button type="submit" class="js-end-button">Retake the quiz!</button>    
            </div>
          </section>`;
}

/********** RENDER FUNCTION(S) **********/
// This function conditionally replaces the contents of the <main> tag based on the state of the store

function renderQuizScreen() {
  let generateString = '';
  if (!store.quizStarted) {
    generateString = generateTitleScreen();
  } else if (store.questionNumber >= store.questions.length) {
    generateString = generateEndScreen();
  } else {
    if (store.answer) {
      generateString = generateQuizFeedback();
    } else {
      generateString = generateQuizQuestion();
    }
  }
  $('main').html(generateString);
}

/********** EVENT HANDLER FUNCTIONS **********/
// These functions handle events (submit, click, etc)

function handleAnswerSubmitted() {
  $('main').on('submit', '#js-answer-form', (event) => {
    event.preventDefault();
    store.answer = $('input[name="answer"]:checked').val();
    renderQuizScreen();
  });
}

function handleNextQuestion() {
  $('main').on('click', '.js-continue-button', (event) => {
    (store.answer = ''), renderQuizScreen();
  });
}

function handleStartQuiz() {
  $('main').on('click', '.js-start-button', (event) => {
    event.preventDefault();
    store.quizStarted = !store.quizStarted;
    renderQuizScreen();
  });
}

function handleEndQuiz() {
  $('main').on('click', '.js-end-button', (event) => {
    store.score = 0;
    store.questionNumber = 0;
    store.quizStarted = false;
    renderQuizScreen();
  });
}

function handleQuizApp() {
  renderQuizScreen();
  handleStartQuiz();
  handleAnswerSubmitted();
  handleNextQuestion();
  handleEndQuiz();
}

$(handleQuizApp);

// selecting elements from html
const newJokeBtn = document.querySelector('#new-joke-btn');
const lastJokeBtn = document.querySelector('#last-joke-btn');
const jokeTextCont = document.querySelector('.joke-text-cont');
const jokeText = document.querySelector('#joke-text');

// this code is for telling the joke
const synthesizer = window.speechSynthesis;
const speech = new SpeechSynthesisUtterance();
speech.rate = 1;
speech.pitch = 1;
speech.volume = 1;
speech.lang = 'en-US';

// this function will disable the button
const triggeringButtons = (isDisable) => {
    newJokeBtn.disabled = isDisable;
    lastJokeBtn.disabled = isDisable;
}   

// deleting the jokes
const deleteJoke = () => {
    jokeTextCont.classList.add('vanish');
}
// showing the joke
const showJoke = (joke) => {
    jokeTextCont.classList.remove('vanish');
    jokeText.innerText = joke;
}

// telling the question joke and the answer joke
const tellJoke = (questionJoke, answerJoke) => {
    const actualJoke = `${questionJoke} \n "  ${answerJoke}  " `;
   speech.text = actualJoke;
   synthesizer.speak(speech);
   if (synthesizer.speaking) {
        showJoke(actualJoke);
        triggeringButtons(true);
   } 
   speech.onend = () => {
      deleteJoke();
      triggeringButtons(false);
   }
}

// this object keep tracks of the last joke
let lastJoke = {};

// getting jokes from api
const getJokes = async () => {
    try {
        // api url
        const apiUrl = 'https://v2.jokeapi.dev/joke/Programming,Spooky,Christmas?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart';
        const response = await axios.get(apiUrl); //sending request through axios
        const jokeObject = response.data; //the joke object that is returned from the respond               
        const { setup:questionJoke, delivery:answerJoke } = jokeObject; // pulling the out the delivery joke and the setUp joke from the joke object

        // storing the jokes into the last joke object
        lastJoke.setupJoke = questionJoke; 
        lastJoke.deliveryJoke = answerJoke;

        // telling the joke
        tellJoke(questionJoke, answerJoke);

    } catch (error) {
        // code goes here if any error is found
        console.log(error);
    }
}


// on load
newJokeBtn.addEventListener('click', getJokes);

lastJokeBtn.addEventListener('click', () => {
    const { setupJoke, deliveryJoke } = lastJoke;
    if (!setupJoke && !deliveryJoke) {
        return;
    }
    tellJoke(setupJoke, deliveryJoke);
})
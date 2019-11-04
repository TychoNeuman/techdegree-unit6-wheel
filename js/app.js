const m_sPlayerKeyboard = document.getElementById('qwerty');
const m_sPhrase = document.getElementById('phrase');
const m_sStartGame = document.getElementById('overlay');

let m_iMissed = 0;

const m_aPhraseArray = [
    "Tough It Out",
    "Curiosity Killed The Cat",
    "Everything But The Kitchen Sink",
    "Beating Around the Bush",
    "What Goes Up Must Come Down",
    "Hands Down",
    "Roll With the Punches",
    "On the Same Page",
    "Rain on Your Parade",
    "Go For Broke",
    "Playing Possum",
    "Keep Your Eyes Peeled",
    "Close But No Cigar",
    "Swinging For the Fences",
    "Playing For Keeps",
    "All Greek To Me",
    "Dropping Like Flies"
];

//Hides the 'start' overlay
//TODO : Check if there is a better way to hide the overlay (Feels werid to put it on the overlay id)
m_sStartGame.addEventListener('click', (event) => {
    if(event.target.className === 'btn__reset'){
        m_sStartGame.style.display = 'none';
    }
    resetGame();
});

//Selects a random phrase from the array and return the individual characters as a new array
function selectRandomPhraseFromArray(p_aArray) {
        let l_sRandomPhrase = p_aArray[Math.floor(Math.random() * p_aArray.length)];
        return l_sRandomPhrase.split('');
}

//Adds the splitted elements to the display
function addPhraseToDisplay(p_aArray){
    const l_aSplitPhraseArray = selectRandomPhraseFromArray(p_aArray);
    const l_sUnorderedList = m_sPhrase.firstElementChild;

    for(let i = 0; i < l_aSplitPhraseArray.length; i++){
        let l_sListItem = document.createElement('li');
        l_sListItem.textContent = l_aSplitPhraseArray[i];
        if(l_sListItem.textContent !== ' '){
            l_sListItem.classList.add("letter");
        }else{
            l_sListItem.classList.add("space");
        }
        l_sUnorderedList.appendChild(l_sListItem);
    }
}

//Check if the user guessed the correct letter, if not: remove a heart
function checkLetter(p_sUserInput) {
    const l_aClassLetter = document.querySelectorAll(".letter");
    let l_bInArrary = false;

    for(let j = 0; j < l_aClassLetter.length; j++){
        if(l_aClassLetter[j].textContent.toUpperCase() == p_sUserInput.toUpperCase()){
            l_aClassLetter[j].classList.add("show");
            l_bInArrary = true;
        }
    }
    if(!l_bInArrary){
        removeHeart();
    }
}

//Removes a heart from the page and adds 1 to the missed counter
function removeHeart(){
    const l_aHearts = document.getElementById('scoreboard');
    let l_sLastChild = l_aHearts.lastElementChild.lastElementChild;
    l_aHearts.lastElementChild.removeChild(l_sLastChild);
    m_iMissed++;
}


//TODO: Remove win or lose class on game reset
function checkWin(){
    if(document.querySelectorAll(".show").length === document.querySelectorAll(".letter").length){
        m_sStartGame.style.display = "";
        m_sStartGame.classList.remove("start");
        if(m_sStartGame.classList == "lose"){
            m_sStartGame.classList.remove("lose");
        }
        m_sStartGame.classList.add("win");
        document.querySelector(".title").textContent = "You win!";
    }else if(m_iMissed === 5){
        m_sStartGame.style.display = "";
        m_sStartGame.classList.remove("start");
        if(m_sStartGame.classList == "win"){
            m_sStartGame.classList.remove("win");
        }
        m_sStartGame.classList.add("lose");
        document.querySelector(".title").textContent = "You lose! :(";
    }
}

//TODO: Make a reset function
function resetGame(){
    m_iMissed = 0;
    //remove all 'chosen' classes
    let l_aAllChosen = document.querySelectorAll('.chosen');
    for(let i = 0; i < l_aAllChosen.length; i++){
        l_aAllChosen[i].classList.remove("chosen");
    }
    //remove all show classes
    //TODO: This could probably be removed
    let l_aAllShow = document.querySelectorAll('.show');
    for(let i = 0; i < l_aAllShow.length; i++){
        l_aAllShow[i].classList.remove("show");
    }
    //clear the old phrase
    // TODO : On game enter, skip this part
    let l_aOldPhrase = document.querySelectorAll('ul > li');
    for(let i = 0; i < l_aOldPhrase.length; i++){
        l_aOldPhrase[i].remove();
    }

    //set a new phrase
    addPhraseToDisplay(m_aPhraseArray);

    //calculate the amount of hearts still missing and add them back to the DOM
    const l_iAmountOfHearts = 5;
    let l_iRemainingHeats = l_iAmountOfHearts - document.getElementsByTagName('img').length;
    if(l_iRemainingHeats !== 0){
        for(let i = 0; i < l_iRemainingHeats; i++){
            let l_aHeartContainer = document.createElement("li");
            l_aHeartContainer.classList.add("tries");
            let l_oHeartImage = document.createElement("img");
            l_oHeartImage.setAttribute("src", "images/liveHeart.png");
            l_oHeartImage.setAttribute("height", "35px");
            l_oHeartImage.setAttribute("width", "30px");
            l_aHeartContainer.appendChild(l_oHeartImage);
            let l_oHeartPlacement = document.querySelector("#scoreboard > ol");
            l_oHeartPlacement.appendChild(l_aHeartContainer);
        }
    }
}


//Get user input from the keyboard
m_sPlayerKeyboard.addEventListener('click', (event) => {
    let l_sChosenButton = event.target;
    if(l_sChosenButton.tagName == 'BUTTON'){
        if(l_sChosenButton.className !== 'chosen'){
            checkLetter(l_sChosenButton.textContent);
            l_sChosenButton.classList.add("chosen");
        }
    }

    checkWin();
});
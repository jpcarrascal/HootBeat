// prints all get parameters
const urlParams = new URLSearchParams(window.location.search);
let error = document.getElementById("error-message");
if(urlParams.get('who') && !urlParams.get('room'))
    error.innerHTML = "¡Oops, no hay interacción en este momento!";
else if(!urlParams.get('who') && urlParams.get('room'))
    error.innerHTML = "¡Oops, error en la Matrix!";
else if(!urlParams.get('who') && !urlParams.get('room'))
    error.innerHTML = "¡Ouch, alguien te ha sacado!";
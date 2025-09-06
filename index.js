// Set background color based on current page
const roomColors = {
    "6_TheArboretum.html": "#d9b8ff",
    "5_TheAuditorium.html": "#b8e3ff",
    "1_TheAtelier.html": "#ffa0a0",
    "0_TheAntechamber.html": "#fbb8ff",
    "4_TheAtrium.html": "#98dc9b",
    "2_TheAlcove.html": "#ffb169",
    "3_TheApothecary.html": "#ffd861"
};

document.addEventListener('DOMContentLoaded', function() {
    const file = location.pathname.split('/').pop();
    console.log(file);
    if (roomColors[file]) {
        document.body.style.backgroundColor = roomColors[file];
    }
});


const delay = ms => new Promise(res => setTimeout(res, ms));

async function playAudio(audioClip) {
    new Audio(audioClip).play();
    await delay(1300);
    window.location.href = 'index.html';
}
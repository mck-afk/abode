


const delay = ms => new Promise(res => setTimeout(res, ms));

async function playAudio(audioClip) {
    new Audio(audioClip).play();
    await delay(1300);
    window.location.href = 'index.html';
}
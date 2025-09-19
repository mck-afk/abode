//Audio Functions
const delay = ms => new Promise(res => setTimeout(res, ms));

async function playAudio(audioClip) {
    new Audio(audioClip).play();
    await delay(1300);
    window.location.href = 'index.html';
}

function playSound(audioClip) {
    new Audio(audioClip).play();
}

// Draggable 
interact('.draggable')
  .draggable({
    listeners: {
      move: dragMoveListener
    }
  })

function dragMoveListener (event) {
  var target = event.target

  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

window.dragMoveListener = dragMoveListener


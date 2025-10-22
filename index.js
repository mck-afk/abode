import THEABODE from './data/dimensions.js';
import { createHoneycomb as _createHoneycomb, createBlueprint as _createBlueprint } from './Honeycomb.js';

// Expose small wrappers if other scripts expect global functions
window.createHoneycomb = function(containerId) {
  return _createHoneycomb(containerId);
};
window.createBlueprint = function(containerId) {
  return _createBlueprint(containerId);
};

// Expose a global toggleImage function so the image's onclick can call it
window.toggleImage = function() {
    const img1 = 'Assets/floorplan.png';
    const img2 = 'Assets/blueprint.svg';
    const imgElement = document.getElementById('toggleImage');
    if (!imgElement) return;

    // Determine current view (prefer dataset.view)
    const currentView = imgElement.dataset.view || ((imgElement.src && imgElement.src.toLowerCase().indexOf('blueprint') !== -1) ? 'blueprint' : 'honeycomb');
    const nextView = currentView === 'blueprint' ? 'honeycomb' : 'blueprint';

    imgElement.dataset.view = nextView;
    imgElement.src = nextView === 'blueprint' ? img2 : img1;

    // Dispatch the custom event to notify listeners
    imgElement.dispatchEvent(new CustomEvent('abode:viewchange', { detail: { view: nextView } }));
};

// Helper: set or render the desired view into the container
function renderAbodeView(containerId, view) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.dataset.abodeView = view;

    const computed = window.getComputedStyle(container);
    const hasTransition = computed.transitionDuration && computed.transitionDuration !== '0s';
    const firstRender = !container.dataset._rendered;
    const doImmediate = firstRender || !hasTransition;

    const replaceContent = () => {
        container.innerHTML = '';
        if (view === 'blueprint') {
            _createBlueprint(containerId);
        } else {
            _createHoneycomb(containerId);
        }
        container.dataset._rendered = '1';
        container.classList.remove('abode--honeycomb', 'abode--blueprint');
        container.classList.add(view === 'blueprint' ? 'abode--blueprint' : 'abode--honeycomb');
        container.classList.remove('abode--hidden');
    };

    if (doImmediate) {
        replaceContent();
        return;
    }

    container.classList.add('abode--hidden');

    let handled = false;
    const finish = () => {
        if (handled) return;
        handled = true;
        replaceContent();
    };

    const onTransitionEnd = (e) => {
        if (e.target === container && (e.propertyName === 'opacity' || e.propertyName === 'transform')) {
            container.removeEventListener('transitionend', onTransitionEnd);
            finish();
        }
    };
    container.addEventListener('transitionend', onTransitionEnd);
    setTimeout(finish, 400);
}

function getAbodeView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    return container.dataset.abodeView || 'honeycomb';
}


// Render a single room's dimensions into a .dimensions container (replaces its content)
function renderRoomInDimensions(roomId, selector = '.dimensions') {
    const room = THEABODE.find(r => r.id === Number(roomId));
    if (!room) return;
    const container = document.querySelector(selector);
    if (!container) return;

    container.innerHTML = '';

    const fields = [
        {label: 'Numerology', value: room.id},
        {label: 'Activity', value: room.func},
        {label: 'Realm', value: room.realm},
        {label: 'Resource', value: Array.isArray(room.resource) ? room.resource.join(', ') : room.resource},
        {label: 'Relation', value: room.relation},
        {label: 'Day', value: room.day},
        {label: 'Astrology', value: room.zodiac},
        {label: 'Chakra', value: room.chakra},
        {label: 'The Artists Way', value: room.artistsWay}
    ];

    fields.forEach(f => {
        const div = document.createElement('div');
        const h4 = document.createElement('p');
        h4.innerHTML = `<b>${f.label}</b>`;
        const p = document.createElement('p');
        p.textContent = f.value || '';
        div.appendChild(h4);
        div.appendChild(p);
        div.className = room.colour;
        container.appendChild(div);
    });
}

// App init: hook the toggle image and initial rendering
window.addEventListener('DOMContentLoaded', () => {
    const toggleImg = document.getElementById('toggleImage');
    let initialView = 'honeycomb';
    if (toggleImg) {
        if (toggleImg.dataset && toggleImg.dataset.view) {
            initialView = toggleImg.dataset.view;
        } else {
            const src = (toggleImg.src || '').toLowerCase();
            initialView = src.indexOf('blueprint') !== -1 ? 'blueprint' : 'honeycomb';
            toggleImg.dataset.view = initialView;
        }

        toggleImg.addEventListener('abode:viewchange', (ev) => {
            const v = ev && ev.detail && ev.detail.view ? ev.detail.view : null;
            if (v) renderAbodeView('abode', v);
        });
    }

    renderAbodeView('abode', initialView);

    // Per-room rendering (detect filename or data-room-id)
    try {
        const path = window.location.pathname || '';
        const filename = path.split('/').pop() || '';
        const match = filename.match(/^([0-9])_/) || null;
        const container = document.querySelector('.dimensions');
        const explicitId = container && container.dataset && container.dataset.roomId ? Number(container.dataset.roomId) : null;
        let roomId = null;
        if (explicitId !== null && !Number.isNaN(explicitId)) {
            roomId = explicitId;
        } else if (match) {
            roomId = Number(match[1]);
        }
        if (roomId !== null && !Number.isNaN(roomId) && container) {
            setTimeout(() => renderRoomInDimensions(roomId), 30);
        }
    } catch (e) {
        // ignore
    }

    // Modernize: register doorknob click handler from module scope (replaces inline onclick)
    try {
        const knobs = document.querySelectorAll('#doorknob');
        knobs.forEach(k => {
            // Remove any existing inline handler to avoid double-calls
            k.removeAttribute('onclick');
            k.addEventListener('click', () => playAudio('Assets/Sounds/door_sound.mp3'));
        });
    } catch (e) {
        // ignore
    }
});

export { renderAbodeView, renderRoomInDimensions };
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


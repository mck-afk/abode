import THEABODE from './data/dimensions.js';

//this file contains functionality for website, excluding the homepage which is in Honeycomb.js

// render room dimensions
function renderRoomDimensions(roomId, selector = '.dimensions') {
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



// Expose a global toggleImage function so the image's onclick can call it
window.toggleImage = function() {
    const img1 = 'Assets/floorplan.png';
    const img2 = 'Assets/blueprint.svg';
    const imgElement = document.getElementById('toggleImage');
    if (!imgElement) return;

    // Determine current view (prefer dataset.view)
    const currentView = imgElement.dataset.view || ((imgElement.src && imgElement.src.toLowerCase().indexOf('blueprint') !== -1) ? 'blueprint' : 'floorplan');
    const nextView = currentView === 'blueprint' ? 'floorplan' : 'blueprint';

    imgElement.dataset.view = nextView;
    imgElement.src = nextView === 'blueprint' ? img2 : img1;

    // persist view so it carries across pages
    try { localStorage.setItem('abode:view', nextView); } catch (err) {}

    // Dispatch the custom event to notify listeners
    imgElement.dispatchEvent(new CustomEvent('room:viewchange', { detail: { view: nextView } }));
};


function renderNavigationTools(currentRoomID) {

    const ids = THEABODE.slice(1).map(r => r.id); // slice = exclude 0_theAntechamber
    const idx = ids.indexOf(currentRoomID);
    // circular neighbors: excluding 0
    const leftId = ids[(idx - 1 + ids.length) % ids.length];
    const rightId = ids[(idx + 1) % ids.length];

    document.querySelectorAll('.edge-nav .nav-zone').forEach(a => {
        let targetId = null;
        if (a.classList.contains('nav-left')) targetId = leftId;
        else if (a.classList.contains('nav-right')) targetId = rightId;

        if (targetId !== null) {
            const target = THEABODE.find(r => r.id === targetId);
            if (target && target.link) {
              a.setAttribute('href', target.link);
              a.setAttribute('aria-label', "Go to " + target.link);
              a.style.setProperty('--nav-bg', target.dimensions.backgroundColor);
            }
            
        }

        a.addEventListener('click', (e) => {
            // play sound and delay navigation slightly for effect
            e.preventDefault();
            playSound('Assets/Sounds/door_sound.mp3');
            const href = a.getAttribute('href');
            setTimeout(() => { if (href) window.location.href = href; }, 400);
        });
    });
}

// handler for view switching 
function renderNavView(containerId, view) {
    // container is optional — we only need it to store dataset flags and read transitions.
    const container = containerId ? document.getElementById(containerId) : null;
    if (container) container.dataset.roomView = view;

    // If there's no container, force immediate behavior (no transition handling).
    let hasTransition = false;
    let firstRender = true;
    if (container) {
        const computed = window.getComputedStyle(container);
        hasTransition = computed.transitionDuration && computed.transitionDuration !== '0s';
        firstRender = !container.dataset._rendered;
    }
    const doImmediate = !container || firstRender || !hasTransition;

    const replaceContent = () => {
        // Do not wipe the room container contents — we only toggle navigation tools visibility
        const navs = document.querySelectorAll('.edge-nav');
        if (view === 'blueprint') {
            // show navigation tools and populate their targets (CSS handles visibility)
            navs.forEach(n => n.classList.add('edge-nav--visible'));
            try {
                const id = (typeof detectCurrentRoomID === 'function') ? detectCurrentRoomID() : null;
                if (id !== null && !Number.isNaN(id)) renderNavigationTools(id);
            } catch (err) {
                // ignore
            }
        } else {
            // hide navigation tools (CSS handles visibility)
            navs.forEach(n => n.classList.remove('edge-nav--visible'));
        }
    if (container) container.dataset._rendered = '1';
        // container.classList.remove('room--honeycomb', 'room--blueprint');
        // container.classList.add(view === 'blueprint' ? 'room--blueprint' : 'room--honeycomb');
        // container.classList.remove('room--hidden');
    };

    if (doImmediate) {
        replaceContent();
        return;
    }

    // container.classList.add('room--hidden');

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


// audio effects

function playSound(audioClip) {
    new Audio(audioClip).play();
}

// // draggable 
// interact('.draggable')
//   .draggable({
//     listeners: {
//       move: dragMoveListener
//     }
//   })

// function dragMoveListener (event) {
//   var target = event.target

//   var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
//   var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

//   target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

//   target.setAttribute('data-x', x)
//   target.setAttribute('data-y', y)
// }

// window.dragMoveListener = dragMoveListener

function detectCurrentRoomID() {
    const path = window.location.pathname || '';
    const filename = path.split('/').pop() || '';
    const m = filename.match(/^([0-9])_/);
    if (!m) return null;
    const n = Number(m[1]);
    return Number.isNaN(n) ? null : n;
}

// initialise
window.addEventListener('DOMContentLoaded', () => {
    const currentRoomID = detectCurrentRoomID();
    if (currentRoomID !== null && !Number.isNaN(currentRoomID)) {
        setTimeout(() => renderRoomDimensions(currentRoomID), 30);
        setTimeout(() => renderNavigationTools(currentRoomID), 30);
    }
    
    const toggleImg = document.getElementById('toggleImage');
    let initialView = 'honeycomb';
    if (toggleImg) {
        // prefer persisted view stored in localStorage
        try {
            const stored = localStorage.getItem('abode:view');
            if (stored) {
                initialView = stored;
                toggleImg.dataset.view = initialView;
                toggleImg.src = initialView === 'blueprint' ? 'Assets/blueprint.svg' : 'Assets/floorplan.png';
            } else if (toggleImg.dataset && toggleImg.dataset.view) {
                initialView = toggleImg.dataset.view;
            } else {
                const src = (toggleImg.src || '').toLowerCase();
                initialView = src.indexOf('blueprint') !== -1 ? 'blueprint' : 'honeycomb';
                toggleImg.dataset.view = initialView;
            }
        } catch (err) {
            // fallback to dataset/src
            if (toggleImg.dataset && toggleImg.dataset.view) {
                initialView = toggleImg.dataset.view;
            } else {
                const src = (toggleImg.src || '').toLowerCase();
                initialView = src.indexOf('blueprint') !== -1 ? 'blueprint' : 'honeycomb';
                toggleImg.dataset.view = initialView;
            }
        }

        toggleImg.addEventListener('room:viewchange', (ev) => {
            const v = ev && ev.detail && ev.detail.view ? ev.detail.view : null;
            if (v) renderNavView('room', v);
            try { localStorage.setItem('abode:view', v); } catch (err) {}
        });
    }

    renderNavView('room', initialView);
    
});
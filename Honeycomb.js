import THEABODE from './data/dimensions.js';

//This file renders the homepage

// View 1 = honeycomb / floorplan
function createHoneycomb(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // clear previous content
    container.innerHTML = '';

    const honeycombDiv = document.createElement('div');
    honeycombDiv.className = 'honeycomb';

    const _order = [6, 5, 1, 0, 4, 2, 3]; 
    const _map = new Map(THEABODE.map(item => [item.id, item]));
    const orderedRooms = _order.map(id => _map.get(id)).filter(Boolean);

    orderedRooms.forEach(room => {
        const hexDiv = document.createElement('div');
        hexDiv.className = 'hexagon';
        hexDiv.id = room.id;
        hexDiv.style.backgroundColor = room.dimensions.backgroundColor;

        hexDiv.addEventListener('mouseenter', function() {
            hexDiv.style.backgroundImage = room.dimensions.backgroundImage;
            hexDiv.style.backgroundColor = '';
            hexDiv.style.backgroundSize = room.dimensions.backgroundSize;
        });
        hexDiv.addEventListener('mouseleave', function() {
            hexDiv.style.backgroundImage = '';
            hexDiv.style.backgroundColor = room.dimensions.backgroundColor;
        });

        // whole hexDiv clickable
        hexDiv.style.cursor = 'pointer';
        hexDiv.addEventListener('click', function(e) {
            // Allow ctrl/cmd+click to open in new tab
            if (e.ctrlKey || e.metaKey) {
                window.open(room.link, '_blank');
            } else {
                window.location.href = room.link;
            }
        });

        const h3 = document.createElement('h3');
        h3.id = room.id;
        h3.textContent = room.title || room.title;
        hexDiv.appendChild(h3);
        honeycombDiv.appendChild(hexDiv);
    });

    container.appendChild(honeycombDiv);
}

// View 2 = table / blueprint
function createBlueprint(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // clear previous content
    const existingTable = container.querySelector('.abodetable');
    if (existingTable) existingTable.remove();

    const table = document.createElement('table');
    table.className = 'abodetable';

    // header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = [
        'ID', 'Room', 'Function', 'Realm', 'Resource', 'Relation', 'Day', 'Zodiac Astrology', 'New Age Chakra System', 'The Artists Way Reference'
    ];
    headers.forEach(text => {
        const th = document.createElement('th');
        if (text === 'New Age Chakra System') {
            const a = document.createElement('a');
            a.href = 'https://en.wikipedia.org/wiki/Chakra#Seven_chakra_system';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = text;
            th.appendChild(a);
        } else if (text === 'The Artists Way Reference') {
            const a = document.createElement('a');
            a.href = 'https://juliacameronlive.com/book/the-artists-way/';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = text;
            th.appendChild(a);
        } else {
            th.textContent = text;
        }
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // table body
    const tbody = document.createElement('tbody');
    THEABODE.forEach(r => {

        const tr = document.createElement('tr');
        if (r.colour) tr.className = r.colour;
       

        const tdId = document.createElement('td');
        tdId.textContent = r.id;
        tr.appendChild(tdId);

        const tdRoom = document.createElement('td');
        const nameDiv = document.createElement('div');
        nameDiv.innerHTML = `<a href="${r.link}"><h3>${r.room.name}</h3></a>`;
        tdRoom.appendChild(nameDiv);
        if (r.room.subtitle) {
            const sub = document.createElement('div');
            const i = document.createElement('i');
            i.textContent = r.room.subtitle;
            sub.appendChild(i);
            tdRoom.appendChild(sub);
        }
        tr.appendChild(tdRoom);

        const tdFunc = document.createElement('td');
        tdFunc.textContent = r.func;
        tr.appendChild(tdFunc);

        const tdRealm = document.createElement('td');
        tdRealm.textContent = r.realm;
        tr.appendChild(tdRealm);

        const tdResource = document.createElement('td');
        if (Array.isArray(r.resource)) {
            r.resource.forEach((line, idx) => {
                if (idx) tdResource.appendChild(document.createElement('br'));
                const txt = document.createTextNode(line);
                tdResource.appendChild(txt);
            });
        } else {
            tdResource.textContent = r.resource || '';
        }
        tr.appendChild(tdResource);

        const tdRelation = document.createElement('td');
        tdRelation.textContent = r.relation;
        tr.appendChild(tdRelation);

        const tdDay = document.createElement('td');
        tdDay.textContent = r.day;
        tr.appendChild(tdDay);

        const tdZodiac = document.createElement('td');
        tdZodiac.textContent = r.zodiac || '';
        tr.appendChild(tdZodiac);

        const tdChakra = document.createElement('td');
        tdChakra.textContent = r.chakra;
        tr.appendChild(tdChakra);

        const tdAW = document.createElement('td');
        tdAW.textContent = r.artistsWay;
        tr.appendChild(tdAW);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}


// handler for view switching 
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
            createBlueprint(containerId);
        } else {
            createHoneycomb(containerId);
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



//event listener

window.toggleAbode = function() { 
    const img1 = 'Assets/floorplan.png';
    const img2 = 'Assets/blueprint.svg';
    const imgElement = document.getElementById('toggleAbode');
    if (!imgElement) return;

    // determine current view (prefer dataset.view)
    const currentView = imgElement.dataset.view || ((imgElement.src && imgElement.src.toLowerCase().indexOf('blueprint') !== -1) ? 'blueprint' : 'honeycomb');
    const nextView = currentView === 'blueprint' ? 'honeycomb' : 'blueprint';

    imgElement.dataset.view = nextView;
    imgElement.src = nextView === 'blueprint' ? img2 : img1;

    // Dispatch the custom event to notify listeners
    imgElement.dispatchEvent(new CustomEvent('abode:viewchange', { detail: { view: nextView } }));
};

//initialise

window.addEventListener('DOMContentLoaded', () => { 
    const toggleImg = document.getElementById('toggleAbode');
    let initialView = 'honeycomb'; // always start with floorplan on homepage
    if (toggleImg) {
        toggleImg.dataset.view = initialView;
        toggleImg.src = 'Assets/floorplan.png';
        toggleImg.addEventListener('abode:viewchange', (ev) => {
            const v = ev && ev.detail && ev.detail.view ? ev.detail.view : null;
            if (v) {
                try { localStorage.setItem('abode:view', v); } catch (err) {}
                renderAbodeView('abode', v);
            }
        });
    }
    renderAbodeView('abode', initialView);
});

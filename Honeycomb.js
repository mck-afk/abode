function createHoneycomb(containerId) {
    const theEstate = [
        {id:6, title:"6. the arboretum", subtitle:"the artist and their legacy/story", link:"./6_TheArboretum.html", dimensions:{ backgroundColor: "#d9b8ff", backgroundImage: "url('./images/6.png')", backgroundSize: "200px", backgroundPosition: "center" }},
        {id:5, title:"5. the auditorium", subtitle:"the artist and their society/city", link:"./5_TheAuditorium.html", dimensions:{ backgroundColor: "#b8e3ff", backgroundImage: "url('./images/5.png')", backgroundSize: "200px", backgroundPosition: "center" }},
        {id:1, title:"1. the atelier", subtitle:"the artist and their art/craft", link:"./1_TheAtelier.html", dimensions:{ backgroundColor: "#ffa0a0", backgroundImage: "url('./images/1.png')", backgroundSize: "200px", backgroundPosition: "center" }},
        {id:0, title:"0. the antechamber", subtitle:"the artist and their self", link:"./0_TheAntechamber.html", dimensions:{ backgroundColor: "#fbb8ff", backgroundImage: "url('./images/0.png')", backgroundSize: "200px", backgroundPosition: "center" }},
        {id:4, title:"4. the atrium", subtitle:"the artist and their family/community", link:"./4_TheAtrium.html", dimensions:{ backgroundColor: "#98dc9b", backgroundImage: "url('./images/4.png')", backgroundSize: "200px", backgroundPosition: "center" }},
        {id:2, title:"2. the alcove", subtitle:"the artist and their lover/muse", link:"./2_TheAlcove.html", dimensions:{ backgroundColor: "#ffb169", backgroundImage: "url('./images/2.png')", backgroundSize: "200px", backgroundPosition: "center" }},
        {id:3, title:"3. the apothecary", subtitle:"the artist and their shadow/rival", link:"./3_TheApothecary.html", dimensions:{ backgroundColor: "#ffd861", backgroundImage: "url('./images/3.png')", backgroundSize: "200px", backgroundPosition: "center" }}
    ];


    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear previous content to allow re-render
    container.innerHTML = '';

    const honeycombDiv = document.createElement('div');
    honeycombDiv.className = 'honeycomb';

    theEstate.forEach(room => {
        const hexDiv = document.createElement('div');
        hexDiv.className = 'hexagon';
        hexDiv.id = room.id;
        hexDiv.style.backgroundColor = room.dimensions.backgroundColor;
        //hexDiv.style.backgroundImage = room.dimensions.backgroundImage;

        // Make the whole hexDiv clickable
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
        const a = document.createElement('a');
        a.id = room.id;
        a.href = room.link;
        a.textContent = room.title;
        h3.appendChild(a);
        hexDiv.appendChild(h3);
        // Optionally add subtitle:
        // const h2 = document.createElement('h2');
        // h2.textContent = room.subtitle;
        // hexDiv.appendChild(h2);
        honeycombDiv.appendChild(hexDiv);
    });

        container.appendChild(honeycombDiv);
}

// Wait for DOM to load and render Honeycomb
window.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    container.id = 'my-honeycomb';
    container.className = 'content';
    document.body.appendChild(container);
    createHoneycomb('my-honeycomb');
});



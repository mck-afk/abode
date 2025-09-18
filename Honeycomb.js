function createHoneycomb(containerId) {
    const theEstate = [
        {id:6, title:"6. the arboretum", subtitle:"the artist and their legacy/story", link:"./6_TheArboretum.html", dimensions:{ backgroundColor: "#ad6cf8", backgroundImage: "url('./Assets/6.jpeg')", backgroundSize: "200px" }},
        {id:5, title:"5. the auditorium", subtitle:"the artist and their society/city", link:"./5_TheAuditorium.html", dimensions:{ backgroundColor: "#3aa6ed", backgroundImage: "url('./Assets/5.jpeg')", backgroundSize: "200px" }},
        {id:1, title:"1. the atelier", subtitle:"the artist and their art/craft", link:"./1_TheAtelier.html", dimensions:{ backgroundColor: "#d44141", backgroundImage: "url('./Assets/1.jpeg')", backgroundSize: "200px" }},
        {id:0, title:"0. the antechamber", subtitle:"the artist and their self", link:"./0_TheAntechamber.html", dimensions:{ backgroundColor: "#e55bed", backgroundImage: "url('./Assets/0.jpeg')", backgroundSize: "200px" }},
        {id:4, title:"4. the atrium", subtitle:"the artist and their family/community", link:"./4_TheAtrium.html", dimensions:{ backgroundColor: "#66bd6a", backgroundImage: "url('./Assets/4.jpeg')", backgroundSize: "200px"}},
        {id:2, title:"2. the alcove", subtitle:"the artist and their lover/muse", link:"./2_TheAlcove.html", dimensions:{ backgroundColor: "#ed7b12", backgroundImage: "url('./Assets/2.jpeg')", backgroundSize: "200px" }},
        {id:3, title:"3. the apothecary", subtitle:"the artist and their shadow/rival", link:"./3_TheApothecary.html", dimensions:{ backgroundColor: "#ffcc00", backgroundImage: "url('./Assets/3.jpeg')", backgroundSize: "200px" }}
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
            h3.textContent = room.title;
            hexDiv.appendChild(h3);
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



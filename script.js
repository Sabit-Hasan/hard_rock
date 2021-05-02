const spinnerVisibility = value => {
    if (value) {
        document.getElementById('spinner').style.display = 'block';
    }
    else {
        document.getElementById('spinner').style.display = 'none';
    }
}
spinnerVisibility(false);

const searchButton = async () => {
    document.getElementById('not-found').style.display = 'none';
    spinnerVisibility(true);
    clearCards();
    const inputField = document.querySelector('#inputField').value;
    if (inputField == "") {
        spinnerVisibility(false);
        alert("Input field cannot be empty!")
    }
    else {
        const url = `https://api.lyrics.ovh/suggest/${inputField}`;
        const res = await fetch(url);
        const data = await res.json();
        loadData(data.data);
    }
}
const loadData = data => {
    spinnerVisibility(false);
    buttonIdCount = 0;
    console.log(data);
    if (data.length == 0) {
        spinnerVisibility(false);
        document.getElementById('not-found').style.display = 'block';
    }
    else {
        for (let i = 0; i < data.length; i++) {
            const parentNode = document.getElementById('musicCard');
            const childNode = document.createElement('div');
            childNode.className = 'single-result row align-items-center my-3 p-3';
            const childElements = `
            <div class="col-md-2">
                <img src="${data[i].artist.picture_small}">
            </div>
            <div class="col-md-5">
                <h3 class="lyrics-name">${data[i].title}</h3>
                <p class="author lead">Album by <span>${data[i].artist.name}</span></p>
            </div>
            <div class="col-md-5 text-md-right text-center">
                <button 
                    onclick = "{setAudioPreview('${data[i].preview}', this.id)}" 
                    type="button"
                    class="btn btn-primary margin-right"
                    id = "${buttonIdCount++}">
                    Play
                </button>
                <button onclick = "lyricButton('${data[i].artist.name}', '${data[i].title}')" 
                    class="btn btn-success">
                    Get Lyrics
                </button>
            </div>
            `;
            childNode.innerHTML = childElements;
            parentNode.appendChild(childNode);
        }
    }


}
const clearCards = () => {
    document.getElementById('musicCard').innerHTML = '';
    document.getElementById('single-lyrics').innerText = '';
    document.querySelector('#audioId').pause();
}
const lyricButton = (name, title) => {
    spinnerVisibility(true);
    const url = `https://api.lyrics.ovh/v1/${name}/${title}`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            spinnerVisibility(false);
            document.getElementById('single-lyrics').innerText = data.lyrics;
        })
}
const setAudioPreview = (preview, id) => {
    clearAllOtherButton(id);
    const buttonId = document.getElementById(id);
    let audioTag = document.querySelector('#audioId');
    if (buttonId.innerText == "Play") {
        buttonId.innerText = "Pause"
        audioTag.src = preview;
        audioTag.play();
    }
    else {
        buttonId.innerText = "Pause";
        buttonId.innerText = "Play";
        audioTag.pause();
    }

}
const clearAllOtherButton = exceptId => {
    for (let i = 0; i < buttonIdCount; i++) {
        if (i != exceptId) {
            document.getElementById(i).innerText = 'Play';
        }
    }
}
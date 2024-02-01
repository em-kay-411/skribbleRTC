function createVideoDiv(video, name) {
    video.name = name;   
    video.style.height = '40vh'

    const label = document.createElement('label');
    label.setAttribute('for', 'name');
    label.textContent = `${name}`;

    const videoDiv = document.createElement('div');
    videoDiv.className = 'video'

    videoDiv.append(label);
    videoDiv.append(video);

    return videoDiv;
}
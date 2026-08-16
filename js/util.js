// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
export function getYoutubeIdFromUrl(url) {
    if (!url) return '';
    return url.match(
        /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,
    )?.[1] ?? '';
}

export function embed(video) {
    if (!video) return '';
    // Check if it's a Medal.tv URL
    if (video.includes('medal.tv')) {
        const clipId = getMedalIdFromUrl(video);
        return clipId ? embedMedal(clipId) : video;
    }
    // Default to YouTube
    return `https://www.youtube.com/embed/${getYoutubeIdFromUrl(video)}`;
}

export function localize(num) {
    return num.toLocaleString(undefined, { minimumFractionDigits: 3 });
}

export function getThumbnailFromId(id) {
    if (!id) return '/SDL_logo.png';
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

export function getVideoThumbnail(url) {
    if (!url) return '/SDL_logo.png';
    if (url.includes('medal.tv')) {
        return '/SDL_logo.png';
    }
    const ytId = getYoutubeIdFromUrl(url);
    return ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : '/SDL_logo.png';
}

// Medal.tv URL parsing - extracts clipId from Medal.tv URLs
export function getMedalIdFromUrl(url) {
    if (!url) return '';
    const match = url.match(/medal\.tv\/clip\/([^/]+)/);
    return match ? match[1] : '';
}

// Generate Medal.tv embed URL
export function embedMedal(clipId) {
    return `https://medal.tv/clip/${clipId}?embed=true`;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

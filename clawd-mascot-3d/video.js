const wideVideo = matchMedia('(min-width: 800px) and (pointer: fine)');

for (const frame of document.querySelectorAll('.video-frame')) {
  const video = frame.querySelector('video');
  const start = frame.querySelector('.video-start');
  const label = start.querySelector('.video-start-label');
  const status = frame.nextElementSibling;
  let attempt = 0;
  let timer;

  function showFailure(currentAttempt) {
    if (currentAttempt !== attempt) return;
    attempt++;
    clearTimeout(timer);
    video.pause();
    label.textContent = 'Retry playback';
    start.hidden = false;
    start.disabled = false;
    status.textContent = 'Playback couldn’t start. Try the direct video link below.';
  }

  start.hidden = false;
  start.addEventListener('click', () => {
    const currentAttempt = ++attempt;
    if (currentAttempt === 1 && wideVideo.matches) video.src = video.dataset.wideSrc;
    else if (currentAttempt > 1) video.load();
    label.textContent = 'Loading video…';
    status.textContent = '';
    start.disabled = true;
    timer = setTimeout(() => showFailure(currentAttempt), 15000);
    video.play().catch(() => showFailure(currentAttempt));
  });

  video.addEventListener('playing', () => {
    clearTimeout(timer);
    start.hidden = true;
    start.disabled = false;
    status.textContent = '';
  });

  video.addEventListener('error', () => {
    if (attempt) showFailure(attempt);
  });
}

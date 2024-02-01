function startTimer(drawtime) {
    let timeLeft = drawtime;

    function updateTimer() {
        timer.innerHTML = `<i class="fa fa-clock-o"></i>${timeLeft}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            if (writing) {
                writing = false;
                guess.disabled = false;                
                console.log('disabled writing');
                socket.emit('switch-turn');
            }
            word.innerHTML = '';

        }
    }

    const timerInterval = setInterval(() => {
        updateTimer();
    }, 1000);
}


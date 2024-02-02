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
                // console.log('disabled writing');
                socket.emit('switch-turn');
            }
            word.innerHTML = '';

        }
    }

    socket.on('all-answer-interrupt-writer', () => {
        clearInterval(timerInterval);
        writing = false;
        guess.disabled = false;
        // console.log('all-answer-interrupt-writer');
        socket.emit('switch-turn');
        word.innerHTML = '';
    })


    socket.on('all-answer-interrupt-guesser', () => {
        clearInterval(timerInterval);
        // console.log('all-answer-interrupt-guesser');
        writing = false;
        word.innerHTML = '';
    })

    const timerInterval = setInterval(() => {
        updateTimer();
    }, 1000);
}


// App State
const state = {
    currentMode: null,
    currentValue: 0,
    currentAnswer: '',
    score: 0,
    streak: 0,
    modes: {
        'dec-bin': { name: 'Decimal to Binary', from: 10, to: 2, label: 'Convert to Binary:' },
        'bin-dec': { name: 'Binary to Decimal', from: 2, to: 10, label: 'Convert to Decimal:' },
        'dec-hex': { name: 'Decimal to Hex', from: 10, to: 16, label: 'Convert to Hexadecimal:' },
        'hex-dec': { name: 'Hex to Decimal', from: 16, to: 10, label: 'Convert to Decimal:' },
        'bin-hex': { name: 'Binary to Hex', from: 2, to: 16, label: 'Convert to Hexadecimal:' },
        'bin-add': { name: 'Binary Addition', from: 2, to: 2, label: 'Calculate result in Binary:' },
        'bin-sub': { name: 'Binary Subtraction', from: 2, to: 2, label: 'Calculate result in Binary:' },
        'hex-add': { name: 'Hex Addition', from: 16, to: 16, label: 'Calculate result in Hex:' },
        'hex-sub': { name: 'Hex Subtraction', from: 16, to: 16, label: 'Calculate result in Hex:' },
        'twos-comp': { name: "Two's Complement", from: 2, to: 2, label: "Find the Two's Complement (Binary):" }
    }
};

// DOM Elements
const dashboard = document.getElementById('dashboard');
const practiceView = document.getElementById('practice-view');
const modeGrid = document.querySelector('.modes-grid');
const currentModeName = document.getElementById('current-mode-name');
const scoreDisplay = document.getElementById('score');
const streakDisplay = document.getElementById('streak');
const questionLabel = document.getElementById('question-label');
const questionValue = document.getElementById('question-value');
const answerInput = document.getElementById('answer-input');
const checkBtn = document.getElementById('check-btn');
const skipBtn = document.getElementById('skip-btn');
const exitBtn = document.getElementById('exit-practice');
const feedbackText = document.getElementById('feedback-text');

// Init
modeGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.mode-card');
    if (card) {
        startPractice(card.id);
    }
});

exitBtn.addEventListener('click', () => {
    dashboard.style.display = 'grid';
    practiceView.style.display = 'none';
    state.currentMode = null;
});

checkBtn.addEventListener('click', validateAnswer);

answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') validateAnswer();
});

skipBtn.addEventListener('click', () => {
    generateQuestion();
    answerInput.focus();
});

function startPractice(modeId) {
    state.currentMode = modeId;
    dashboard.style.display = 'none';
    practiceView.style.display = 'block';
    currentModeName.textContent = state.modes[modeId].name;
    questionLabel.textContent = state.modes[modeId].label;

    generateQuestion();
    answerInput.value = '';
    answerInput.focus();
}

function generateQuestion() {
    feedbackText.textContent = '';
    feedbackText.className = 'feedback';
    answerInput.value = '';

    const mode = state.modes[state.currentMode];

    // Difficulty scaling based on streak
    // Level 1: streak 0-2 (small numbers)
    // Level 2: streak 3-6 (medium numbers)
    // Level 3: streak 7+ (large numbers)
    const level = Math.min(Math.floor(state.streak / 3) + 1, 3);
    const range = level === 1 ? 32 : (level === 2 ? 256 : 4096);

    if (state.currentMode === 'bin-add') {
        const n1 = Math.floor(Math.random() * range);
        const n2 = Math.floor(Math.random() * range);
        state.currentValue = n1 + n2;
        questionValue.textContent = `${n1.toString(2)} + ${n2.toString(2)}`;
        state.currentAnswer = (n1 + n2).toString(2);
        return;
    }

    if (state.currentMode === 'bin-sub') {
        const n1 = Math.floor(Math.random() * range) + (range / 2);
        const n2 = Math.floor(Math.random() * (range / 2));
        state.currentValue = n1 - n2;
        questionValue.textContent = `${n1.toString(2)} - ${n2.toString(2)}`;
        state.currentAnswer = (n1 - n2).toString(2);
        return;
    }

    if (state.currentMode === 'hex-add') {
        const n1 = Math.floor(Math.random() * range);
        const n2 = Math.floor(Math.random() * range);
        questionValue.textContent = `${n1.toString(16).toUpperCase()} + ${n2.toString(16).toUpperCase()}`;
        state.currentAnswer = (n1 + n2).toString(16).toUpperCase();
        return;
    }

    if (state.currentMode === 'hex-sub') {
        const n1 = Math.floor(Math.random() * range) + (range / 2);
        const n2 = Math.floor(Math.random() * (range / 2));
        questionValue.textContent = `${n1.toString(16).toUpperCase()} - ${n2.toString(16).toUpperCase()}`;
        state.currentAnswer = (n1 - n2).toString(16).toUpperCase();
        return;
    }

    if (state.currentMode === 'twos-comp') {
        // Bit length also scales with level: 4-bit, 8-bit, 12-bit
        const bits = level === 1 ? 4 : (level === 2 ? 8 : 12);
        const maxVal = Math.pow(2, bits);

        // Random binary string
        const num = Math.floor(Math.random() * maxVal);
        const binaryStr = num.toString(2).padStart(bits, '0');

        // Display binary string
        questionValue.textContent = binaryStr;

        // Calculate Two's Complement: 1. Flip bits (NOT) 2. Add 1 (equivalent to 2^bits - num)
        const resultVal = (maxVal - num) % maxVal;
        state.currentAnswer = resultVal.toString(2).padStart(bits, '0');
        return;
    }

    // Standard conversions
    const num = Math.floor(Math.random() * range) + 1;

    switch (state.currentMode) {
        case 'dec-bin':
            questionValue.textContent = num.toString(10);
            state.currentAnswer = num.toString(2);
            break;
        case 'bin-dec':
            questionValue.textContent = num.toString(2);
            state.currentAnswer = num.toString(10);
            break;
        case 'dec-hex':
            questionValue.textContent = num.toString(10);
            state.currentAnswer = num.toString(16).toUpperCase();
            break;
        case 'hex-dec':
            questionValue.textContent = num.toString(16).toUpperCase();
            state.currentAnswer = num.toString(10);
            break;
        case 'bin-hex':
            questionValue.textContent = num.toString(2);
            state.currentAnswer = num.toString(16).toUpperCase();
            break;
    }
}

function validateAnswer() {
    const userAns = answerInput.value.trim().toUpperCase();
    const correctAns = state.currentAnswer.toUpperCase();

    if (userAns === correctAns) {
        showFeedback(true);
        state.score += 10 + (state.streak * 2);
        state.streak++;
        setTimeout(generateQuestion, 1000);
    } else {
        showFeedback(false);
        state.streak = 0;
        answerInput.classList.add('shake');
        setTimeout(() => answerInput.classList.remove('shake'), 500);
    }

    updateStats();
}

function showFeedback(isCorrect) {
    feedbackText.textContent = isCorrect ? '✨ Correct! Perfect logic.' : `❌ Not quite. The correct answer was ${state.currentAnswer}`;
    feedbackText.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
}

function updateStats() {
    scoreDisplay.textContent = state.score;
    streakDisplay.textContent = state.streak;
}

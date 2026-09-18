const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton.addEventListener("click", () => {

    const isOpen = navLinks.classList.toggle("active");

    menuButton.setAttribute("aria-expanded", isOpen);

    menuButton.textContent = isOpen ? "✕" : "☰";
});

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        menuButton.setAttribute("aria-expanded", "false");

        menuButton.textContent = "☰";
    });

});


// ========================================
// QUIZ
// ========================================

const questions = [
    {
        question: "Qual destes é um exemplo de jogo de estratégia?",
        answers: [
            "Jogo de corrida",
            "Jogo de estratégia por turnos",
            "Jogo musical",
            "Jogo de dança"
        ],
        correct: 1
    },

    {
        question: "Qual habilidade pode ser estimulada por determinados jogos?",
        answers: [
            "Raciocínio lógico",
            "Somente velocidade física",
            "Apenas memorização",
            "Nenhuma habilidade"
        ],
        correct: 0
    },

    {
        question: "O que caracteriza um jogo educativo?",
        answers: [
            "Não possuir regras",
            "Ser obrigatoriamente digital",
            "Utilizar elementos de jogos com finalidade de aprendizagem",
            "Ser sempre jogado sozinho"
        ],
        correct: 2
    },

    {
        question: "Qual atitude ajuda a manter uma relação equilibrada com os jogos?",
        answers: [
            "Jogar sem pausas",
            "Deixar de dormir para jogar",
            "Equilibrar o tempo de jogo com outras atividades",
            "Não realizar nenhuma outra atividade"
        ],
        correct: 2
    },

    {
        question: "Qual destas atividades pode envolver cooperação?",
        answers: [
            "Um jogo multiplayer cooperativo",
            "Somente jogos individuais",
            "Nenhuma atividade relacionada a jogos",
            "Apenas jogos sem regras"
        ],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("nextButton");
const questionNumber = document.getElementById("questionNumber");
const progressBar = document.getElementById("progressBar");

function loadQuestion() {

    const question = questions[currentQuestion];

    answered = false;

    questionElement.textContent = question.question;

    questionNumber.textContent =
        `Pergunta ${currentQuestion + 1} de ${questions.length}`;

    progressBar.style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    answersElement.innerHTML = "";

    nextButton.disabled = true;

    nextButton.textContent =
        currentQuestion === questions.length - 1
            ? "Ver resultado"
            : "Próxima pergunta";

    question.answers.forEach((answer, index) => {

        const button = document.createElement("button");

        button.className = "answer";

        button.textContent = answer;

        button.addEventListener("click", () => {
            selectAnswer(button, index);
        });

        answersElement.appendChild(button);
    });
}

function selectAnswer(button, selectedIndex) {

    if (answered) return;

    answered = true;

    const correctIndex = questions[currentQuestion].correct;

    const buttons = document.querySelectorAll(".answer");

    buttons.forEach((item, index) => {

        item.disabled = true;

        if (index === correctIndex) {
            item.classList.add("correct");
        }
    });

    if (selectedIndex === correctIndex) {

        score++;

    } else {

        button.classList.add("wrong");
    }

    nextButton.disabled = false;
}

nextButton.addEventListener("click", () => {

    if (!answered) return;

    currentQuestion++;

    if (currentQuestion < questions.length) {

        loadQuestion();

    } else {

        showResult();
    }
});

// ========================================
// MINIJOGOS
// ========================================

const ticTacToeCells = document.querySelectorAll("[data-cell]");
const ticTacToeStatus = document.getElementById("ticTacToeStatus");
let ticTacToeBoard = Array(9).fill("");
let ticTacToeActive = true;

function getWinner(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return lines.find(([first, second, third]) =>
        board[first] && board[first] === board[second] && board[first] === board[third]
    );
}

function playTicTacToe(event) {
    const cell = Number(event.currentTarget.dataset.cell);

    if (!ticTacToeActive || ticTacToeBoard[cell]) return;

    ticTacToeBoard[cell] = "X";
    event.currentTarget.textContent = "X";
    event.currentTarget.classList.add("x");

    if (getWinner(ticTacToeBoard) || ticTacToeBoard.every(Boolean)) {
        finishTicTacToe();
        return;
    }

    ticTacToeStatus.textContent = "Vez do computador...";
    ticTacToeActive = false;

    window.setTimeout(() => {
        const available = ticTacToeBoard
            .map((value, index) => value ? null : index)
            .filter(index => index !== null);
        const computerCell = available[Math.floor(Math.random() * available.length)];

        ticTacToeBoard[computerCell] = "O";
        ticTacToeCells[computerCell].textContent = "O";
        ticTacToeCells[computerCell].classList.add("o");
        ticTacToeActive = true;

        if (getWinner(ticTacToeBoard) || ticTacToeBoard.every(Boolean)) {
            finishTicTacToe();
        } else {
            ticTacToeStatus.textContent = "Sua vez: você joga com X.";
        }
    }, 350);
}

function finishTicTacToe() {
    ticTacToeActive = false;
    const winner = getWinner(ticTacToeBoard);

    ticTacToeStatus.textContent = winner
        ? `Fim de jogo: ${ticTacToeBoard[winner[0]] === "X" ? "você venceu!" : "o computador venceu."}`
        : "Fim de jogo: empate!";
}

function resetTicTacToe() {
    ticTacToeBoard = Array(9).fill("");
    ticTacToeActive = true;
    ticTacToeStatus.textContent = "Sua vez: você joga com X.";
    ticTacToeCells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o");
    });
}

ticTacToeCells.forEach(cell => cell.addEventListener("click", playTicTacToe));
document.getElementById("ticTacToeReset").addEventListener("click", resetTicTacToe);

const rpsStatus = document.getElementById("rpsStatus");
const rpsScore = document.getElementById("rpsScore");
let playerWins = 0;
let computerWins = 0;
const rpsOptions = ["pedra", "papel", "tesoura"];

document.querySelectorAll("[data-choice]").forEach(button => {
    button.addEventListener("click", () => {
        const playerChoice = button.dataset.choice;
        const computerChoice = rpsOptions[Math.floor(Math.random() * rpsOptions.length)];
        const winsAgainst = { pedra: "tesoura", papel: "pedra", tesoura: "papel" };

        if (playerChoice === computerChoice) {
            rpsStatus.textContent = `Empate! Os dois escolheram ${computerChoice}.`;
        } else if (winsAgainst[playerChoice] === computerChoice) {
            playerWins++;
            rpsStatus.textContent = `Você venceu! O computador escolheu ${computerChoice}.`;
        } else {
            computerWins++;
            rpsStatus.textContent = `O computador venceu: escolheu ${computerChoice}.`;
        }

        rpsScore.textContent = `Você ${playerWins} × ${computerWins} Computador`;
    });
});

const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const guessStatus = document.getElementById("guessStatus");
let secretNumber = Math.floor(Math.random() * 20) + 1;
let guessesLeft = 5;

function checkGuess() {
    const guess = Number(guessInput.value);

    if (guess < 1 || guess > 20 || !guess) {
        guessStatus.textContent = "Digite um número entre 1 e 20.";
        return;
    }

    guessesLeft--;

    if (guess === secretNumber) {
        guessStatus.textContent = `Acertou! O número era ${secretNumber}.`;
        guessButton.disabled = true;
    } else if (!guessesLeft) {
        guessStatus.textContent = `Suas tentativas acabaram. Era ${secretNumber}.`;
        guessButton.disabled = true;
    } else {
        const hint = guess < secretNumber ? "maior" : "menor";
        guessStatus.textContent = `Tente um número ${hint}. Restam ${guessesLeft} tentativas.`;
    }

    guessInput.value = "";
    guessInput.focus();
}

function resetGuess() {
    secretNumber = Math.floor(Math.random() * 20) + 1;
    guessesLeft = 5;
    guessButton.disabled = false;
    guessInput.value = "";
    guessStatus.textContent = "Você tem 5 tentativas.";
    guessInput.focus();
}

guessButton.addEventListener("click", checkGuess);
guessInput.addEventListener("keydown", event => {
    if (event.key === "Enter") checkGuess();
});
document.getElementById("guessReset").addEventListener("click", resetGuess);

function showResult() {

    const percentage =
        Math.round((score / questions.length) * 100);

    let message;

    if (percentage === 100) {
        message = "Excelente! Você acertou tudo. 🏆";
    } else if (percentage >= 60) {
        message = "Muito bem! Você conhece bastante sobre jogos. 🎮";
    } else {
        message = "Continue explorando o conteúdo para aprender mais! 🚀";
    }

    document.getElementById("quizBox").innerHTML = `
        <div style="text-align:center; padding:20px 0">

            <div style="font-size:4rem; margin-bottom:15px">
                ${percentage >= 60 ? "🏆" : "🎮"}
            </div>

            <h3 style="font-size:2rem">
                ${score} de ${questions.length} respostas corretas
            </h3>

            <p style="
                color:#a5a9b5;
                margin:15px auto 25px;
                max-width:500px;
            ">
                ${message}
            </p>

            <button
                class="button primary"
                id="restartQuiz"
            >
                Refazer quiz
            </button>

        </div>
    `;

    document.getElementById("restartQuiz").addEventListener("click", () => {
        currentQuestion = 0;
        score = 0;
        document.getElementById("quizBox").innerHTML = `
            <div class="quiz-progress">
                <span id="questionNumber">Pergunta 1 de ${questions.length}</span>
                <div class="progress"><div id="progressBar"></div></div>
            </div>
            <h3 id="question"></h3>
            <div class="answers" id="answers"></div>
            <button class="button primary quiz-button" id="nextButton" disabled>
                Próxima pergunta
            </button>
        `;
        window.location.hash = "quiz";
        window.location.reload();
    });
}


loadQuestion();

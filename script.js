document.addEventListener('DOMContentLoaded', function () {
    const setupForm = document.getElementById('setupForm');
    const gameBoard = document.getElementById('gameBoard');
    const scoreBoard = document.getElementById('scoreBoard');

    let players = [];
    let gridSize = '4x4';

    let cardsData = [];

    // Cargar JSON en memoria
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            cardsData = data;
            // Aquí puedes llamar a otras funciones que dependan de estos datos
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));



    setupForm.addEventListener('submit', function (e) {
        console.log("Iniciamos el juego...");
        e.preventDefault();

        // Limpiar jugadores anteriores y tablero de juego
        players = [];
        gameBoard.innerHTML = '';

        // Obtener configuración del formulario
        gridSize = document.getElementById('gridSize').value;
        const numPlayers = document.getElementById('numPlayers').value;

        // Inicializar jugadores
        for (let i = 1; i <= numPlayers; i++) {
            players.push({ id: i, score: 0 });
        }

        // Inicializar tablero de juego
        initGameBoard(gridSize, cardsData);

        // Inicializar tablero de puntuaciones
        updateScoreBoard();
    });

    function initGameBoard(size, cards) {
        const [rows, cols] = size.split('x').map(Number);
        const totalCards = rows * cols;


        // Eliminar clases anteriores de Tailwind (si las hay)
        gameBoard.className = '';

        // Añadir clases de Tailwind para el diseño de la cuadrícula
        gameBoard.classList.add('grid', 'gap-4', `grid-cols-${cols}`);

        // Ajustar el ancho del contenedor del tablero de juego
        gameBoard.style.width = `${cols * 100}px`; // Ajusta este valor según el tamaño de tus cartas

        // Mezclar las cartas
        const shuffledCards = shuffleArray(cards).slice(0, totalCards / 2);

        // Duplicar las cartas para hacer pares
        const cardPairs = [...shuffledCards, ...shuffledCards];

        // Mezclar las cartas de nuevo
        const finalShuffledCards = shuffleArray(cardPairs);

        // Crear cartas y añadirlas a gameBoard
        for (let i = 0; i < totalCards; i++) {
            const card = document.createElement('div');
            card.className = 'card relative transform transition-transform duration-500 ease-in-out bg-gray-300 hover:bg-gray-400 p-2 m-2 rounded w-32 h-40'; // Tailwind classes
            card.dataset.id = i;
            card.dataset.matchId = finalShuffledCards[i].id;

            const cardFront = document.createElement('div');
            cardFront.className = 'absolute w-full h-full backface-hidden';
            cardFront.innerHTML = `<img src="${finalShuffledCards[i].image}" alt="${finalShuffledCards[i].text}" class="max-w-full max-h-2/3 object-cover rounded">
                               <span class="mt-2 text-sm">${finalShuffledCards[i].text}</span>`;

            const cardBack = document.createElement('div');
            cardBack.className = 'absolute w-full h-full backface-hidden rotate-y-180';  // Aquí se añade la clase

            cardBack.innerHTML = '<span class="text-xl">?</span>';
            card.appendChild(cardFront);
            card.appendChild(cardBack);
            card.addEventListener('click', handleCardClick);
            gameBoard.appendChild(card);
        }
    }



    // Función para mezclar un array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    let selectedCards = [];

    function handleCardClick(e) {
        const card = e.currentTarget;
        console.log(card.dataset)
        const cardId = card.dataset.id;
        const matchId = card.dataset.matchId;

        // Voltear la tarjeta
        card.classList.toggle('rotate-y-180');

        // Reproducir audio
        const audio = new Audio('https://res.cloudinary.com/dcxto1nnl/video/upload/v1687018382/academy-app/palabras/2023-06-16/such_emqajk.mp3');
        audio.play();

        // Añadir la tarjeta seleccionada al array
        selectedCards.push({ card, cardId, matchId });

        // Verificar si hay dos cartas seleccionadas
        if (selectedCards.length === 2) {
            // Comparar las cartas
            if (selectedCards[0].matchId === selectedCards[1].matchId && selectedCards[0].cardId !== selectedCards[1].cardId) {
                // Las cartas coinciden, añadir lógica para manejar esto (p.ej., sumar puntos)
                console.log("Match!");
            } else {
                // Las cartas no coinciden, voltearlas de nuevo
                setTimeout(() => {
                    selectedCards.forEach(selectedCard => {
                        selectedCard.card.classList.toggle('rotate-y-180');
                    });
                }, 1000); // 1 segundo de demora antes de voltearlas de nuevo
            }

            // Limpiar el array de cartas seleccionadas
            selectedCards = [];
        }
    }




    function updateScoreBoard() {
        // Actualizar scoreBoard con los puntos de los jugadores
        // ...
    }
});

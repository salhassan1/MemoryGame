document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchedPairs = 0;
    const totalPairs = cards.length / 2;
    
    //Gérer le retournement des cartes
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            // Premier clic
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        // Deuxième clic
        secondCard = this;
        checkForMatch();
    }

    //Vérifie si les deux cartes retournées sont identiques
    function checkForMatch() {
        let isMatch = firstCard.dataset.card === secondCard.dataset.card;
        isMatch ? disableCards() : unflipCards();
    }

    //Désactive les cartes qui ont été trouvées
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedPairs++;
        
        if (matchedPairs === totalPairs) {
            setTimeout(showVictoryPopup, 500);
        }
        
        resetBoard();
    }

    //Retourner les cartes qui ne correspondent pas
    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1500);
    }

    //Réinitialiser les variables pour le prochain tour
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    //Afficher la fenêtre popup de victoire
    function showVictoryPopup() {
        const popup = document.createElement('div');
        popup.className = 'victory-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <h2>Félicitations !</h2>
                <p>Vous avez gagné la partie !</p>
                <button id="restart-button">Nouvelle Partie</button>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('restart-button').addEventListener('click', () => {
            matchedPairs = 0;
            cards.forEach(card => {
                card.classList.remove('flipped');
                card.addEventListener('click', flipCard);
            });
            shuffle();
            popup.remove();
        });
    }

    //Mélanger les cartes 
    function shuffle() {
        cards.forEach(card => {
            let randomPos = Math.floor(Math.random() * cards.length);
            card.style.order = randomPos;
        });
    }

    shuffle();
    cards.forEach(card => card.addEventListener('click', flipCard));
});

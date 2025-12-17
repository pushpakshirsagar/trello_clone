const statusColumn = [
    { id: 1, columnStatus: "To Do", totalCard: 2 },
    { id: 2, columnStatus: "In-Progress", totalCard: 0 },
    { id: 3, columnStatus: "Done", totalCard: 0 }
];

let draggedCard = null;

window.onload = function () {

    const addCardToColumn = (colId) => {
        let cardContainer = document.getElementById('listCardContent' + colId);
        let cardCnt = cardContainer.getElementsByClassName('card-data').length;

        let card = document.createElement('div');
        card.textContent = `Card ${cardCnt + 1}`;
        card.classList.add('card-data');
        card.draggable = true;

        card.addEventListener('dragstart', dragStartHandler);
        card.addEventListener('dragend', dragEndHandler);

        cardContainer.appendChild(card);
        cardContainer.scrollTop = cardContainer.scrollHeight;
    };

    const dragStartHandler = (e) => {
        draggedCard = e.target;
        e.dataTransfer.effectAllowed = "move";
        e.target.classList.add('dragging');
    };

    const dragEndHandler = (e) => {
        e.target.classList.remove('dragging');
        draggedCard = null;
    };

    const allowDrop = (e) => {
        e.preventDefault();
    };

    const dropHandler = (e) => {
        e.preventDefault();
        if (draggedCard) {
            e.currentTarget.appendChild(draggedCard);
        }
    };

    let columnContainer = document.getElementById("columnContainer");

    statusColumn.map((obj) => {
        let card = document.createElement('div');
        card.classList.add('card');

        let cardHtml = `
            <div class='card-header'>
                <div class='card-header-text'>${obj.columnStatus}</div>
                <div class='card-header-right'><button>...</button></div>
            </div>
            <div class='card-content'
                id='listCardContent${obj.id}'
                ondragover="event.preventDefault()">
            </div>
        `;
        card.innerHTML = cardHtml;

        let contentArea = card.querySelector('.card-content');
        contentArea.addEventListener('dragover', allowDrop);
        contentArea.addEventListener('drop', dropHandler);
        contentArea.scrollTop = contentArea.scrollHeight;
        let addCard = document.createElement('button');
        addCard.textContent = '+ add a card';
        addCard.classList.add('card-footer');
        addCard.addEventListener('click', () => addCardToColumn(obj.id));

        card.appendChild(addCard);
        columnContainer.appendChild(card);
    });
};

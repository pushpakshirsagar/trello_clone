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

    const getDragAfterElement = (container, y) => {
        const draggableElements = [
            ...container.querySelectorAll('.card-data:not(.dragging)')
        ];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    };
    const dragOverHandler = (e) => {
        e.preventDefault();

        const container = e.currentTarget;
        const afterElement = getDragAfterElement(container, e.clientY);

        if (!draggedCard) return;

        if (afterElement == null) {
            container.appendChild(draggedCard);
        } else {
            container.insertBefore(draggedCard, afterElement);
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
        contentArea.addEventListener('dragover', dragOverHandler);

        contentArea.scrollTop = contentArea.scrollHeight;
        let addCard = document.createElement('button');
        addCard.textContent = '+ add a card';
        addCard.classList.add('card-footer');
        addCard.addEventListener('click', () => addCardToColumn(obj.id));

        card.appendChild(addCard);
        columnContainer.appendChild(card);
    });
};

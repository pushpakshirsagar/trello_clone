let trelloCardDetails = [
    {
        id: 1, columnStatus: "To Do", totalCard: 2,
        tasks: [
            {
                id: 1,
                title: 'functionality one',
                descriptin: 'Test'
            }
        ]
    },
    { id: 2, columnStatus: "In-Progress", totalCard: 0 },
    { id: 3, columnStatus: "Done", totalCard: 0 }
];

let draggedCard = null;
let activeColumnId = null;
let editTaskId = null;
const updateTrelloDetailsObj = (taskDetails,edit=false) => {
    trelloCardDetails = trelloCardDetails.map(col => {
        if (col.id === activeColumnId) {
            return {
                ...col,
                tasks:col.tasks?.map((task)=>{
                    if(task.id === taskDetails.id && edit){
                        return {...task, title: taskDetails.title, descriptin: taskDetails.descriptin}
                    }
                    else{
                        [...(col.tasks || []), taskDetails]
                    }
                }) || [...(col.tasks || []), taskDetails] ,
                totalCard: (col.totalCard || 0) + 1
            };
        }
        return col;
    });
    console.log(trelloCardDetails)
    localStorage.setItem('trelloCardDetails',JSON.stringify(trelloCardDetails))
}
window.onload = function () {

    document.getElementById('saveCard').addEventListener('click', () => {
        let cardContainer = document.getElementById('listCardContent' + activeColumnId);
        let cardCnt = cardContainer.getElementsByClassName('card-data').length;
        let taskName = document.getElementById('card_title').value;
        let taskDesc = document.getElementById('card_desc').value;
        let taskDetails = { id: cardCnt, title: taskName, descriptin: taskDesc }

        if(editTaskId !== null){
            taskDetails = { id: editTaskId, title: taskName, descriptin: taskDesc }
            updateTrelloDetailsObj(taskDetails,true);
              const card = document.querySelector(`[data-task-id='${editTaskId}']`);
            if (card) {
                card.querySelector('.card-title').textContent = taskName;
                card.querySelector('.card-description').textContent = taskDesc;
            }
            editTaskId=null;
        }else{
        updateTrelloDetailsObj(taskDetails);
        card = createCard(taskDetails, activeColumnId)
        cardContainer.appendChild(card);
        cardContainer.scrollTop = cardContainer.scrollHeight;
        }
       
        document.getElementById('card_title').value='';
        document.getElementById('card_desc').value='';
        document.getElementById('card_modal').classList.add('hide');
    });

    const createCard = (t, colId) => {
        let card = document.createElement('div');
        let cardTextContent = `<div class='card-details'><div class='card-title' id=${colId}${t.id}title>${t.title}</div><div class='card-description' id=${colId}${t.id}desc>${t.descriptin}</div></div><button class='task-edit'><i class="fa fa-pencil" aria-hidden="true"></i>
</button>`
        card.dataset.taskId = t.id;
        card.dataset.columnId = colId;
        card.innerHTML = cardTextContent;
        card.classList.add('card-data');
        card.draggable = true;

        card.addEventListener('dragstart', dragStartHandler);
        card.addEventListener('dragend', dragEndHandler);
        card.querySelector('.task-edit').addEventListener('click',()=>{
            activeColumnId=colId;
            editTaskId = t.id;
            let trellodata = JSON.parse(localStorage.getItem('trelloCardDetails'));
            const taskData = trellodata.find(column => column.id === activeColumnId)?.tasks.find(task => task.id === t.id);
            console.log(taskData);
            
            document.getElementById('card_title').value = taskData.title;
            document.getElementById('card_desc').value = taskData.descriptin;
            document.getElementById('card_modal').classList.remove('hide');

        })
        return card;
    }
    const addCardToColumn = (colId) => {
        activeColumnId = colId;
        document.getElementById('card_modal').classList.remove('hide');
    };

 const dragStartHandler = (e) => {
    console.log('start');
    
    draggedCard = e.target;

    draggedCard.dataset.sourceColumnId =
        draggedCard.dataset.columnId;

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

    
    const dropHandler = (e) => {
    e.preventDefault();
    const targetColumnId = Number(
        e.currentTarget.id.replace('listCardContent', '')
    );
    if (!draggedCard) return;
    // if (sourceColumnId === targetColumnId) return;

    const taskId = Number(draggedCard.dataset.taskId);
    const sourceColumnId = Number(draggedCard.dataset.columnId);
    draggedCard.dataset.columnId = targetColumnId;

    updateTrelloOnDrag(taskId, sourceColumnId, targetColumnId);
};

    const updateTrelloOnDrag = (taskId, fromColId, toColId) => {
    let movedTask = null;

    console.log(taskId,fromColId,toColId);
    
    let newtrelloCardDetails = trelloCardDetails.map(col => {
        if (col.id === fromColId) {
            const remainTasks = (col.tasks || []).filter(t => {
                if (t.id === taskId) {
                    movedTask = t;
                    return false;
                }
                return true;
            });

            return {
                ...col,
                tasks: remainTasks || [],
                totalCard: remainTasks.length
            };
        }

        if (col.id === toColId) {
            return {
                ...col,
                tasks: [...(col.tasks || []), movedTask],
                totalCard: (col.totalCard || 0) + 1
            };
        }

        return col;
    });

    console.log(newtrelloCardDetails)
    localStorage.setItem('trelloCardDetails',JSON.stringify(newtrelloCardDetails))
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
    let trellodata = JSON.parse(localStorage.getItem('trelloCardDetails'));
    if(!trellodata) trellodata = trelloCardDetails;
    trellodata.map((obj) => {
        let card = document.createElement('div');
        card.classList.add('card');

        let cardHtml = `
            <div class='card-header'>
                <div class='card-header-text'>${obj.columnStatus}</div>
                <div class='card-header-right'><button>...</button></div>
            </div>
            <div class='card-content' id='listCardContent${obj.id}'</div>
        `;

        card.innerHTML = cardHtml;

        let contentArea = card.querySelector('.card-content');
        contentArea.addEventListener('dragover', dragOverHandler);
        contentArea.addEventListener('drop', dropHandler);


        if (obj.tasks?.length) {
            obj.tasks.forEach((t) => {
                const taskCard = createCard(t, obj.id);
                contentArea.appendChild(taskCard);
            });
        }
        contentArea.scrollTop = contentArea.scrollHeight;
        let addCard = document.createElement('button');
        addCard.textContent = '+ add a card';
        addCard.classList.add('card-footer');
        addCard.addEventListener('click', () => addCardToColumn(obj.id));

        card.appendChild(addCard);
        columnContainer.appendChild(card);
    });
};

const closeModal = () => {
    document.getElementById('card_modal').classList.add('hide');
}


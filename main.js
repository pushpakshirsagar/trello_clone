const statusColumn = [
    {
        id: 1,
        columnStatus: "To Do",
        totalCard: 2,


    },
    {
        id: 2,
        columnStatus: "In-Progress",
        totalCard: 0,
    },
    {
        id: 3,
        columnStatus: "Done",
        totalCard: 0,
    }
]

window.onload = function () {

    const addCardToColumn = (colId)=>{
        console.log(colId);
        let cardContainer = document.getElementById('listCardContent'+colId);
        console.log(cardContainer);
        
        
    }

    let columnContainer = document.getElementById("columnContainer");
    statusColumn.map((obj) => {
        let card = document.createElement('div');
         card.classList.add('card');
        let cardHtml = `
   <div class='card-header'> <div class='card-header-text'>${obj.columnStatus}</div> <div class='card-header-right'>  <div class='card-header-badge'>2/5</div><button>...</button></div> </div> <div class='card-content' id='listCardContent${obj.id}'> <div class='card-data' id='cardData${obj.id}'></div></div>`;
        card.innerHTML += cardHtml;
        let addCard = document.createElement('button');
        addCard.textContent='+ add a card';
        addCard.classList='card-footer';
        addCard.addEventListener('click',()=>addCardToColumn(obj.id))
        card.appendChild(addCard)
        columnContainer.appendChild(card)

    });    
}

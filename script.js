const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

//an array to hold all the items
let items = [];

function handleSubmit(e) {
    e.preventDefault();
    console.log('submitted');
    const name = e.currentTarget.item.value;
    if(!name) return;
    
    const item = {
        name: name,
        id: Date.now(),
        complete: false,
    };
    items.push(item);
    console.log(`there are now ${items.length} in your bucket`);

    //clear the form
    e.currentTarget.reset();
    //fire off a custom event - updated items
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}



function displayItems() {
    const html = items
    .map(
        item => `<li class="shopping-item">
        <input 
            value="${item.id}" 
            type="checkbox"
            ${item.complete ? 'checked' : ''}>
        <span class="itemName">${item.name}</span>
        <button aria-label="Remove ${item.name}"
        value="${item.id}">
        &times;</button>
        </li>`)
    .join('');
        list.innerHTML = html;
    };

function mirrorToLocalStorage() {
    console.info('saving items');
    localStorage.setItem('items', JSON.stringify(items));
}

function restoreFromLocalStorage() {
    console.log('Restoring from local storage');
    const IsItems = JSON.parse(localStorage.getItem('items'));
    if(IsItems.length) {
        items = IsItems;
        list.dispatchEvent(new CustomEvent('itemsUpdated'));
    }
}

function deleteItem(id) {
    console.log('Removing item', id);
    items = items.filter(item => item.id !== id);
    console.log(items);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id) {
    console.log('Marking as complete', id);
    const itemRef = items.find(item => item.id === id);
    itemRef.complete = !itemRef.complete;
    list.dispatchEvent(new CustomEvent('itemsUpdated'));  //it has been updated, so dispatched is needed
}

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);

//Event Delegation, listen to the click on the ul, but clicked over the button
list.addEventListener('click', function(e) {
    const id = parseInt(e.target.value);
    if(e.target.matches('button')) {
        deleteItem(id);
    }
    if(e.target.matches('input[type="checkbox"]')) {
        markAsComplete(id);
    };
})

restoreFromLocalStorage();



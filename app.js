// Storage Ctrl

// Item ctrl
const ItemCtrl = (function () {
    // constructor
    const Item = function (id, name, calories) {
        this.id = id
        this.name = name
        this.calories = calories
    }

    // DS/ state
    const data = {
        items:[
            // {id: 0, name:'Steak', calories: 1200},
            // {id: 1, name:'Cookie', calories: 400}
        ],
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function () {
            return data.items
        },
        addItem: function (name, calories) {
            let ID
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0
            }

            calories = parseInt(calories)
            newItem = new Item(ID, name, calories)

            data.items.push(newItem)

            return newItem
        },
        getItemById: function (id) {
            let found = null
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item
                }
            })
            return found
        },
        updateItem: function (name, calories) {
            calories = parseInt(calories)

            let found = null
            data.items.forEach(function (item) {
                if(item.id == data.currentItem.id) {
                    item.name = name
                    item.calories = calories
                    found = item
                }
            })
            console.log(found);
            return found
        },
        setCurrentItem: function (item) {
            data.currentItem = item
        },
        getCurrentItem: function () {
            return data.currentItem
        },
        getTotalCalories: function () {
            let total = 0

            data.items.forEach(function (item) {
                total += item.calories
                console.log(total);
            })

            data.totalCalories = total
            console.log(total);

            return data.totalCalories
        },
        logData: function () {
            return data
        }
    }
})();

// UI ctrl
const UICtrl = (function () {
    const UIselectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
    }

    return {
        populateItemList: function (items) {
            let html = ''

            items.forEach(function (item) {
                html += `
                    <li class="collection-item" id="item-${item.id}">
                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                        </a>
                    </li>
                `
            })

            // insert list items
            document.querySelector(UIselectors.itemList).innerHTML = html
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UIselectors.itemNameInput).value,
                calories: document.querySelector(UIselectors.itemCaloriesInput).value
            }
        },
        addListItem: function (item) {
            document.querySelector(UIselectors.itemList).getElementsByClassName.display = 'block'
            const li = document.createElement('li')
            li.className = 'collection-item'
            li.id = `item-${item.id}`
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `

            document.querySelector(UIselectors.itemList).insertAdjacentElement('beforeend', li)
        },
        clearInput: function () {
            document.querySelector(UIselectors.itemNameInput).value = ''
            document.querySelector(UIselectors.itemCaloriesInput).value = ''
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UIselectors.listItems)

            // convert node list into array
            listItems = Array.from(listItems)

            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute('id')

                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                    `
                }
            })
        },
        addItemToForm: function () {
            document.querySelector(UIselectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
            document.querySelector(UIselectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories
            UICtrl.showEditState()
        },
        hideList: function () {
            document.querySelector(UIselectors.itemList).style.display = 'none'
        },
        showTotalCalories: function (total) {
            document.querySelector(UIselectors.totalCalories).textContent = total
        },
        clearEditState: function () {
            UICtrl.clearInput()
            document.querySelector(UIselectors.updateBtn).style.display = 'none'
            document.querySelector(UIselectors.deleteBtn).style.display = 'none'
            document.querySelector(UIselectors.backBtn).style.display = 'none'
            document.querySelector(UIselectors.addBtn).style.display = 'inline'
        },
        showEditState: function () {
            document.querySelector(UIselectors.updateBtn).style.display = 'inline'
            document.querySelector(UIselectors.deleteBtn).style.display = 'inline'
            document.querySelector(UIselectors.backBtn).style.display = 'inline'
            document.querySelector(UIselectors.addBtn).style.display = 'none'
        },
        getSelectors: function () {
            return UIselectors
        }
    }
})();


// App ctrl
const App = (function (ItemCtrl, UICtrl) {

    // load event listeners
    const loadEventListeners = function () {
        const UIselectors = UICtrl.getSelectors()

        document.querySelector(UIselectors.addBtn).addEventListener('click', itemAddSubmit)

        document.addEventListener('keypress', function (e) {
            if(e.keyCode == 13 || e.which == 13) {
                e.preventDefault()
                return false
            }
        })

        // edit icon
        document.querySelector(UIselectors.itemList).addEventListener('click', itemEditClick)

        document.querySelector(UIselectors.updateBtn).addEventListener('click', itemUpdateSubmit)
    }

    const itemAddSubmit = function (e) {
        const input = UICtrl.getItemInput()

        if(input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories)

            UICtrl.addListItem(newItem)

            UICtrl.clearInput()

            App.init()
        }
        e.preventDefault()
    }

    const itemEditClick = function (e) {
        if(e.target.classList.contains('edit-item')) {
            const listId = e.target.parentNode.parentNode.id
            const listIdArr = listId.split('-')
            const id = parseInt(listIdArr[1])

            const itemToEdit = ItemCtrl.getItemById(id)

            ItemCtrl.setCurrentItem(itemToEdit)

            UICtrl.addItemToForm()
        }
    }

    const itemUpdateSubmit = function (e) {
        const input = UICtrl.getItemInput()

        const updateItem = ItemCtrl.updateItem(input.name, input.calories)

        UICtrl.updateListItem(updateItem)
        e.preventDefault()
    }

    return {
        init: function () {
            UICtrl.clearEditState()

            // fetch items
            const items = ItemCtrl.getItems()
            // console.log(items);

            UICtrl.populateItemList(items)

            const totalCalories = ItemCtrl.getTotalCalories()

            UICtrl.showTotalCalories(totalCalories)

            // load events
            loadEventListeners()
        }
    }
})(ItemCtrl, UICtrl);

App.init()
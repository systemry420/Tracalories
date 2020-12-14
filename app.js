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
        getTotalCalories: function () {
            let total = 0

            data.items.forEach(function (item) {
                total += item.calories
            })

            data.totalCalories = total

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
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
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
        hideList: function () {
            document.querySelector(UIselectors.itemList).getElementsByClassName.display = 'none'
        },
        showTotalCalories: function (total) {
            document.querySelector(UIselectors.totalCalories).textContent = total
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
    }

    const itemAddSubmit = function (e) {
        const input = UICtrl.getItemInput()

        if(input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories)

            UICtrl.addListItem(newItem)

            UICtrl.clearInput()
        }
        
        e.preventDefault()
        
    }
    
    return {
        init: function () {
            // fetch items
            const items = ItemCtrl.getItems()

            // check for items
            if(items.length === 0) {
                UICtrl.hideList()
            } else {
                // populate list
                UICtrl.populateItemList(items)
            }

            const totalCalories = ItemCtrl.getTotalCalories()

            UICtrl.showTotalCalories(totalCalories)

            // load events
            loadEventListeners()
        }
    }
})(ItemCtrl, UICtrl);

App.init()
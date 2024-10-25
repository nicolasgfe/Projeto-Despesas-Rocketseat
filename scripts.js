const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
const expenseTotal = document.querySelector("h2")
const expenseQuantity = document.querySelector("aside header p span")

const expenseList = document.querySelector("ul")

amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "")

  value = Number(value) / 100

  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return value
}


form.onsubmit = (e) => {
  e.preventDefault()

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }
  expenseAdd(newExpense)
}

function expenseAdd(newExpense) {
  try {
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)


    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    const categoryName = document.createElement("span")
    categoryName.textContent = newExpense.category_name
    expenseInfo.append(expenseName, categoryName)

    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`


    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "./img/remove.svg")
    removeIcon.setAttribute("alt", "remover")
    removeIcon.setAttribute("value", newExpense.id)

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    expenseList.append(expenseItem)
    updateTotals()
    clear()
  } catch (error) {
    alert("Nao foi possivel atualizar a lista de despesas")
    console.log(error);
  }
}

function updateTotals() {
  try {
    const items = expenseList.children
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`
    // expenseTotal.textContent = expenseTotal.value + value

    let total = 0
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
      value = parseFloat(value)
      if(isNaN(value)){
        console.log(" sac");
        
        return alert("Não foi possível calcular esse numero")  
      }
      total += Number(value)
    }

    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"
    
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "") 
    expenseTotal.innerHTML = ""
    expenseTotal.append(symbolBRL, total)
  } catch (error) {
    console.log(error);
    alert("Não foi possível atualizar os totais")

  }
}

expenseList.addEventListener("click", function (e) {
  if(e.target.classList.contains) {
    console.log(e);
    const item = event.target.closest(".expense")
    item.remove()
  }
  updateTotals()
})

function clear() {
  amount.value = ""
  category.value = ""
  expense.value = ""

  expense.focus()
}
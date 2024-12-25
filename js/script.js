// Selecting elements
const display = document.querySelector(".count-display");
const resultDisplay = document.querySelector(".result-display");
const buttons = document.querySelectorAll(".btn-sec-key");

// Variables for calculation
let num1 = null;
let num2 = null;
let op = null;
let result = 0;
let newCalculation = false;

// Function to update the display
const updateDisplay = () => {
  display.textContent = `${num1 !== null ? num1 : ""} ${
    op !== null ? op : ""
  } ${num2 !== null ? num2 : ""}`;
  resultDisplay.textContent = result;
};

// Function to reset calculator
const resetCalculator = () => {
  num1 = null;
  num2 = null;
  op = null;
  result = 0;
  newCalculation = false;
  display.textContent = ""; // Clear the main display
  resultDisplay.textContent = "0"; // Reset the result display to 0
};

// Function to calculate the result
const calculateResult = () => {
  if (num1 !== null && num2 !== null && op) {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    switch (op) {
      case "+":
        result = n1 + n2;
        break;
      case "-":
        result = n1 - n2;
        break;
      case "*":
        result = n1 * n2;
        break;
      case "/":
        result = n2 !== 0 ? n1 / n2 : "Error";
        break;
      case "%":
        result = n2 !== 0 ? n1 % n2 : "Error";
        break;
      default:
        result = "Error";
    }

    // Limit the result to 6 decimal places
    if (typeof result === "number" && result !== "Error") {
      result = parseFloat(result.toFixed(6));
    }
    saveLocal();
    // Prepare for new calculation
    num1 = result;
    num2 = null;

    newCalculation = true;
    updateDisplay();
  }
};
let itemCounter = 0;
function saveLocal() {
  let result = {
    id: itemCounter++,
    num1: num1,
    op: op,
    num2: num2,
  };
  localStorage.setItem(`${itemCounter}`, result);
}
function getLocal(number) {
  let pervResult = JSON.parse(localStorage.getItem(number));
  if (pervResult) {
    num1 = pervResult.num1;
    op = pervResult.op;
    num2 = pervResult.num2;

    calculateResult();
  }
}

// Event listener for buttons
buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const key = button.dataset.setKey;
    handleKeyInput(key);
  });
});

const handleKeyInput = (key) => {
  if (!isNaN(key)) {
    if (newCalculation) {
      if (op !== null) {
        num2 = key;
        newCalculation = false;
      } else {
        resetCalculator();
        num1 = key;
        newCalculation = false;
      }
    } else if (op === null) {
      // جلوگیری از اضافه کردن چندین صفر در ابتدای عدد
      if (num1 === null || num1 === "0") {
        num1 = key;
      } else {
        num1 += key;
      }
    } else {
      // جلوگیری از اضافه کردن چندین صفر در ابتدای عدد دوم
      if (num2 === null || num2 === "0") {
        num2 = key;
      } else {
        num2 += key;
      }
    }
  } else if (key === "clear") {
    resetCalculator();
  } else if (key === "eraser") {
    // Handle backspace/eraser
    if (num2 !== null && num2 !== "0") {
      num2 = num2.slice(0, -1); // حذف آخرین کاراکتر از num2
      if (num2 == '') {
        num2 = null
      }
    } else if (num2 === "") {
      console.log('yes');
      
      num2 = null; // اگر num2 خالی شد، مقدار آن را به null تغییر می‌دهیم
      op = null;   // اگر num2 خالی شد، op نیز پاک می‌شود
    } else if (op !== null) {
      op = null; // حذف عملگر (op)
    } else if (num1 !== null && num1 !== "0") {
      num1 = num1.toString(); // تبدیل num1 به رشته
      num1 = num1.slice(0, -1); // حذف آخرین کاراکتر از num1
      if (num1 === "") num1 = "0"; // اگر خالی شد، مقدار را 0 تنظیم کن
    }
  }
  
  
  
   else if (key === "=") {
    calculateResult();
  } else if (key === "+/-") {
    if (num2 !== null) {
      num2 = (-parseFloat(num2)).toString();
    } else if (num1 !== null) {
      num1 = (-parseFloat(num1)).toString();
    }
  }
   else if (key === ".") {
    if (op === null) {
      // اگر num1 وجود ندارد یا 0 است، 0. را قرار بده
      if (num1 === null || num1 === "0" || num1 === "") {
        num1 = "0.";
      } else if (!num1.includes(".")) {
        num1 += "."; // فقط در صورتی که نقطه در num1 وجود نداشته باشد
      }
    } else {
      // اگر op وجود دارد و num2 هنوز نداریم، 0. را به num2 اضافه کن
      if (num2 === null || num2 === "0" || num2 === "") {
        num2 = "0.";
      } else if (!num2.includes(".")) {
        num2 += "."; // فقط در صورتی که نقطه در num2 وجود نداشته باشد
      }
    }
  }
   else {
    if (newCalculation) {
      newCalculation = false;
      op = key;
      num2 = null;
    } else if (num1 !== null && num2 === null) {
      op = key;
    } else if (num1 !== null && num2 !== null) {
      calculateResult();
      num1 = result;
      op = key;
      num2 = null;
    }
  }

  updateDisplay();
};

// Initialize display
updateDisplay();

// Keyboard event listener
document.addEventListener("keydown", (event) => {
  const key = event.key;
  const validKeys = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ".",
    "+",
    "-",
    "*",
    "/",
    "%",
    "=",
    "Enter",
    "Backspace",
  ];

  if (validKeys.includes(key)) {
    if (key === "Enter" || key === "=") {
      handleKeyInput("=");
    } else if (key === "Backspace") {
      handleKeyInput("eraser"); // تغییر به eraser برای پاک کردن آخرین رقم
    } else {
      handleKeyInput(key);
    }
  }
});

function saveTransaction(num1, op, num2, result = null) {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  const newTransaction = {
    id: Date.now(),
    num1: num1,
    op: op,
    num2: num2,
    result: result,
  };
  transactions.push(newTransaction);

  if (transactions.length > 20) {
    transactions.shift();
  }

  localStorage.setItem("transactions", JSON.stringify(transactions));
  loadTransactions()
}


function loadTransactions() {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const transactionList = document.querySelector(".transactions-list");

  // پاک کردن لیست موجود
  transactionList.innerHTML = "";

  // افزودن معاملات به لیست
  transactions.forEach((transaction) => {
    const listItem = document.createElement("li");
    listItem.classList.add('transactions-item');
    listItem.setAttribute('data-set-id', transaction.id);
    listItem.textContent = ` ${transaction.num1} ${transaction.op} ${transaction.num2} = ${
      transaction.result !== undefined ? transaction.result : "Pending"
    }`;
  
    listItem.addEventListener('click', () => {
      num1 = transaction.num1; // مقدار num1 را ثبت کن
      op = transaction.op;     // مقدار عملگر را ثبت کن
      num2 = transaction.num2; // مقدار num2 را ثبت کن
      result = transaction.result; // مقدار نتیجه را ثبت کن (در صورت نیاز)
      newCalculation = false; 

      // به‌روزرسانی نمایشگر
      updateDisplay();
    });
  
    // افزودن به ابتدای لیست
  transactionList.insertBefore(listItem, transactionList.firstChild);
  });
  
}


document.addEventListener("DOMContentLoaded", () => {
  loadTransactions(); // بازیابی و نمایش معاملات ذخیره‌شده
});

function saveLocal() {
  if (num1 !== null && op !== null && num2 !== null) {
    saveTransaction(num1, op, num2, result); // ارسال مقدار result
  }
}

let btnDropList = document.querySelector('.op-btn-lasts')
btnDropList.addEventListener('click',()=>{
 
  document.querySelector('.transactions-list').classList.toggle('active')
})



document.getElementById("theme-toggle").addEventListener("click", function () {
  const body = document.body;

  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
  } else {
    body.classList.add("dark-mode");
  }
});

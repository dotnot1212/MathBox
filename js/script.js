// Selecting elements
const display = document.querySelector(".count-display");
const resultDisplay = document.querySelector(".result-display");
const buttons = document.querySelectorAll(".btn-sec-key");

// Variables for calculation
let firstNumber = null;
let secondNumber = null;
let operator = null;
let result = 0;
let isNewCalculation = false;

// Function to update the display
const updateDisplay = () => {
  display.textContent = `${firstNumber !== null ? firstNumber : ""} ${
    operator !== null ? operator : ""
  } ${secondNumber !== null ? secondNumber : ""}`;
  resultDisplay.textContent = result;
};

// Function to reset calculator
const resetCalculator = () => {
  firstNumber = null;
  secondNumber = null;
  operator = null;
  result = 0;
  isNewCalculation = false;
  display.textContent = ""; // Clear the main display
  resultDisplay.textContent = "0"; // Reset the result display to 0
};

// Function to calculate the result
const calculateResult = () => {
  if (firstNumber !== null && secondNumber !== null && operator) {
    const n1 = parseFloat(firstNumber);
    const n2 = parseFloat(secondNumber);

    switch (operator) {
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
    firstNumber = result;
    secondNumber = null;

    isNewCalculation = true;
    updateDisplay();
  }
};
let itemCounter = 0;
function saveLocal() {
  let result = {
    id: itemCounter++,
    firstNumber: firstNumber,
    operator: operator,
    secondNumber: secondNumber,
  };
  localStorage.setItem(`${itemCounter}`, result);
}
function getLocal(number) {
  let pervResult = JSON.parse(localStorage.getItem(number));
  if (pervResult) {
    firstNumber = pervResult.firstNumber;
    operator = pervResult.operator;
    secondNumber = pervResult.secondNumber;

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
    if (isNewCalculation) {
      if (operator !== null) {
        secondNumber = key;
        isNewCalculation = false;
      } else {
        resetCalculator();
        firstNumber = key;
        isNewCalculation = false;
      }
    } else if (operator === null) {
      // جلوگیری از اضافه کردن چندین صفر در ابتدای عدد
      if (firstNumber === null || firstNumber === "0") {
        firstNumber = key;
      } else {
        firstNumber += key;
      }
    } else {
      // جلوگیری از اضافه کردن چندین صفر در ابتدای عدد دوم
      if (secondNumber === null || secondNumber === "0") {
        secondNumber = key;
      } else {
        secondNumber += key;
      }
    }
  } else if (key === "clear") {
    resetCalculator();
  } else if (key === "eraser") {
    // Handle backspace/eraser
    if (secondNumber !== null && secondNumber !== "0") {
      secondNumber = secondNumber.slice(0, -1); // حذف آخرین کاراکتر از secondNumber
      if (secondNumber == '') {
        secondNumber = null
      }
    } else if (secondNumber === "") {
      console.log('yes');
      
      secondNumber = null; // اگر secondNumber خالی شد، مقدار آن را به null تغییر می‌دهیم
      operator = null;   // اگر secondNumber خالی شد، operator نیز پاک می‌شود
    } else if (operator !== null) {
      operator = null; // حذف عملگر (operator)
    } else if (firstNumber !== null && firstNumber !== "0") {
      firstNumber = firstNumber.toString(); // تبدیل firstNumber به رشته
      firstNumber = firstNumber.slice(0, -1); // حذف آخرین کاراکتر از firstNumber
      if (firstNumber === "") firstNumber = "0"; // اگر خالی شد، مقدار را 0 تنظیم کن
    }
  }
  
  
  
   else if (key === "=") {
    calculateResult();
  } else if (key === "+/-") {
    if (secondNumber !== null) {
      secondNumber = (-parseFloat(secondNumber)).toString();
    } else if (firstNumber !== null) {
      firstNumber = (-parseFloat(firstNumber)).toString();
    }
  }
   else if (key === ".") {
    if (operator === null) {
      // اگر firstNumber وجود ندارد یا 0 است، 0. را قرار بده
      if (firstNumber === null || firstNumber === "0" || firstNumber === "") {
        firstNumber = "0.";
      } else if (!firstNumber.includes(".")) {
        firstNumber += "."; // فقط در صورتی که نقطه در firstNumber وجود نداشته باشد
      }
    } else {
      // اگر operator وجود دارد و secondNumber هنوز نداریم، 0. را به secondNumber اضافه کن
      if (secondNumber === null || secondNumber === "0" || secondNumber === "") {
        secondNumber = "0.";
      } else if (!secondNumber.includes(".")) {
        secondNumber += "."; // فقط در صورتی که نقطه در secondNumber وجود نداشته باشد
      }
    }
  }
   else {
    if (isNewCalculation) {
      isNewCalculation = false;
      operator = key;
      secondNumber = null;
    } else if (firstNumber !== null && secondNumber === null) {
      operator = key;
    } else if (firstNumber !== null && secondNumber !== null) {
      calculateResult();
      firstNumber = result;
      operator = key;
      secondNumber = null;
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

function saveTransaction(firstNumber, operator, secondNumber, result = null) {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  const newTransaction = {
    id: Date.now(),
    firstNumber: +firstNumber,
    operator: operator,
    secondNumber: +secondNumber,
    result: +result,
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
    listItem.textContent = ` ${transaction.firstNumber} ${transaction.operator} ${transaction.secondNumber} = ${
      transaction.result !== undefined ? transaction.result : "Pending"
    }`;
  
    listItem.addEventListener('click', () => {
      firstNumber = transaction.firstNumber; // مقدار firstNumber را ثبت کن
      operator = transaction.operator;     // مقدار عملگر را ثبت کن
      secondNumber = transaction.secondNumber; // مقدار secondNumber را ثبت کن
      result = transaction.result; // مقدار نتیجه را ثبت کن (در صورت نیاز)
      isNewCalculation = false; 

      // به‌روزرسانی نمایشگر
      updateDisplay();
    });
  
    // افزودن به ابتدای لیست
  transactionList.insertBefore(listItem, transactionList.firstChild);
  });
  
}


document.addEventListener("DOMContentLoaded", () => {
  loadTransactions(); // بازیابی و نمایش معاملات ذخیره‌شده

  const loader = document.querySelector(".loader");
  const progressBar = document.querySelector(".loader-line");
  const percentageText = document.querySelector(".loader-percentage");
  const percentageBg = document.querySelector(".loader-percentage-bg");

  const updateProgress = (percentage) => {
    percentageBg.style.width = `${percentage}%`;
    percentageText.textContent = `${Math.floor(percentage)}%`; // نمایش درصد کامل
  };

  const simulateLoading = () => {
    let progress = 0;
    const interval = setInterval(() => {
      if (progress < 100) {
        progress += Math.random() * 20; // افزایش تصادفی
        if (progress > 100) progress = 100;
        updateProgress(progress);
      } else {
        clearInterval(interval);
        loader.style.opacity = "0";
        setTimeout(() => {
          loader.style.display = "none";
          document.querySelector('.main').style.display = 'block'
        }, 500);
      }
    }, 300);
  };

  // غیرفعال‌سازی اسکرول هنگام لودینگ
  document.body.style.overflow = "hidden";

  // شبیه‌سازی بارگذاری
  simulateLoading();
});


function saveLocal() {
  if (firstNumber !== null && operator !== null && secondNumber !== null) {
    saveTransaction(+firstNumber, operator, +secondNumber, +result); // ارسال مقدار result
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

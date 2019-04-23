/////////////Loan Inquery constructor ES5/////////////////
// function LoanInquery(amount, interest, years, monthlyPayment, totalPayment, totalInterest) {
//   this.amount = amount;
//   this.interest = interest;
//   this.years = years;
//   this.monthlyPayment = monthlyPayment;
//   this.totalPayment = totalPayment;
//   this.totalInterest = totalInterest;
// }

////////////////// UI Constructor ES5 ///////////////////////
// function UI() {
//   UI.prototype.addInqueryToList = function(loanInquery) {
//     const list = document.getElementById('inquery-list');
//     const row = document.createElement('tr');
//     row.innerHTML = `
//       <td>\$${loanInquery.amount}.00</td>
//       <td>${loanInquery.interest}%</td>
//       <td>${loanInquery.years}</td>
//       <td>\$${loanInquery.monthlyPayment}</td>
//       <td>\$${loanInquery.totalPayment}</td>
//       <td>\$${loanInquery.totalInterest}</td>
//       <td><span id="delete" class="delete">&times;</span></td>
//       <td><input type="checkbox" class="checkbox"></td>
//     `;

//     list.append(row);

//     row.addEventListener('click', function(e) {
//       if (e.target.className === 'delete') {
//         e.target.parentElement.parentElement.remove();
//       }
      
//       if (e.target.className === 'checkbox') {
//         let checked = document.querySelectorAll('.checkbox');
//         for (let i = 0; i <= checked.length - 1; i++) {
//           if (checked[i].checked === true) {
//             document.getElementById('checked-button').style.backgroundColor = 'red';
//             break;
//           } else {
//             document.getElementById('checked-button').style.backgroundColor = 'black';
//           }
//         }
//       }
//       listCheck(e);
      
//     });        
//   }
// }

///////////// Loan Inquery constructor ES6 //////////////////////
class LoanInquery {
  constructor(inqueryNumber, amount, interest, years, monthlyPayment, totalPayment, totalInterest) {
    this.inqueryNumber = inqueryNumber;
    this.amount = amount;
    this.interest = interest;
    this.years = years;
    this.monthlyPayment = monthlyPayment;
    this.totalPayment = totalPayment;
    this.totalInterest = totalInterest
  }

}

//////////////// UI Constructor ES6 ////////////////////

class UI {
  addInqueryToList(loanInquery) {
    // console.log(loanInquery.amount);
    const list = document.getElementById('inquery-list');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="display: none">${loanInquery.inqueryNumber}</td>
      <td>\$${loanInquery.amount}.00</td>
      <td>${loanInquery.interest}%</td>
      <td>${loanInquery.years}</td>
      <td>\$${loanInquery.monthlyPayment}</td>
      <td>\$${loanInquery.totalPayment}</td>
      <td>\$${loanInquery.totalInterest}</td>
      <td><span id="delete" class="delete">&times;</span></td>
      <td><input type="checkbox" class="checkbox"></td>
    `;

    list.append(row);

    row.addEventListener('click', function(e) {
      if (e.target.className === 'delete') {
        Store.removeInquery(e.target.parentElement.parentElement.firstElementChild.innerHTML);
        e.target.parentElement.parentElement.remove();
        // console.log(e.target);
      }
      
      if (e.target.className === 'checkbox') {
        let checked = document.querySelectorAll('.checkbox');
        for (let i = 0; i <= checked.length - 1; i++) {
          if (checked[i].checked === true) {
            document.getElementById('checked-button').style.backgroundColor = 'red';
            break;
          } else {
            document.getElementById('checked-button').style.backgroundColor = 'black';
          }
        }
      }
      listCheck(e);
      
    });        
  }
}

class Store {
  static getInqueries() {
    let inqueries;
    if(localStorage.getItem('inqueries') === null) {
      inqueries = [];
    } else {
      inqueries = JSON.parse(localStorage.getItem('inqueries'));
    }
    return inqueries;
  }

  static showInqueries() {
    let inqueries = Store.getInqueries();
    if (inqueries != []) {
      let ui = new UI();
      for (let i = 0; i < inqueries.length; i++) {
        ui.addInqueryToList(inqueries[i]);
        // console.log(inqueries);
        showTable();

      }
    }
  }

  static addInquery(inquery) {
    const inqueries = Store.getInqueries();
    inqueries.push(inquery);
    localStorage.setItem('inqueries', JSON.stringify(inqueries));
  }

  static removeInquery(inqueryNum) {
    let inqueries = Store.getInqueries();
    for (let i = 0; i < inqueries.length; i++) {
      if (inqueries[i].inqueryNumber == inqueryNum) {
        inqueries.splice(i, 1)
        console.log(inqueries);
        localStorage.setItem('inqueries', JSON.stringify(inqueries));
      }
    }
  }

  static checkInqueries() {
    let inqueries = Store.getInqueries();
    if (inqueries == 0) {
      return 0;
    } else {
      let maxNum = 0;
      for (let i = 0; i < inqueries.length; i++) {
        let number = Number(inqueries[i].inqueryNumber);
        if (number >= maxNum) {
          maxNum = number;
        }
      }
      return maxNum;      
    }
  }
}

document.getElementById('loan-form').addEventListener('submit', function(e) {
  document.getElementById('results').style.display = 'none';
  calculateResults();
    
  e.preventDefault();
})

function calculateResults() {

  const inqueryNumber = Store.checkInqueries() + 1;
  
  const amount = document.getElementById('amount');
  const interest = document.getElementById('interest');
  const years = document.getElementById('years');

  const monthlyPayment = document.getElementById('monthly-payment');
  const totalPayment = document.getElementById('total-payment');
  const totalInterest = document.getElementById('total-interest');


  const principal = parseFloat(amount.value);
  // console.log(principal);
  const calculatedInterest = parseFloat(interest.value) / 100 / 12;
  const calculatedPayments = parseFloat(years.value) * 12;

  const x = Math.pow(1 + calculatedInterest, calculatedPayments);
  const monthly = (principal * x * calculatedInterest) / (x-1);


  if(isFinite(monthly)) {
    // document.getElementById('loading').style.display = 'block';
    monthlyPayment.value = monthly.toFixed(2);
    totalPayment.value = (monthly * calculatedPayments).toFixed(2);
    totalInterest.value = ((monthly * calculatedPayments) - principal).toFixed(2);
    amount.disabled = true;
    interest.disabled = true;
    years.disabled = true;
    document.getElementById('calcBtn').disabled = true;
    const loanInquery = new LoanInquery(inqueryNumber, amount.value, interest.value, years.value, monthlyPayment.value, totalPayment.value, totalInterest.value);
    
    const ui = new UI();
    modal();
    if (document.getElementById('table').style.display != 'block') {
    ui.addInqueryToList(loanInquery);
    setTimeout(function() {showResults(loanInquery), showTable()}, 500);
      } else {
        setTimeout(function() {showResults(loanInquery), ui.addInqueryToList(loanInquery)}, 500);
      }
    Store.addInquery(loanInquery);
    } else {
      showError('Please Check Your Numbers!');
    }
}

function showError(error) {
  const errrorDiv = document.createElement('div');

  const card = document.querySelector('.card');
  const heading = document.querySelector('.heading');

  errrorDiv.className = 'alert alert-danger';

  errrorDiv.appendChild(document.createTextNode(error));

  card.insertBefore(errrorDiv, heading);

  setTimeout(clearError, 3000);
}

function clearError() {
  document.querySelector('.alert').remove();
}

function showResults() {
    document.getElementById('results').style.display = 'block';
    document.getElementById('clear-form-btn').focus();
    document.getElementById('clear-form').addEventListener('submit', clearForm)
// setTimeout(modal, 1000);
}

function clearForm(e) {
  document.getElementById('results').style.display = 'none';
  document.getElementById('amount').value = '';
  document.getElementById('interest').value = '';
  document.getElementById('years').value = '';
  document.getElementById('amount').disabled = false;
  document.getElementById('interest').disabled = false;
  document.getElementById('years').disabled = false;
  document.getElementById('calcBtn').removeAttribute('disabled');
  document.getElementById('amount').focus();
  // console.log(e);
  e.preventDefault();
}

function showTable() {
  document.getElementById('table').style.display = 'block';
  document.getElementById('clear-list').addEventListener('click', clearList);
  document.getElementById('checked-button').addEventListener('click', clearChecked)
  
}

function clearList(e) {
  let list = document.getElementById('inquery-list');
  let child = list.lastElementChild;
  while (child) {
    list.removeChild(child);
    child = list.lastElementChild;
  };
  document.getElementById('table').style.display = 'none';
  localStorage.removeItem('inqueries');
  clearForm(e);
}

function clearChecked(e) {
  let checked = document.querySelectorAll('.checkbox');
  for (let i = 0; i <= checked.length - 1; i++) {
    if (checked[i].checked === true) {
      Store.removeInquery(checked[i].parentElement.parentElement.firstElementChild.innerHTML);
      checked[i].parentElement.parentElement.remove();
    }
  }
  listCheck(e);

  document.getElementById('checked-button').style.backgroundColor = 'black';
}

function listCheck(e) {
  const listCheck = document.querySelectorAll('tr');
  if (listCheck.length <= 1) {
    localStorage.removeItem('inqueries');
    document.getElementById('table').style.display = 'none';
    clearForm(e);
   }
}

function modal() {
// document.getElementById('content').innerHTML = `${href ='./src/content.html'}`
  document.getElementById('modal').style.display = 'block';
  // document.getElementById('x').addEventListener('click', closeModal);
  setTimeout(closeModal, 1000);
  function closeModal() {
    // console.log(1);
    document.getElementById('modal').style.display = 'none';
  };
}

document.getElementById('amount').addEventListener('keydown', function(e) {
  if (e.which === 69) {
    e.preventDefault();
  }
})
document.getElementById('interest').addEventListener('keydown', function(e) {
  if (e.which === 69) {
    e.preventDefault();
  }
})
document.getElementById('years').addEventListener('keydown', function(e) {
  if (e.which === 69) {
    e.preventDefault();
  }
})
Store.showInqueries();
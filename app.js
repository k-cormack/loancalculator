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
//             document.getElementById('delete-button').style.backgroundColor = 'red';
//             break;
//           } else {
//             document.getElementById('delete-button').style.backgroundColor = 'black';
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
      <td>${loanInquery.monthlyPayment}</td>
      <td>${loanInquery.totalPayment}</td>
      <td>${loanInquery.totalInterest}</td>
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
            document.getElementById('delete-button').style.backgroundColor = 'red';
            document.getElementById('clear-checked-button').style.backgroundColor = 'green';
            break;
          } else {
            document.getElementById('delete-button').style.backgroundColor = 'rgb(52, 58, 64)';
            document.getElementById('clear-checked-button').style.backgroundColor = 'rgb(52, 58, 64)';

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
    monthlyPayment.value = "$" + monthly.toFixed(2);
    totalPayment.value = "$" + (monthly * calculatedPayments).toFixed(2);
    totalInterest.value = "$" + ((monthly * calculatedPayments) - principal).toFixed(2);
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
      showError('Please Check Your Numbers!  Or...');
    }
}

function showError(error) {
  const errorDiv = document.createElement('div');

  const card = document.querySelector('.card');
  const heading = document.querySelector('.heading');

  errorDiv.className = 'alert alert-danger';

  errorDiv.appendChild(document.createTextNode(error));
  const randomCat = document.createElement('button');
  randomCat.id = 'cat-button';
  randomCat.className = 'btn btn-outline-success';
  randomCat.addEventListener('click', showCat);
  randomCat.innerHTML = 'See a Cat!';


  errorDiv.appendChild(randomCat);

  card.insertBefore(errorDiv, heading);

  setTimeout(clearError, 3000);
}

function clearError() {
  document.querySelector('.alert').remove();
  const modal = document.getElementById('modal');
  if (modal.style.display == "" ){
    document.getElementById('amount').focus();
  }
}

function showCat() {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', 'https://aws.random.cat/meow');
  
  xhr.onloadend = function() {
    let response;
    if (this.status != 200) {
      response = 'Sorry...No Cats Today!';
    } else {
      response = JSON.parse(this.responseText);      
    }
    catModal(response);
  }
  xhr.send();
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
  document.getElementById('delete-button').addEventListener('click', deleteChecked);
  document.getElementById('clear-checked-button').addEventListener('click', clearChecked);

  
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

function deleteChecked(e) {
  let checked = document.querySelectorAll('.checkbox');
  for (let i = 0; i <= checked.length - 1; i++) {
    if (checked[i].checked === true) {
      Store.removeInquery(checked[i].parentElement.parentElement.firstElementChild.innerHTML);
      checked[i].parentElement.parentElement.remove();
    }
  }
  listCheck(e);

  document.getElementById('amount').focus();
  document.getElementById('delete-button').style.backgroundColor = 'rgb(52, 58, 64)';
  document.getElementById('clear-checked-button').style.backgroundColor = 'rgb(52, 58, 64)';

}

function clearChecked() {
  let checked = document.querySelectorAll('.checkbox');
  checked.forEach(element => {
    element.checked = false;
  });
  document.getElementById('amount').focus();
  document.getElementById('delete-button').style.backgroundColor = 'rgb(52, 58, 64)';
  document.getElementById('clear-checked-button').style.backgroundColor = 'rgb(52, 58, 64)';

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
  document.querySelector('.modal-content').innerHTML = `
  <img src="img/loader.gif" alt="" style="height: 500px">
  <p id="content">CALCULATING NOW.....</p>
  `;
  
  document.getElementById('modal').style.display = 'block';
  // document.getElementById('x').addEventListener('click', closeModal);
  setTimeout(closeModal, 1000);
};

function catModal(response) {
  if (typeof(response) === 'string') {
    document.querySelector('.modal-content').style['align-items'] = 'center';
    document.querySelector('.modal-content').innerHTML = `
      <h1>${response}</h1>
    `;
    setTimeout(closeModal, 3000);
  } else {
    document.querySelector('.modal-content').innerHTML = `
      <span id="x" class="close">&times</span>
      <img src="${response.file}" style="width: 100%">
    `;
    document.getElementById('x').addEventListener('click', closeModal);
  };
  document.getElementById('modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('amount').focus();
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
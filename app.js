//Loan Inquery constructor ES5
function LoanInquery(amount, interest, years, monthlyPayment, totalPayment, totalInterest) {
  this.amount = amount;
  this.interest = interest;
  this.years = years;
  this.monthlyPayment = monthlyPayment;
  this.totalPayment = totalPayment;
  this.totalInterest = totalInterest;
}

//UI Constructor ES5
function UI() {
  UI.prototype.addInqueryToList = function(loanInquery) {
    const list = document.getElementById('inquery-list');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${loanInquery.amount}</td>
    <td>${loanInquery.interest}</td>
    <td>${loanInquery.years}</td>
    <td>${loanInquery.monthlyPayment}</td>
    <td>${loanInquery.totalPayment}</td>
    <td>${loanInquery.totalInterest}</td>
    `;
    // console.log(row);
    list.append(row);
  }
}


document.getElementById('loan-form').addEventListener('submit', function(e) {
  document.getElementById('results').style.display = 'none';
  calculateResults();
  // setTimeout(calculateResults, 4000);  
  e.preventDefault();
})

function calculateResults() {
  // console.log('calculating');

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
    document.getElementById('loading').style.display = 'block';
    monthlyPayment.value = monthly.toFixed(2);
    totalPayment.value = (monthly * calculatedPayments).toFixed(2);
    totalInterest.value = ((monthly * calculatedPayments) - principal).toFixed(2);
    setTimeout(function() {clearLoading(), showResults(loanInquery), showTable()}, 3000);
    // setTimeout(showResults, 3200);
    amount.disabled = true;
    interest.disabled = true;
    years.disabled = true;
    document.getElementById('calcBtn').disabled = true;
    const loanInquery = new LoanInquery(amount.value, interest.value, years.value, monthlyPayment.value, totalPayment.value, totalInterest.value);
    // console.log(loanInquery);
    const ui = new UI();
    ui.addInqueryToList(loanInquery);

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

function clearLoading() {
  document.getElementById('loading').style.display = 'none';
}

function showResults(loanInquery) {
    document.getElementById('results').style.display = 'block';
    document.getElementById('clear').addEventListener('submit', function(e) {
      document.getElementById('results').style.display = 'none';
      document.getElementById('amount').value = '';
      document.getElementById('interest').value = '';
      document.getElementById('years').value = '';
      document.getElementById('amount').disabled = false;
      document.getElementById('interest').disabled = false;
      document.getElementById('years').disabled = false;
      document.getElementById('calcBtn').removeAttribute('disabled');
      // console.log(loanInquery);


      e.preventDefault();
    });
// setTimeout(modal, 1000);
}

function showTable() {
  document.querySelector('table').style.display = 'block';

}

function modal() {
// document.getElementById('content').innerHTML = `${href ='./src/content.html'}`
  document.getElementById('modal').style.display = 'block';
  document.getElementById('x').addEventListener('click', closeModal);
  
  function closeModal() {
    console.log(1);
    document.getElementById('modal').style.display = 'none';
  };
}
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
    setTimeout(function() {clearLoading(), showResults()}, 3000);
    // setTimeout(showResults, 3200);

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

function showResults() {
  document.getElementById('results').style.display = 'block';
  document.getElementById('clear').addEventListener('submit', function(e) {
    document.getElementById('results').style.display = 'none';
    document.getElementById('amount').value = '';
    document.getElementById('interest').value = '';
    document.getElementById('years').value = '';



    e.preventDefault();

});
}
let rateForm = document.getElementById('rateForm');

if(rateForm) {
  rateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let rate = document.getElementById("rate").value;

    if(!rate) throw "must provide rate";
    if(!(/^\d+$/.test(rate))) throw "rate must be a number";

    rateForm.submit();
  });
}
let price = 1.87;
let cid = [
  [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]
];

const cash = document.getElementById("cash");
const change = document.getElementById("change-due");
const sale = document.getElementById("purchase-btn");

let currencyUnits = [
  ["PENNY", .01],
  ["NICKEL", .05],
  ["DIME", .1],
  ["QUARTER", .25],
  ["ONE", 1],
  ["FIVE", 5],
  ["TEN", 10],
  ["TWENTY", 20],
  ["ONE HUNDRED", 100]
];

sale.addEventListener("click", () => {
  const cashValue = parseFloat(cash.value);
  const changeDue = cashValue - price;

  if (cashValue < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (cashValue === price) {
    change.innerText = "No change due - customer paid with exact cash";
    return;
  }

const changeResult = getChange(changeDue, cid);

if (changeResult.status === "INSUFFICIENT_FUNDS" || changeResult.status === "CLOSED") {
  change.innertext = `status: ${changeResult.status} ${formatChange(changeResult.change)}`
} else {
  let changeText = `status: OPEN ${formatChange(changeResult.change)}`;
  change.innerText = changeText.trim()
}

});

const getChange = (changeDue, cid) => {
  let totalCid = parseFloat(cid.reduce((sum, [_,amount]) => sum + amount, 0).toFixed(2))
  if (totalCid < changeDue) {
    return {status: "INSUFFICIENT_FUNDS", change: []}
  }

  let changeArray = [];
  let remainingChange = changeDue;

  for (let i = currencyUnits.length - 1; i >= 0; i--) {
    let unit = currencyUnits[i][0];
    let unitValue = currencyUnits[i][1];
    let unitInDrawer = cid[i][1];

    if (unitValue <= remainingChange && unitInDrawer > 0) {
      let amountFromUnit = 0;

      while(remainingChange >= unitValue && unitInDrawer > 0){
        remainingChange = (remainingChange - unitValue).toFixed(2);
        unitInDrawer -= unitValue;
        amountFromUnit += unitValue;
      }

      if (amountFromUnit > 0) {
        changeArray.push([unit, amountFromUnit])
      }
    } 
  }

  if (remainingChange > 0) {
    return {status: "INSUFFICIENT_FUNDS", change: []}
  }

  if (changeDue === totalCid) {
    return {status: "CLOSED", change: cid}
  }

  return {status: "OPEN", change: changeArray}
}

const formatChange = changeArray => changeArray.map(([unit, amount]) => `${unit}: $${amount.toFixed(2)}`).join("");


//console.log(formatChange([["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]))
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


function getPrevNumber(numbers, selectNumber){
  let i = 0;
  while(numbers[++i] < selectNumber);

  return numbers[--i];
}

function getNextNumber(numbers, selectNumber){
  let i = 0;
  while(numbers[++i] < selectNumber);
  
  return numbers[++i];
}

app.post('/near-numbers', (req, res) => {
  const { body } = req;
  const { numbers, selectNumber } = body;

  let numberSorterAsc = numbers.sort((a, b) => a - b);
  let nextNumber = getNextNumber(numberSorterAsc, selectNumber);
  let prevNumber = getPrevNumber(numberSorterAsc, selectNumber);
  console.log(prevNumber)
  res.json({
    prevNumber,
    nextNumber,
    selectNumber
  })
});

app.listen(port, () => console.log(`Listening on port ${port}`));
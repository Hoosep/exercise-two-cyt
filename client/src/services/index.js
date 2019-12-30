import axios from 'axios';

export function NearNumbers(numbers, selectNumber){
  return axios.post('/near-numbers', {
    numbers,
    selectNumber
  })
  .then(function (response) {
    const { data } = response;
    
    return data;
  })
  .catch(function (error) {
    console.log(error);
  });
}
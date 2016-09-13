/*
  Testing performance of using throw statements in control flow versus non-exception alternatives
 */

const NUM_TESTS = !isNaN(parseFloat(process.argv[2]))&&+process.argv[2] || 16;
const DATA_SIZE = !isNaN(parseFloat(process.argv[3]))&&+process.argv[3] || 2048;
const FUNCTION_CALLS_PER_TEST = !isNaN(parseFloat(process.argv[4]))&&+process.argv[4] || 128;

main();

function main(){
  console.log('Testing with exception flow control... ');
  console.log('Average time(ms): ', getAvg(testRunner(NUM_TESTS, DATA_SIZE, FUNCTION_CALLS_PER_TEST, withException)));
  console.log('Testing with if/else flow control... ');
  console.log('Average time(ms): ', getAvg(testRunner(NUM_TESTS, DATA_SIZE, FUNCTION_CALLS_PER_TEST, withoutException)));
}

function getAvg(results){
  return results.reduce((acc,curr)=>(acc+=curr),0)/results.length;
}

function testRunner(numTests, dataSize, functionCallsPerTest, testCb){
  let data;
  return Array(numTests).fill().map(()=>{ 
    data = Array(dataSize).fill('').map((n,i)=>(i+1)*(Math.random() > 0.5)?-1:1);
    return testHandle(data, functionCallsPerTest, testCb);
  });
}

function testHandle(testData, functionCallsPerTest, testCb){
  let start, end;
  start = new Date().getTime();
  //Need to chunk the tests because many tests execute in less than a millisecond
  for(let i=0; i<functionCallsPerTest; ++i){
    testData.forEach(num=>testCb(num));
  }
  end = new Date().getTime();
  return (end - start)/functionCallsPerTest;
}

function withException(num){
  let result;
  try{
    if(num>0){
      throw new Error('positive');
    }else if(num<0){
      throw new Error('negative');
    }else{
      throw new Error('zero');
    }
  }catch(e){
    result = e.message;
  }
  return result;
}

function withoutException(num){
  let result;

  if(num>0){
    result = 'positive';
  }else if(num<0){
    result = 'negative';
  }else{
    result = 'zero';
  }
  return result;
}

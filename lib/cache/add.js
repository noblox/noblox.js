// Define
module.exports = function(cache,type,index,element) {
  if (cache[type]) {
    cache[type].items[index] = {item: element, time: Date.now()/1000};
  } else
    return 'Invalid type';
};

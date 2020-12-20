### What are Promises?
Promises allow you to easily make your code asynchronous. They will allow your code to yield/stop and wait for a function to return a value. If a value is unknown, they will allow us to wait for the value to become known or for an error to be thrown. For example, if we want to get a user's rank, we want to wait for Roblox to reply with their rank before continuing the execution of our code.

### How do you use Promises?

You can use promises in 2 different ways. The first one is using **await/async**, in which you can set a variable to the result of the Promise, but **only** in an **async** function. This is done using await before calling the function, which will return a Promise. 

Another way you can use promises is by using **.then**(function). The function wrapped in .then() will execute when the Promise resolves, and the variables will be passed through the function.

However, sometimes Promises throw errors. You will need to handle any errors from promises or else you will get an **[Unhandled Promise Rejection Error.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#Promise_rejection_events)** These errors are fatal and should always be handled accordingly. To do this, you can use **.catch**, which will allow you to handle the error correctly. When using **async/await**, you can use .catch by attaching it after the function is called. With **.then()**, you can attach it after **.then**. Both cases are shown in the examples below.

### Examples:

#### async/await
```
const noblox = require("noblox.js");

//await can only be used in async functions!
async function DemoteUser (groupId, username) { 
  //await will yield the code until a value is returned.
  const userId = await noblox.getIdFromUsername(username).catch(function(error) {
    console.log("There was an error getting the id!", error)  
  }); //Handle the rejection accordingly.
	
  if (!userId) return console.log("No id was returned.");
  noblox.demote(groupId, userId); //Use the value returned to demote the user.
}

DemoteUser(1, "popeeyy");
```

#### .then(function)
```
const noblox = require("noblox.js");

//When the promise is resolved, the function runs with the provided variable.
noblox.getIdFromUsername("popeeyy").then(function(userId) {
  noblox.demote(1, userId)
}).catch(function(error) { //Handle the rejection accordingly.
  console.log("There was an error getting the id!", error)
})
```

### Additional Info:

When you use an **async** function, a Promise is returned, not a function. They should be treated as if they are Promises when returning values by using await or .then with proper error handling as well.

There are different ways to create a Promise, but we'll discuss two of the easiest ways. The first way is to create an **async function**, as explained above. The other way is to use **new Promise(function)**, with the function having 2 parameters. The 2 parameters are resolve and reject respectively, which will resolve the Promise or throw an error.

You should always read the docs, isn't that what you're here for? There are plenty of examples showing when you use Promises and what values are returned by the function. Promises are your friend in this library and many others, so take the time to learn them first and practice using them. If you have any questions, you can always ask the community in the [Roblox API Discord](https://discord.gg/EDXNdAT) via our designated channel "nodejs_nobloxjs".

### Example:

```
const isCool = false;

function amICool() {
  //Create a new Promise
  return new Promise(function(resolve, reject) {
    if (isCool) {
      //Resolve that isCool is true.
      resolve(true)
    } else {
      //Reject the Promise because only cool people can call this.
      reject("You aren't cool, don't call this function!")
    }
  })
}

amICool().then(function(cool) {
  console.log("Am I cool?", cool)
}).catch(function(err) {
  console.log("There was an error while checking if I'm cool", err)
})
```

### Resources:

If you are still having trouble with Promises or want to learn more, here are a few helpful resources:


[**MDN**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
<br />
[**DigitalOcean**](https://www.digitalocean.com/community/tutorials/javascript-promises-for-dummies)
<br />
[**JavaScript.info**](https://javascript.info/promise-basics)
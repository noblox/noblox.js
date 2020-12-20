### What is an EventEmitter?
An Event Emitter is a way in JavaScript to recieve data in real time until the emitter is closed. It's an easy way to handle events that occur in your application and execute functions. In noblox, they are used for handling events such as when someone shouts or Roblox notifications. 

### How can I use an EventEmitter?
You can use an EventEmitter created by noblox by calling a function that returns an EventEmitter, and calling **.on(event, callback)**. 3 events used by noblox are "data", "connect", and "close". Data is when noblox detects a change on Roblox and informs you of the change, which it will provide as a parameter in the callback function. Connect is when noblox connects to Roblox successfully and starts the emitter. Finally, close is when noblox disconnects from Roblox and stops the emitter.

### Example:
```
const noblox = require("noblox.js");
const Emitter = noblox.onShout(1);

Emitter.on("connect", function() {
    console.log("noblox is listening for a shout change!");
})

Emitter.on("data", function(newStatus) {
    console.log("The group status has been updated! New status:", newStatus);
})

Emitter.on("close", function() {
    console.log("noblox has closed the emitter!");
})
```

### Resources:
[**DigitalOcean**](https://www.digitalocean.com/community/tutorials/using-event-emitters-in-node-js)
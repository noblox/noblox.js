### What is Authentication on Roblox?
Authentication is pretty simple, it's how Roblox knows who you are and what account you're using. To identify your account, Roblox uses [**authentication sessions**](https://medium.com/@sherryhsu/session-vs-token-based-authentication-11a6c5ac45e4) which are stored on their servers and linked to your account. Your authentication session will expire when you log out of an account or press sign out of all other sessions. You can keep your session active by obtaining your cookie in an incognito window using the instructions below and closing the window when you're done, rather than signing out manually. Since Roblox uses FunCaptcha and have no official bot system, developers are forced to use these sessions, which are stored in [**cookies.**](https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer) This will allow Roblox to easily identify your bot's account and execute actions on it's behalf.

### What's a cookie?
A cookie (not the ones you eat) is a small quantity of data containing data sent by a website. Cookies are stored by the user's web browser while browsing. Cookies are standard practice across the web and as such, a large part of Roblox's security are based around cookies. Sharing is not caring. Never share your cookie.

### How do I obtain my cookie?
There are many different ways to obtain your cookie depending on your browser. First of all, open an [Incognito window](https://support.google.com/chrome/answer/95464?co=GENIE.Platform%3DDesktop&hl=en) on your browser and sign into your bot account.

> [Are you hosting your bot remotely? Due to recent security improvements, cookies are now locked by IP region. Learn connect to your VPS and generate the cookie remotely here.](https://noblox.js.org/tutorial-VPS%20Authentication.html)

#### **Chrome**
    1. Click the arrow icon on the right-hand side of the toolbar. 
    2. Go to More Tools. 
    3. Click the Developer Tools button. 
    4. Click the Application tab and Cookies button on the menu to the left. 
    5. Click the dropdown until you find www.roblox.com. 
    6. Your cookie is the value assigned to the key named .ROBLOSECURITY. Copy it.
#### **Firefox**
    1. Click the hamburger icon on the right-hand side of the toolbar. 
    2. Go to Web Developer. 
    3. Click Storage Inspector and the Cookies button on the menu to the left. 
    4. Click the dropdown until you find www.roblox.com. 
    5. Your cookie is the value assigned to the key named .ROBLOSECURITY. Copy it.
#### **Safari**
    1. Go to Preferences, Advanced and select Show Develop menu in menu bar. 
    2. Click the Develop tab. 
    3. Click Show Web Inspector. 
    4. Click the Storage tab and then click Cookies. 
    5. Click the dropdown until you find www.roblox.com. 
    6. Your cookie is the value assigned to the key named .ROBLOSECURITY. Copy it.
#### **Edge**
    1. Click the elipsis (...) on the right-hand side of the toolbar. 
    2. Go to More tools. 
    3. Click the Developer Tools button. 
    4. Click the More Tools button (icon next to Console). 
    5. Click Storage. 
    6. Click the dropdown until you find www.roblox.com. 
    7. Your cookie is the value assigned to the key named .ROBLOSECURITY. Copy it.

### How do I use my cookie?
Once you have obtained and copied your cookie, close the incognito window without signing out. To use your cookie with noblox, you will have to use the **setCookie method**. This will use your cookie in all requests sent to Roblox to perform actions on your bot's behalf. You should store your cookie somewhere secure, such as a [**.env file**](https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786).

### Example:
```javascript
const noblox = require("noblox.js");

noblox.setCookie(process.env.COOKIE).then(function() { //Use COOKIE from our .env file.
    console.log("Logged in!")
}).catch(function(err) {
    console.log("Unable to log in!", err)
})
```

### ⚠️ Usage warning

An authentication error which is often seen is `Cannot get CSRF: You are not logged in.`.
This is an error caused by trying to use an authenticated method, while not having set a cookie.
This is usually for one of two reasons:
#### Reason 1: Not used method
You haven't set the cookie. This should be pretty self-explanatory, and can also appear as "Authorization has been denied for this request".
To solve this case, use the [setCookie](./global.html#setCookie) method.


#### Reason 2: Promises
More often than not, this error is caused by misuse of promises.
The setCookie method, like most of our methods, returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

Ensure you use either `async await` or the `.then` and `.catch` methods. If using Async await, you must put any
authenticated code either WITHIN the same async function, or in another function which is called after your setCookie 
completes. The cookie will **not** be set until setCookie is complete.

If using `then` and `catch`, likewise it should be within the `then` block or a function called by it.

You can read more about Promises [here](./tutorial-Promises.html).

# Retrieving a .ROBLOSECURITY cookie on a headless VPS:

> You must have a **static IP** on a dedicated VPS that you can SSH into; <ins>free hosts like Repl.it and Glitch **are not compatible.**</ins>

[Adapted from a DigitalOcean tutorial.](https://www.digitalocean.com/community/tutorials/how-to-route-web-traffic-securely-without-a-vpn-using-a-socks-tunnel)

---

As of March 8th, 2022, Roblox began rolling out a mandatory security feature that locks an account's `.ROBLOSECURITY` cookie to an IP region. 

Learn more here: [https://devforum.roblox.com/t/ip-changes-invalidate-cookie/1700515](https://devforum.roblox.com/t/ip-changes-invalidate-cookie/1700515)

To bypass this, you must create the token from your VPS; the easiest way of which is through an SSH tunnel. When using this solution, the VPS must be the **only IP** accessing the account. Relogging without the proxy, or using a free coding workspace like Repl.it, Glitch, or Heroku, that assign dynamic IPs **will not work.**

---

**Step 0)** Make sure you are signed out of the target account, and have SSH access to your VPS.

**Step 1)** Connect to your VPS over SSH:

```console
ssh your_user@your_server_ip
```

**Step 2)** Whitelist a port in your firewall (any value between 1024 and 65535), we will use `1234`:

```console
sudo ufw allow 1234
```

> [If you have never set up a firewall, I strongly recommend reading this article to harden your server](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04); make sure to allow your SSH port too!

**Step 3)** Reconnect and start an SSH tunnel on the whitelisted port:

```console
ssh -D 1234 your_user@your_server_ip
```

You will be prompted for a password, and then there will be no sign for success for failure, **this is expected**.

**Step 4)** From a <ins>new terminal instance</ins>, connect your web browser to the proxy in incognito, and log in:

> These commands should be run outside of WSL, either use Git Bash or cmd.

**Google Chrome:**
```
start chrome --incognito --proxy-server="socks5://localhost:1234" https://www.roblox.com/login
```

**Microsoft Edge:**
```
start msedge --inprivate --proxy-server="socks5://localhost:1234" https://www.roblox.com/login
```

[**Mozilla Firefox**](https://www.digitalocean.com/community/tutorials/how-to-route-web-traffic-securely-without-a-vpn-using-a-socks-tunnel#step-2-mdash-configuring-firefox-to-use-the-tunnel) (Less recommended; must be manually configured.)

**Step 5)** [Retrieve your cookie as normal](https://noblox.js.org/tutorial-Authentication.html); this is nothing new.

**Step 6)** Copy the cookie to your VPS, write to a `.env` file, etc, your pick.

**Step 7)** Close the incognito proxied window; **do not** press log out.

**Step 8)** [Clean-Up]: Remove the whitelisted port from your firewall rules:
```console
sudo ufw delete allow 1234
```

**Step 9)** You may now close the SSH tunnel by closing your terminal; you are done- as far as Roblox can tell, you logged in from your VPS's IP.

---

> From now on, you **MUST** be connected through the SSH Tunnel to access the Roblox account. Failing to do so will violate the IP check and invalidate your cookie.
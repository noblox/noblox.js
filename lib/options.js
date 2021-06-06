// Includes
const jar = require('./util/jar.js').func
const newCache = require('./cache/new.js')

// Define
exports.init = function () {
  // ugly way to disable eslint from changing settings to a const bc it gets changed in the setOptions file.
  // eslint-disable-next-line prefer-const
  let settings = {
    session_only: true,
    session_only_desc: 'Minimizes data usage and speed up requests by only saving session cookies, disable if you need other cookies to be saved as well.',

    maxThreads: 50,
    maxThreads_desc: 'This is usually used for functions that have to receive a lot of pages at once. Only this amount will be queued up as to preserve memory, make this as high as possible for fastest responses (although it will be somewhat limited by maxSockets).',

    timeout: 10000,
    timeout_desc: "Timeout for http requests. This is necessary for functions that make a very large number of requests, where it is possible some simply won't connect.",

    event: {
      maxRetries: 5,
      maxRetries_desc: 'Maximum number of consecutive retries after an event times out or fails in some other way.',
      timeout: 10000,
      timeout_desc: 'Maximum time (in milliseconds) a request can take. If your server has extremely high latency you may have to raise this.',
      event_desc: 'Below is the poll time (in milliseconds) for each of the event functions. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite.',
      defaultDelay: 10000,
      onAuditLog: 10000,
      onWallPost: 10000,
      onJoinRequestHandle: 10000,
      onShout: 10000,
      onBlurbChange: 10000
    },

    thumbnail: {
      maxRetries: 2,
      maxRetries_desc: "Maximum number of retries to retrieve a pending thumbnail, rare, but occurs with uncached users (Roblox's cache)",
      retryDelay: 500,
      retryDelay_desc: 'The time to wait between consecutive retries of retrieving pending thumbnails',
      failedUrl: {
        pending: '',
        blocked: ''
      },
      failedUrl_desc: "The image URL to provide when an asset thumbnail is still pending or has been moderated by Roblox; defaults to Roblox moderation icon via noblox.js's GitHub repo at https://noblox.js.org/moderatedThumbnails/moderatedThumbnail_{size}.png"
    },

    queue: {
      Message: {
        delay: 0,
        desc: 'Although messages do have a floodcheck, it is not instituted immediately so this is disabled by default. If you are sending a lot of messages set a delay around 10-15 seconds (10000-15000)'
      },
      Forum: {
        delay: 15000,
        desc: 'All forum posts have a mandatory 15 second delay, there is no reason for this to be disabled'
      }
    },

    cache: {
      XCSRF: {
        expire: 1800,
        refresh: false,
        desc: "XCSRF tokens expire 30 minutes after being created. Until they expire, however, no new tokens can be made. Sometimes an XCSRF token has already been created for the user so the server doesn't know when to collect a new one. During transitions some requests may use invalid tokens. For now, new XCSRF tokens are automatically retrieved when cached ones get rejected."
      },

      Verify: {
        expire: 7200,
        refresh: 3600,
        desc: 'Verification tokens seem to last extremely long times.'
      },

      Roles: {
        expire: 600,
        refresh: true,
        desc: 'This should be fine unless your group changes its ranks often.'
      },

      RolesetId: {
        expire: 86400,
        refresh: false,
        desc: "Disable this completely if you don't plan on ever changing your exile bot's rank."
      },

      Product: {
        expire: false,
        refresh: false,
        desc: 'Disabled by default for security (price checks). If you are only working with ROBLOX assets, however, you can set this to something high (since ROBLOX product info rarely changes).'
      },

      NameFromID: {
        expire: false,
        refresh: false,
        desc: "Caches a user's username based on their ID. It is not on by default because it is an uncontrollable change but the option is there to cache it if you would like."
      },

      IDFromName: {
        expire: true,
        refresh: false,
        desc: "Permanent cache for a user's ID based on their name. There is no reason this would ever change (changing names would re-match it and old names cannot be reused by other accounts). Only disable if you want this to match current names only."
      },

      SenderID: {
        expire: true,
        refresh: false,
        desc: "Permanent cache for the sender's user ID. This should literally never change."
      },

      Rank: {
        expire: false,
        refresh: false,
        desc: 'Caches rank by user ID. Changes cannot be anticipated so this is not enabled by default.'
      }
    }
  }

  exports.jar = jar()

  const cacheList = []
  const cache = settings.cache
  for (const name of Object.keys(cache)) {
    const item = cache[name]
    const cacheObj = {
      name: name,
      refresh: item.refresh,
      expire: item.expire
    }
    cacheList.push(cacheObj)
  }
  exports.cache = newCache(cacheList)
  exports.queue = settings.queue
  exports.settings = settings
}

exports.init()

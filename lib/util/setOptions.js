const settings = require('../../settings.json')

// Docs
/**
 * ✅ Updates library options. This allows you to modify settings such as time-out, or number of event retries without
 * altering the settings.json file. Objects passed to this function should match the format of the settings.json file.
 * Unknown keys, or malformed options will be rejected with an error.
 * @category Utility
 * @param newOptions - The new options to set, structured as per <a href="https://github.com/noblox/noblox.js/blob/master/settings.json">settings.json</a>
 * @returns void
 * @see https://github.com/noblox/noblox.js/blob/master/settings.json
 */
function setOptions (newOptions) {
  return setOptionsLevel(settings, newOptions)
}

// This function allows key validation to be performed at different "levels" of nesting.
// Ensures the provided keys already exist, and discards invalid keys.
function setOptionsLevel (settingsLevel, inputObj) {
  const keys = Object.keys(inputObj)

  for (const key of keys) {
    const newValue = inputObj[key]
    const currentValue = settingsLevel[key]

    if (currentValue !== undefined) {
      if (typeof currentValue === 'object') {
        if (typeof inputObj[key] !== 'object') {
          throw new Error(`Tried to set options key ${key}, an object, to a non-object value: ${newValue}`)
        }

        setOptionsLevel(currentValue, newValue)
      } else {
        // it's not undefined, and it's not a nested object - set the value.
        settingsLevel[key] = newValue
      }
    } else {
      // The key doesn't exist
      throw new Error(`Tried to set option "${key}". This option does not exist, or has been nested incorrectly.`)
    }
  }
}

exports.func = setOptions

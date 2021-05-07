/**
 * About:
 * Reverts all rank change actions of a group after a specified date, with the option to filter by user.
 */

// Settings
const cookie = process.env.COOKIE || '' // Roblox account .ROBLOSECURITY cookie
const options = {
  group: 0, // Group ID
  userId: -1, // Revert rank changes made by this specified user - NOTE: When <= 0 any rank changes will be reverted
  afterDate: new Date('2021-01-01 00:00 CDT') // Date after which any rank changes will be reverted
}

// Dependencies
const rbx = require('noblox.js')
const logUpdate = require('log-update')

// Main
let scanning = true
const logItems = {
  scanned: 0,
  filtered: 0,
  reverted: 0,
  failed: 0
}

async function getAuditLogPage (getAuditLogOptions, cursor) {
  getAuditLogOptions.cursor = cursor || ''

  const auditLogPage = await rbx.getAuditLog(getAuditLogOptions)

  return auditLogPage
}

function filterAuditLogItems (auditLogItems) {
  const filteredAuditLogItems = []

  for (const auditLogItem of auditLogItems) {
    if (Date.parse(auditLogItem.created) > options.afterDate) {
      logItems.filtered++
      filteredAuditLogItems.push(auditLogItem.description)
    }
  }

  return filteredAuditLogItems
}

async function revertAuditLogItems (auditLogItems) {
  for (const auditLogItem of auditLogItems) {
    const setRankOptions = {
      group: options.group,
      target: auditLogItem.TargetId,
      rank: auditLogItem.OldRoleSetId
    }

    await rbx.setRank(setRankOptions)
      .then(() => {
        logItems.reverted++
      })
      .catch((e) => {
        logItems.failed++
      })
  }
}

rbx.setCookie(cookie)
  .then(async () => {
    console.time('Time taken')

    const logUpdater = setInterval(() => {
      logUpdate(`Scanned: ${logItems.scanned}\nFiltered: ${logItems.filtered}\nReverted: ${logItems.reverted}\nFailed: ${logItems.failed}`)

      if (!scanning && logItems.reverted + logItems.failed === logItems.filtered) {
        clearInterval(logUpdater)

        console.timeEnd('Time taken')
      }
    }, 100)

    const getAuditLogOptions = {
      group: options.group,
      actionType: 'changeRank',
      userId: options.userId > 0 ? options.userId : null,
      limit: 100
    }

    let auditLogPage = await getAuditLogPage(getAuditLogOptions)
    logItems.scanned += auditLogPage.data.length

    await revertAuditLogItems(filterAuditLogItems(auditLogPage.data))

    while (auditLogPage.nextPageCursor !== null && Date.parse(auditLogPage.data[auditLogPage.data.length - 1].created) > options.afterDate) {
      auditLogPage = await getAuditLogPage(getAuditLogOptions, auditLogPage.nextPageCursor)
      logItems.scanned += auditLogPage.data.length

      await revertAuditLogItems(filterAuditLogItems(auditLogPage.data))
    }

    scanning = false
  })

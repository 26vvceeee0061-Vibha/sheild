// ─────────────────────────────────────────────────────────
// SHEild — Telegram Bot Notification Helper
//
// How it works:
//   1. You create a bot via @BotFather on Telegram → get a BOT_TOKEN
//   2. Each trusted contact starts a chat with your bot
//   3. They get their Chat ID (by messaging @userinfobot or your bot's /start)
//   4. You store that Chat ID on the contact in this app
//   5. When SOS fires, this module calls the Telegram sendMessage API
//      directly from the browser — no backend needed!
// ─────────────────────────────────────────────────────────

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined

export interface SOSTelegramPayload {
  contactName: string
  senderName: string
  message: string
  location?: { lat: number; lng: number }
  triggeredAt: Date
}

function buildSosMessage(payload: SOSTelegramPayload): string {
  const time = payload.triggeredAt.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  const date = payload.triggeredAt.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  let text =
    `🚨 *EMERGENCY SOS ALERT* 🚨\n\n` +
    `⚠️ *${payload.senderName}* needs urgent help!\n\n` +
    `📋 *Message:*\n${payload.message}\n\n` +
    `🕐 *Time:* ${time} on ${date}\n`

  if (payload.location) {
    const mapsUrl = `https://maps.google.com/?q=${payload.location.lat},${payload.location.lng}`
    text += `\n📍 *Last Known Location:*\n[View on Google Maps](${mapsUrl})\n`
    text += `Coordinates: \`${payload.location.lat.toFixed(5)}, ${payload.location.lng.toFixed(5)}\`\n`
  } else {
    text += `\n📍 *Location:* Not available\n`
  }

  text += `\n_Please call ${payload.senderName} immediately or contact emergency services (100)._`

  return text
}

/**
 * Send an SOS alert to a single Telegram Chat ID.
 * Returns true on success, false on failure.
 */
export async function sendTelegramSOS(
  chatId: string,
  payload: SOSTelegramPayload
): Promise<boolean> {
  if (!BOT_TOKEN) {
    console.warn('[SHEild] VITE_TELEGRAM_BOT_TOKEN not set — Telegram notification skipped.')
    return false
  }

  if (!chatId.trim()) {
    console.warn('[SHEild] Empty Telegram Chat ID — skipping.')
    return false
  }

  const text = buildSosMessage(payload)

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
          disable_web_page_preview: false,
        }),
      }
    )

    const data = await response.json()

    if (!data.ok) {
      console.error('[SHEild] Telegram API error:', data.description)
      return false
    }

    console.log(`[SHEild] Telegram SOS sent to chat ${chatId}`)
    return true
  } catch (err) {
    console.error('[SHEild] Failed to send Telegram message:', err)
    return false
  }
}

/**
 * Send SOS alerts to multiple Telegram Chat IDs in parallel.
 * Returns a map of chatId → success boolean.
 */
export async function sendTelegramSOSToAll(
  chatIds: string[],
  payload: SOSTelegramPayload
): Promise<Record<string, boolean>> {
  const results = await Promise.allSettled(
    chatIds.map(chatId => sendTelegramSOS(chatId, payload))
  )

  const summary: Record<string, boolean> = {}
  chatIds.forEach((chatId, i) => {
    const result = results[i]
    summary[chatId] = result.status === 'fulfilled' && result.value === true
  })

  return summary
}

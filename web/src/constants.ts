// NOTE: general constants
export const API_URL = String(process.env.REACT_APP_API_URL || '')
export const API_V = '10.8.1'
export const DEFAULT_TOTAL_MASTERY = -1
export const DEFAULT_TOTAL_MASTERY_DISPLAY = 'N / A'
export const NETWORK_TIMEOUT = 1000
export const REGION = 'na1'

// NOTE: user constants
export const ACCT_ENCRYPTED_ANTHONY = 'U9b-KVWyJkTpQR0YiPJt7U8DFqy5llDfTJZYV56-G7onXevEOMC_DiI1'
export const NAME_ANTHONY = 'Anthony'
export const SUMMONER_ID_ANTHONY = 'hcLRomxparq_5yiMDPH-dS3iLiw4xCZhGu-pxv-uviArAiog'

export const ACCT_ENCRYPTED_KEENEN = 'OCamYtFbkjSq9tK5lMQ2KLCcFHFL0iwTv-KyAiJnIgylmw'
export const NAME_KEENEN = 'Keenen'
export const SUMMONER_ID_KEENEN = 'iQf-PRosKC7dU_JY9kYk8jYVq4n9QpQytEE3TxD_nuDrDEY'

export const ACCT_ENCRYPTED_NICOLE = 'Cn0MOwyHpDXOLaCqpbkwMoIs1M8r9IJnv39DOM867E1zTjE'
export const NAME_NICOLE = 'Nicole'
export const SUMMONER_ID_NICOLE = 'G5tCj_5KLJajQ4V6PtbYjRlY_s3lRwY0ubNe4EM-NL3pG408'

export const ACCT_ENCRYPTED_ROB = 'Z8ufPKNP9ZpxH1YTirB3axCZKXFAgYc46rPrxRjwQHtGog'
export const NAME_ROB = 'Rob'
export const SUMMONER_ID_ROB = 'ambil30qwgVvs2ud1K_z2lKxZxK1Rsuy7fqMHssNT0RX5f0'

export const ACCT_ENCRYPTED_VINNY = 'aME0ZGruQhV8etyYYIys4vqFarj13QyvFztnwVIHImEgEgiwl7OLPsRE'
export const NAME_VINNY = 'Vinny'
export const SUMMONER_ID_VINNY = 'Dm9zNbtMP8bqWlSsVgkPeu-ZwuRJbjKzn-BUvO1hiyXjyfC1'

export const USERS = [
	{
		accountId: ACCT_ENCRYPTED_ANTHONY,
		name: NAME_ANTHONY,
		summonerId: SUMMONER_ID_ANTHONY,
	},
	{
		accountId: ACCT_ENCRYPTED_NICOLE,
		name: NAME_NICOLE,
		summonerId: SUMMONER_ID_NICOLE,
	},
	{
		accountId: ACCT_ENCRYPTED_VINNY,
		name: NAME_VINNY,
		summonerId: SUMMONER_ID_VINNY,
	},
	{
		accountId: ACCT_ENCRYPTED_KEENEN,
		name: NAME_KEENEN,
		summonerId: SUMMONER_ID_KEENEN,
	},
	{
		accountId: ACCT_ENCRYPTED_ROB,
		name: NAME_ROB,
		summonerId: SUMMONER_ID_ROB,
	},
]

export const TIME_HOURS_IN_DAY = 24
export const TIME_MILLIS_IN_SECOND = 1000
export const TIME_MINS_IN_HOUR = 60
export const TIME_SECS_IN_MINUTE = 60

// NOTE: above are simple constants, below are composite constants

const KEY_BASE = 'simpleLeagueCompare'

export const KEY_API_KEY = `${KEY_BASE}.API-dev`
export const KEY_CHAMPS = `${KEY_BASE}.champs`
export const KEY_CHAMPS_LAST_SAVED = `${KEY_BASE}.saved.champs`

const FORMAT_LOCALE = 'en-US'

export const FORMATTER_CURRENCY = new Intl.NumberFormat(FORMAT_LOCALE, { currency: 'USD', style: 'currency', })
export const FORMATTER_NUMBER_FRACTION = new Intl.NumberFormat(FORMAT_LOCALE, { maximumFractionDigits: 2, minimumFractionDigits: 2, })
export const FORMATTER_NUMBER_WHOLE = new Intl.NumberFormat(FORMAT_LOCALE, { maximumFractionDigits: 0, minimumFractionDigits: 0, })

export const TIME_MILLIS_IN_DAY = TIME_MILLIS_IN_SECOND * TIME_SECS_IN_MINUTE * TIME_MINS_IN_HOUR * TIME_HOURS_IN_DAY

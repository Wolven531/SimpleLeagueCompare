# SimpleLeagueCompare

SimpleLeagueCompare is a web UI based interface designed to help query and compare the game stats for myself and my two friends.

## Running

### Windows

1. Boot up the API. Double click (or launch via command line) `start-api-on-windows.cmd`
1. Boot up the website. Double click (or launch via command line) `start-web-on-windows.cmd`
1. The URL [http://localhost:3000](http://localhost:3000) should open in the system's default web browser

### MacOS

1. Boot up the API. Using terminal, execute `start-api-on-mac.sh`
1. Boot up the website. Using terminal, execute `start-web-on-mac.sh`
1. The URL [http://localhost:3000](http://localhost:3000) should open in the system's default web browser

## Notes

* You may want to add the following line to your hosts file on Windows (located at `C:\Windows\System32\drivers\etc\hosts`)
  * `127.0.0.1            simpleleaguecompare` (whitespaces are ignored)
  * NOTE: Making changes to the hosts file requires admin access
  * Afterward, you can use the running app at [simpleleaguecompare:3000](http://simpleleaguecompare:3000)

### IDs

* `0NevErOddOrEveN0`
  * `hcLRomxparq_5yiMDPH-dS3iLiw4xCZhGu-pxv-uviArAiog` (summoner id)
  * `2096605473991232` (acct id)
  * `U9b-KVWyJkTpQR0YiPJt7U8DFqy5llDfTJZYV56-G7onXevEOMC_DiI1` (encrypted acct id)
* `NicoleLovesMusic`
  * `G5tCj_5KLJajQ4V6PtbYjRlY_s3lRwY0ubNe4EM-NL3pG408` (summoner id)
  * `221463284` (acct id)
  * `Cn0MOwyHpDXOLaCqpbkwMoIs1M8r9IJnv39DOM867E1zTjE` (encrypted acct id)
* `DucksInAC0at`
  * `Dm9zNbtMP8bqWlSsVgkPeu-ZwuRJbjKzn-BUvO1hiyXjyfC1` (summoner id)
  * `2237249085049216` (acct id)
  * `aME0ZGruQhV8etyYYIys4vqFarj13QyvFztnwVIHImEgEgiwl7OLPsRE` (encrypted acct id)

### API Endpoints

* [get by summoner name](https://developer.riotgames.com/apis#summoner-v4/GET_getBySummonerName)
  * Looks like `/lol/summoner/v4/summoners/by-name/{summonerName}`
* [get match list](https://developer.riotgames.com/apis#match-v4/GET_getMatchlist)
  * Looks like `/lol/match/v4/matchlists/by-account/{encryptedAccountId}`

## To-do

* Save to and load from users file to prevent API overchat
  * ✅ Save
  * ✅ Load
  * Optimize fire time
* Add models for each of the DTOs from Riot
* Rate limits ?
* Incorporate game constants from the [docs](https://developer.riotgames.com/docs/lol#general_game-constants)
* ✅ Display each player's last three matches
  * ✅ Adjustable
  * Display average gold over last matches
  * Display average KDA over last matches
* Display each player's most played champs
  * Perhaps limit to last 100 games
  * Perhaps limit to top three champs (not all of them)
* Display player's champion mastery
  * List mastery for each available champion
  * ✅ List total mastery achieved
* Add stat-based awards
  * Highest KDA
  * Highest KDR
  * Highest Gold Earned
  * Highest damage to champs
  * Highest damage taken
  * Highest damage to objectives

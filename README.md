# SimpleLeagueCompare

SimpleLeagueCompare is a web UI based interface designed to help query and compare the game stats for myself and my two friends.

## Notes

* You will need to add the following line to your hosts file on Windows (located at `C:\Windows\System32\drivers\etc\hosts`)
  * `127.0.0.1            simpleleaguecompare` (whitespaces are ignored)
  * Making changes to the hosts file requires admin access
  * Afterward, you can use the running app at [simpleleaguecompare:3000](http://simpleleaguecompare:3000)
* You will need to add this extension to Chrome: [extension link](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en)
  * Afterward, open the app in Chrome, click on the extension icon, then click the big "C" w/ dots by it to enable the extension on the page
  * This is necessary for fetch to work if running the app locally due to CORS in Chrome being unhappy about the lack of Access Control header in Riot's API responses

### IDs

* `0NevErOddOrEveN0` - `2096605473991232` === (acct id) `U9b-KVWyJkTpQR0YiPJt7U8DFqy5llDfTJZYV56-G7onXevEOMC_DiI1` (encrypted acct id)
* `NicoleLovesMusic` - `221463284` === (acct id) `Cn0MOwyHpDXOLaCqpbkwMoIs1M8r9IJnv39DOM867E1zTjE` (encrypted acct id)
* `DucksInAC0at` - `2237249085049216` === (acct id) `aME0ZGruQhV8etyYYIys4vqFarj13QyvFztnwVIHImEgEgiwl7OLPsRE` (encrypted acct id)

### API Endpoints

* [get by summoner name](https://developer.riotgames.com/apis#summoner-v4/GET_getBySummonerName)
  * Looks like `/lol/summoner/v4/summoners/by-name/{summonerName}`
* [get match list](https://developer.riotgames.com/apis#match-v4/GET_getMatchlist)
  * Looks like `/lol/match/v4/matchlists/by-account/{encryptedAccountId}`

## To-do

* Display each player's last three matches (maybe 5?)
* Display average gold and KDA over last matches
* Fix `fetch()` issue
* Move to running on port `8080` so the target URL can just be `simpleleaguecompare`

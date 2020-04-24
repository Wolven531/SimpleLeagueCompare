# SimpleLeagueCompare

SimpleLeagueCompare is a web UI based interface designed to help query and compare the game stats for myself and my two friends.

## Notes

### IDs

* `0NevErOddOrEveN0` - `2096605473991232` === (acct id) `U9b-KVWyJkTpQR0YiPJt7U8DFqy5llDfTJZYV56-G7onXevEOMC_DiI1` (encrypted acct id)
* `NicoleLovesMusic` - `221463284` === (acct id) `Cn0MOwyHpDXOLaCqpbkwMoIs1M8r9IJnv39DOM867E1zTjE` (encrypted acct id)
* `DucksInAC0at` - `2237249085049216` === (acct id) `aME0ZGruQhV8etyYYIys4vqFarj13QyvFztnwVIHImEgEgiwl7OLPsRE` (encrypted acct id)

### API Endpoints

* [get by summoner name](https://developer.riotgames.com/apis#summoner-v4/GET_getBySummonerName)
  * Looks like `/lol/summoner/v4/summoners/by-name/{summonerName}`
* [get match list](https://developer.riotgames.com/apis#match-v4/GET_getMatchlist)
  * Looks like `/lol/match/v4/matchlists/by-account/{encryptedAccountId}`

# Stats
This is a native stats API for [Smogon's usage stats](https://smogon.com/stats).
The endpoint should be `smogon.com/stats/search`, forwarded by NGINX.

### Search parameters:
Setting the `type` parameter (case-insensitive) in the querystring identifies the search type.
All search types (for now) require: 

`format`: The format ID.

`query`: What you're searching for.

`date`: The search date (YYYY-MM).

Optionally, `rating` can be set (0, 1500, 1630, 1760) to search in stats for specific average ELO. This defaults to 0.

### Search types:
`Pokemon` - returns:
```ts
{
    Abilities: {[name: string]: number},
    'Checks and Counters': {[pokemon: string]: number},
    Happiness: {[value: number]: number},
    Items: {[id: string]: number},
    Moves: {[name: string]: number},
    'Raw count': number,
    // includes nature, evs. ex: Timid:0/0/0/252/4/252
    Spreads: {[spread: string]: number},
    Teammates: {[mon: string]: number},
    'Viability Ceiling': [number, number, number, number],
    usage: number,
}
```

`Ability` - returns: 
```ts
{
    results: {pokemon: string, usage: number}[],
    matches: number,
}

```

`Item` - returns:
```ts
{
    results: {pokemon: string, usage: number}[],
    matches: number,
}

```


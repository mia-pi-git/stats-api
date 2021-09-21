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
    'Raw count': number;
    usage: number;
    // num GXE, max GXE, 1% GXE, 20% GXE
    'Viability Ceiling': [number, number, number, number];
    Abilities: {[ability: string]: number};
    Items: {[item: string]: number};
    Spreads: {[spread: string]: number};
    Happiness?: {[happiness: string]: number};
    Moves: {[move: string]: number};
    Teammates: {[pokemon: string]: number};
    // thanks pre for the reminders of what these do
    // n = sum(POKE1_KOED...DOUBLE_SWITCH)
    // p = POKE1_KOED + POKE1_SWITCHED_OUT / n
    // d = sqrt((p * (1 - p)) / n)
    'Checks and Counters': { [pokemon: string]: [number, number, number] };
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


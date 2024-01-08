# Open Kanban

You only need to add a `Public` label to the Issue in Linear, and it will automatically synchronize to Open Kanban.

## How To Use

### Deploy to Vercel

1. Create an issue with the name Public in Team Settings / Labels on Linear.

2. Create an API Key in My Account / API on Linear.

3. Click the button below to deploy to Vercel.

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhamsterbase%2Fopen-kanban)

4. Add in the Settings / Environment Variables section on Vercel.

   `LINEAR_API_KEY`: API Key created in step 2.

### Force Reload

The Open Kanban will prioritize reading data from the cache, and will only fetch data from Linear again if the cache time exceeds 1 hour. If you want to force a refresh, you can add `?forceReloadToken=FORCE_RELOAD_TOKEN` to the end of the Open Kanban URL.

You should add `FORCE_RELOAD_TOKEN` in the Settings / Environment Variables section on Vercel

## License

MIT License

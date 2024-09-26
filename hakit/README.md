## HAKIT Dashboard

This addon simply serves your custom dashboard to a new sidebar link in home assistant making it easier to access your custom dashboard.

This (over time) will evolve into a much more complicated addon where users will be able to design & build dashboards as well as download / upload custom templates from the community or create their own.

### Options

- `html_file_path` - The relative path within the 'config' directory to the index.html file to serve.
- `spa_mode` - Enable SPA mode to reroute all traffic to the index.html file for a single page application.
- `custom_dashboard` - Enable custom dashboard mode to allow users to design their own dashboards, else it will show the UI to download the prebuilt dashboard UI


### Further Tips

By default, the html file path is set to `www/ha-dashboard/index.html` and spa mode is set to true. If you want to change this, simply navigate to the configurations tab and change the options there.

The html_file_path option should be relative to the config directory of your home assistant instance.

If you're using the [deploy](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/introduction-deploying--docs) functionality from @hakit, you should already have uploaded your dashboard to the correct location.

If you provide an invalid path, the addon will produce found html files and will help you pick the correct path!

If you're uploading a new version of your dashboard, there's no need to restart the addon, it will simply serve the latest files automatically :)

### Local Home Assistant Development

1. npm i in this repository
2. Add a .env file with the following:
```
VITE_SSH_USERNAME=XX      ## eg root
VITE_SSH_PASSWORD=XX      ## pw
VITE_SSH_HOSTNAME=XX      ## 192.168.1.13
```
3. run `npm run copy-to-ha`

This will copy up a development version of the addon, you should see `Hakit-dev` as an option in the addons store.
Install it, every time you make changes to the addon, simply run `npm run copy-to-ha` and rebuild the addon in home assistant.


Note: connecting to samba share from mac, Finder -> Connect to server -> smb://homeassistant.local



### Local Development

This will simply spin up a localized version of the addon without connecting to home assistant, easier to update styles etc, Running the dashboard interface for the addon is as simple as running:

1. Create an `options.json` file under the `server` directory:
```json
{
  "html_file_path": "www/ha-dashboard/index.html",
  "spa_mode": true,
  "custom_dashboard": false // switching to true will attempt to load a html file under hakit/config/www/ha-dashboard/index.html so you will need to create the `config` folder as well as all subdirectories if you're testing this flow.
}
```
2. create a `service-account.json` file with credentials in the `hakit/config/hakit-designer` directory.
3. `npm i && npm run dev`

This will spin up a server under `http://localhost:2022`


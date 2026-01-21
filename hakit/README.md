## HAKIT Dashboard

This add-on simply serves an existing dashboard HTML file inside Home Assistant. Point it at your built `index.html`, it starts a small server, and Home Assistant shows it via a sidebar entry (Ingress). There's no build step here—just serving the file you already have.

> This does expect that you've uploaded your custom dashboard output code to the `config/www` directory of your home assistant instance. If you're using/used `npm create hakit@latest` to create your dashboard, it will already be setup to upload your dashboard to the correct location using the `npm run deploy` command.

### Installation

1. Copy this repository url "https://github.com/shannonhochkins/ha-component-kit"
2. Navigate to the "Add-ons" section in home assistant
3. Click on "Add-on Store"
4. In the top right, click on the 3 dots and select "Repositories"
5. Paste the url you copied in step 1 into the "Add repository" box and click "Add"
6. If you don't see the repo immediately, close and reopen the Add-on Store; then open the new repository and click on "HAKIT"
7. Click on "Install" and wait for the installation to complete
8. Click "Start" to start the addon, and toggle "Show in sidebar" so it appears in the sidebar

> You should now see the "HAKIT Dashboard" option in the sidebar menu which should load your custom dashboard.

**NOTE**: You may have to change the `html_file_path` in the configuration tab of the addon.

### Options

- `html_file_path` – Relative to your Home Assistant `config` directory; defaults to `www/ha-dashboard/index.html`.
- `spa_mode` – If true, all routes fall back to the configured HTML (single-page app); defaults to `true`


### Further Tips

If `html_file_path` is invalid, the add-on lists available HTML files under `config/www` to help you pick the right one. Updates to the HTML are served automatically—no add-on restart needed.

> If you're using the [deploy](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/introduction-deploying--docs) functionality from @hakit/ha-component-kit, the dashboard will already be uploaded to the correct location assuming you haven't changed the name of the folder.

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
  "spa_mode": true
}
```
2. `npm i && npm run dev`
3. May need to create a "config" directory under the `hakit` directory containing the file path of the `html_file_path` option above.

```
hakit
  server
    - options.json
  config
    - www
        - ha-dashboard
            - index.html
```

This will spin up a server under `http://localhost:2022`


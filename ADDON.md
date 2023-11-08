# HAKIT Dashboard Addon

This addon simply serves your custom dashboard to a new sidebar link in home assistant making it easier to access your custom dashboard.

This (over time) will evolve into a much more complicated addon where users will be able to design & build dashboards as well as download / upload custom templates from the community or create their own.

NOTE: This does expect that you've uploaded your custom dashboard output code to the config directory of your home assistant instance. If you're using/used `npm create hakit@latest` to create your dashboard, it will already be setup to upload your dashboard to the correct location using the `npm run deploy` command.


### Installation

1. Copy this repository url "https://github.com/shannonhochkins/ha-component-kit"
2. Navigate to the "Add-ons" section in home assistant
3. Click on "Add-on Store"
4. In the top right, click on the 3 dots and select "Repositories"
5. Paste the url you copied in step 1 into the "Add repository" box and click "Add"
6. Click on the new repository you just added and click on "HAKIT"
7. Click on "Install" and wait for the installation to complete
8. Click on "Start" to start the addon, tick "Show in sidebar"

You should now see the "HAKIT Dashboard" option in the sidebar menu which should load your custom dashboard!


#### Local Development
Set your directory to the hakit folder, After `npm install`, Simply run `npm run dev` and it will spin up a server and client under port 2022.

#### Options
To get this to work locally, create an options.json file under the server directory with the following contents:
```
{
  "html_file_path": "www/ha-dashboard/index.html",
  "spa_mode": true
}
```
This will You will also need to create a "config" directory under the `hakit` directory containing the file path of the `html_file_path` option above.

```
hakit
  server
    - options.json
  config
    - www
        - ha-dashboard
            - index.html
```


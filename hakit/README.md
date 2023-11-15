## HAKIT Dashboard

This addon simply serves your custom dashboard to a new sidebar link in home assistant making it easier to access your custom dashboard.

This (over time) will evolve into a much more complicated addon where users will be able to design & build dashboards as well as download / upload custom templates from the community or create their own.

### Options

- `html_file_path` - The relative path within the 'config' directory to the index.html file to serve.
- `spa_mode` - Enable SPA mode to reroute all traffic to the index.html file for a single page application.


### Further Tips

By default, the html file path is set to `www/ha-dashboard/index.html` and spa mode is set to true. If you want to change this, simply navigate to the configurations tab and change the options there.

The html_file_path option should be relative to the config directory of your home assistant instance.

If you're using the [deploy](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/introduction-deploying--docs) functionality from @hakit, you should already have uploaded your dashboard to the correct location.

If you provide an invalid path, the addon will produce found html files and will help you pick the correct path!

If you're uploading a new version of your dashboard, there's no need to restart the addon, it will simply serve the latest files automatically :)


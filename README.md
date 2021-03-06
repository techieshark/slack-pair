
## slack commands for communicating about pairing / coworking with your team

So you can find teammates to pair on the company website or a bite to eat, for example:

<img src="https://cloud.githubusercontent.com/assets/1072292/11916732/29b14076-a749-11e5-8434-4a345f5256ed.png" alt="Slack-Pair example screenshot">


### Usage

Use "/pair" alone to list the status of all teammates:

> `/pair`

> Yes! Someone should come find me now. Let's pair:
>
> * Jeremia: "Want to work on design today! Open to other ideas." <br>
> * Giselle: "Would love to do learn some JS today, or teach design"
>
> OK. I'm working now but feel free to interrupt me:
>
>  * Molly
>  * Tom
>
> Nope. Do Not Disturb:
>
>  * Jason: travelling
>  * Maksim
>  * Peter: deadlines!

Use "/pair [yes/ok/no]" to set your status

> `/pair yes`

> Yes! You want to pair.
> Use "/pair yes [subject]" to specify the [subject] you want to pair on.

or

> `/pair ok`
>
> OK! You're working but are OK with occassional interruptions for brief pairing.

or

> `/pair no`
>
> Bummer! You're too busy for pairing.

### Setup & Run

1. get a copy of the source: `git clone https://github.com/techieshark/slack-pair.git && cd slack-pair`
2. you can start it by just running `npm start`, but first:
3. follow the [instructions for configuring the Slack integration](https://github.com/techieshark/slack-pair/issues/14).
4. If you want notifications sent to a channel (e.g. "Samantha says yes to pairing (kernel debugging)"), configure an incoming webhook (name=pair, description="pair with buddies", channel = whatever channel you want things sent to), then copy the channel & webhook url to your config file and uncomment the lines for SLACK_PAIR_CHANNEL and SLACK_WEBHOOK_URL. Make sure to `$ source your-slack-domain.env` after you've copied and edited the env.sample.
5. By default, `pair` will run using an in-memory data store, which works for testing purposes but as soon as the app restarts (which could be more than once a day on Heroku), the list of users wanting to pair will be wiped. To prevent that, set up a MongoDB database, update `MONGO_URL` in your environment (see `env.sample`) and switch `DB_PROVIDER` from `memory` to `mongo` (again, see `env.sample`).

### Deploying to Heroku

1. Follow the setup instructions above. You should have `pair` up and running on your development machine, and connected to Slack through an `ngrok`-provided URL.
2. Create a heroku app: `heroku create your-app`.
3. Copy `heroku-sample.env` to `your-app.heroku.env`. Put your environment settings in that file.
4. If you want to user MongoDB, create that addon: `heroku addons:create mongolab:sandbox`. You'll need to create a new user / password and update the MONGO_URL in your environment settings. If you don't do this, you'l just run in memory and the pair list will reset fairly often (ok for testing, a bummer for production).
5. Push your confit to heroku: `heroku config:push -e your-app.heroku.env`.
6. Deploy to Heroku: `git push heroku master`
7. Update Slack's URL setting in the Custom Integration you set up in `Setup & Run` above. Your URL should look like https://your-app.herokuapp.com.
8. Enjoy!


### Contributing

[Pull requests](https://help.github.com/articles/using-pull-requests/) are welcome and encouraged! You'll need

1. A slack account and the [ability to add slash commands](http://YOURTEAMNAME.slack.com/services/new/slash-commands)
2. [ngrok](https://ngrok.com/) or some other method of exposing a local port through a public URL

Once you pull down the project, simply run `npm install` to set up the dependencies. There is a required `PAIRBOT_URL` environment variable but you can `source env.sample` to set it. This is used so that the bot pings itself to keep the Heroku dynos up.

Then you should be able to just `npm start` (or `node web.js`) and be off to the races.

You'll be wanting a slack command integration and supply a publicly accessible URL along with a testing command. Slack uses these commands to trigger the integration. To test out your app you'll tell slack to `/<your_testing_command> ok test all the things`.

Of course, if you run into any problems you can always open an [issue](https://github.com/techieshark/slack-pair/issues).


### Credits

This is a collaborative project. We welcome your contributitions (see above). Ping [@techieshark](https://twitter.com/techieshark) on twitter if you want to get involved.

Code originally by [@jeremiak](https://github.com/jeremiak) & [@techieshark](https://github.com/techieshark). Other collaborators listed here: https://github.com/techieshark/slack-pair/graphs/contributors.

Special thanks to Ainsley ([@ainsleywagon](https://github.com/ainsleywagon)) for designing such a cool pair icon (https://thenounproject.com/term/pair/19161/).

---

**happy pairing :)**

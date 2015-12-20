
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

### contributing

[Pull requests](https://help.github.com/articles/using-pull-requests/) are welcome and encouraged! You'll need

1. A slack account and the [ability to add slash commands](http://YOURTEAMNAME.slack.com/services/new/slash-commands)
2. [ngrok](https://ngrok.com/) or some other method of exposing a local port through a public URL

Once you pull down the project, simply run `npm install` to set up the dependencies. There is a required `PAIRBOT_URL` environment variable but you can `source env.sample` to set it. This is used so that the bot pings itself to keep the Heroku dynos up.

Then you should be able to just `npm start` (or `node web.js`) and be off to the races.

You'll be wanting a slack command integration and supply a publicly accessible URL along with a testing command. Slack uses these commands to trigger the integration. To test out your app you'll tell slack to `/<your_testing_command> ok test all the things`.

Of course, if you run into any problems you can always open an [issue](https://github.com/techieshark/slack-pair/issues).

**happy pairing :)**

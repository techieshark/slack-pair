
## slack commands for communicating about pairing / coworking with your team

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

## contributing

Pull requests are of course welcome and encouraged! You'll need

1. A slack account and the [ability to add slash commands](http://YOURTEAMNAME.slack.com/services/new/slash-commands)
2. [ngrok](https://ngrok.com/) or some other method of exposing a local port through a public URL

Once you pull down the project, simply run `npm install` to set up the dependencies. There is a required `PAIRBOT_URL` environment variable but you can `source env.sample` to set it. This is used so that the bot pings itself to keep the Heroku dynos up.

Then you should be able to just `node web.js` and be off to the races.

You'll be wanting a slack command integration and supply a publicly accessible URL along with a testing command. Slack uses these commands to trigger the integration. To test out your app you'll tell slack to `/<your_testing_command> ok test all the things`.

Of course, if you run into any problems you can always open an [issue](https://github.com/techieshark/slack-pair/issues).

**happy pairing :)**

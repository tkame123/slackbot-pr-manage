# What is this?
Github PR create tools for Slack.

# Usage

slashCommands(sample)

`/pr repo(:own/:repo) base head message`

Ex: dev(branch) => master(branch)
`/pr <your repo name> dev master`

default value
```
base: dev
head: master
```

# Setting

## Slack SlashCommand
`URL => my function URL`

## Frebase Deploy

```$xslt
firebase deploy --only functions createPR
```

```
firebase functions:config:set key.slack="<your key>"
firebase functions:config:set key.github="<your key>"
```

for delete
```
firebase functions:config:unset key
```
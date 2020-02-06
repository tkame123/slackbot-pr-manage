# What is this?
Github PR create tools for Slack.

# Usage

slashCommands(sample)

`/pr repo(:own/:repo) head base message`

Ex: dev(branch) => master(branch)
`/pr <your repo name> develop master`

default value
```
head: develop
base: master
```

# Setting

## Slack SlashCommand
`URL => my function URL`

## Frebase Deploy

```$xslt
firebase deploy --only functions:createPR
```

```
firebase functions:config:set key.slack="<your key>"
firebase functions:config:set key.github="<your key>"
```

for delete
```
firebase functions:config:unset key
```

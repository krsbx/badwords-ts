# Badwords-TS

A [badwords-js](https://github.com/web-mech/badwords) alternatives

# Why use Badwords-TS

Do you ever need to use more filters for different languanges than english? Ever though that some of your languanges is not supported by `badwords-js`? This package will fix those problems for you. By having a list of bad words in clouds, you can load it on the go. An example of the settings can be found in [badwords-ts.settings.json](./src/test/badwords-ts.settings.json).

# How to use?

It use singleton so all the settings for the instance can be use all around the projects. For using the instance, just use the `instance` property from `BadwordFilter` class.

```ts
import BadwordFilter from 'badwords-ts';

///

// Using the singleton instance
BadwordFilter.instance;

///
```

# API

### Removing Badwords

```ts
BadwordFilter.instance.clean('just a bad word');
```

### Changing the censors/placeholder

```ts
// By default is using asterisk (*)
BadwordFilter.instance.placeHolder = '#'; // It will change censors to # instead of *
```

### Add a New Bad Word

```ts
BadwordFilter.instance.addWords('txt', 'asd'); // Will mark 'txt' and 'asd' as a bad word
```

### Exclude a Bad Word

```ts
BadwordFilter.instance.removeWords('txt', 'asd'); // Will mark 'txt' and 'asd' as not a bad word
```

### Check a word is a bad word

```ts
BadwordFilter.instance.isProfane('bad'); // Will return a boolean
```

### Download word banks from the settings

```ts
BadwordFilter.instance.downloadWordBank();
```

### Load word banks from the settings

```ts
BadwordFilter.instance.loadWordBank();
```

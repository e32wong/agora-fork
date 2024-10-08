# Agora (@zkorum/agora)

Anonymous Space For Open Dialogues

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

Remember to first load the environment files in `.env` file by running `. ./.env`.
There is an example file `env.example` which can be used as the reference.

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

### Icon Genie Bootstrap Commands

Generate the json configuration file:

`icongenie profile  --output icongenie-profile-png.json --assets spa,capacitor --icon ./icongenie/appIcon.png --theme-color 090f53 --filter png --background ./icongenie/splash-background.png`

`icongenie profile  --output icongenie-profile-splashscreen.json --assets spa,capacitor --icon ./icongenie/splash-set.png --theme-color 090f53 --filter splashscreen --background ./icongenie/splash-background.png`

Generate the actual icons:

`icongenie generate -p ./icongenie-profile-png.json`

`icongenie generate -p ./icongenie-profile-splashscreen.json`

## License

See [COPYING](./COPYING)

### Country Flags

MIT - [https://gitlab.com/catamphetamine/country-flag-icons/](https://gitlab.com/catamphetamine/country-flag-icons/)
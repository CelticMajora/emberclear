# Contributing

## Building
emberclear can be built and run with
```
cd client/web/emberclear
yarn install
yarn start:dev
```
and then can be visited at `http://localhost:4201`.

## Testing
Run the tests locally with
```
cd client/web/emberclear
yarn test
```

## For working with the Relay
```bash
git submodule update --init --recursive
cd client/web/emberclear && yarn start:dev
```


#### Debugging

Module Resolution:
```js
// shows all detected services
Object.keys(window.requirejs.entries).filter(b => b.includes("service"))
```

File Watch Problems?
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

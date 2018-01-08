# GitCracken

`GitKraken` Pro/Enterprise v3.3.1 utils for non-commercial use

Working on `GNU/Linux`, `Windows` and `macOS`!

## Usage

- `yarn install`
- `node dist/bin/gitcracken.js --help` for more usage information

### Patcher

`$ gitcracken patcher [actions] [options]`

`actions` - array of values (any order, any count)

> If `actions` is empty, will be used `auto` mode (ideal for beginners)

Action   | Description
-------- | -------------------------------------
`backup` | Backup `app.asar` file
`unpack` | Unpack `app.asar` file into directory
`patch`  | Patch directory
`pack`   | Pack directory to `app.asar`
`remove` | Remove directory

Option      | Description (if not defined, will be used `auto` value)
----------- | -------------------------------------------------------
`--asar`    | Path to `app.asar` file
`--dir`     | Path to directory
`--feature` | Patcher feature `pro` or `enteprise`

#### Examples

`Auto` patch installed `GitKraken` (maybe require `sudo` privileges on `GNU/Linux`)

`$ gitcracken patcher`

> WARNING! On `macOS` you should patch `GitKraken` only after first launch and full program closing!

`Auto` patch installed `GitKraken` + unlock `Enterprise` edition

`$ gitcracken patcher --feature enteprise`

Use custom path to `app.asar`

`$ gitcracken patcher --asar ~/Downloads/gitkraken/resources/app.asr`

Use custom `actions` (`backup`, `unpack` and `patch`)

`$ gitcracken patcher backup unpack patch`

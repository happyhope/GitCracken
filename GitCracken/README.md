# GitCracken

GitKraken utils for non-commercial use

Working on `GNU/Linux` (without `snap`), `Windows` and `macOS`!

> WARNING! On `macOS` you should patch `GitKraken` only after first launch and full program closing!

## Requirements

- `Node.js` v12 LTS or later
- `yarn`

## Usage

- `yarn install`
- `yarn build`
- `node dist/bin/gitcracken.js --help` for more usage information

### Patcher

```bash
$ gitcracken patcher [options] [actions...]
```

`actions` - array of values (any order, any count)

> If `actions` is empty, will be used `auto` mode (ideal for beginners)

| Action   | Description                                 |
|----------|---------------------------------------------|
| `backup` | Backup `app.asar` file                      |
| `unpack` | Unpack `app.asar` file into `app` directory |
| `patch`  | Patch `app` directory                       |
| `pack`   | Pack `app` directory to `app.asar` file     |
| `remove` | Remove `app` directory                      |

| Option            | Description (if not defined, will be used `auto` value)         |
|-------------------|-----------------------------------------------------------------|
| `-a`, `--asar`    | Path to `app.asar` file                                         |
| `-d`, `--dir`     | Path to `app` directory                                         |
| `-f`, `--feature` | Patcher feature (from [patches](patches) dir without extension) |

> You can invoke `-f`, `--feature` several times to apply all patches!

### Examples

`Auto` patch installed `GitKraken` (maybe require `sudo` privileges on `GNU/Linux`)

```bash
$ gitcracken patcher
```

Use custom path to `app.asar`

```bash
$ gitcracken patcher --asar ~/Downloads/gitkraken/resources/app.asar
```

Use custom `actions` (`backup`, `unpack` and `patch`)

```bash
$ gitcracken patcher backup unpack patch
```

## Disable Automatic Update

Add this content to your `hosts` file:

```text
0.0.0.0 release.gitkraken.com
```

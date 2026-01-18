# .piprc (Project Config)

`.piprc` is an organism-level configuration file for the `.pip` kernel.

It is intentionally simple and safe:
- **Format**: `KEY=VALUE` per line
- **Comments**: lines starting with `#`
- **No secrets**: use `.envrc` for tokens/credentials

## What it controls

### Execution modes

The unified CLI (`bin/pip`) uses `PIP_MODE` to gate side effects:
- `observe` — read-only exploration
- `propose` — read-only planning
- `execute` — allow file/branch modifications

### Action mode (execution strategy)

`PIP_ACTION_MODE` controls *how* side-effecting commands behave when `PIP_MODE=execute`:
- `live` — run normally (default)
- `confirm` — prompt before side-effecting commands
- `dry-run` — avoid side effects (currently only `pip wrap` is supported; other side-effecting commands are blocked)

## Resolution order

When `bin/pip` resolves configuration:
1. Environment variables (e.g. `PIP_MODE=execute`)
2. `.piprc` in the organism root
3. Kernel defaults

## Getting started

### Create or upgrade `.piprc`

From the organism root:

```bash
# If .pip is vendored or submodule:
./.pip/bin/pip migrate

# If working directly in the kernel repo:
./bin/pip migrate
```

This will:
- Create `.piprc` if it does not exist
- Ensure `PIPRC_VERSION=1` is present
- Migrate legacy keys when possible

### Check your current mode

```bash
./bin/pip mode
```

## Example `.piprc`

```text
PIPRC_VERSION=1
PIP_MODE=propose
PIP_ACTION_MODE=live
```

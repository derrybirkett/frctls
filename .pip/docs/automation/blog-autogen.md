# Blog Autogen (Release Notes)

This repository can automatically draft and merge release blog posts based on `docs/changelog.md`.

## How it works

- On pushes to `main`, the workflow checks whether a new release heading was added to `docs/changelog.md`.
- If it detects a new heading like `## YYYY-MM-DD — Some Title`, it generates a Jekyll post under `_posts/`.
- It then opens a PR labeled `autogen-blog` and `automerge`.

## Escape hatch

- Add the label `hold` to an autogen PR to prevent the scheduled automerge job from merging it.

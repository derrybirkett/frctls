#!/usr/bin/env bash
set -euo pipefail

KERNEL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# If .pip is used as a git submodule, run wrap-up against the superproject
# (the organism) rather than the detached submodule checkout.
SUPERPROJECT_DIR="$(cd "$KERNEL_DIR" && git rev-parse --show-superproject-working-tree 2>/dev/null || true)"
if [[ -n "${SUPERPROJECT_DIR}" ]]; then
  ROOT_DIR="$SUPERPROJECT_DIR"
else
  ROOT_DIR="$KERNEL_DIR"
fi

DRY_RUN="${PIP_WRAP_UP_DRY_RUN:-0}"
CONFIRM_DOCS_DEFAULT="${PIP_WRAP_UP_CONFIRM_DOCS:-}"
COMMIT_MSG_DEFAULT="${PIP_WRAP_UP_COMMIT_MSG:-}"
TAG_NAME_DEFAULT="${PIP_WRAP_UP_TAG_NAME:-}"
TAG_MSG_DEFAULT="${PIP_WRAP_UP_TAG_MSG:-}"
SKIP_PUSH="${PIP_WRAP_UP_SKIP_PUSH:-0}"

TAG_NAME_ENV_SET=0
if [[ -v PIP_WRAP_UP_TAG_NAME ]]; then
  TAG_NAME_ENV_SET=1
fi

check_file(){
  local file="$1"
  if [[ ! -s "$file" ]]; then
    echo "[WARN] $file is missing or empty. Update docs before wrapping up." >&2
  fi
}

echo "=== Wrap-Up Checklist ==="
check_file "$KERNEL_DIR/docs/processes/wrap-up-checklist.md"
check_file "$ROOT_DIR/docs/activity-log.md"
check_file "$ROOT_DIR/docs/changelog.md"
echo "Review \"docs/processes/wrap-up-checklist.md\" and ensure every step is complete."

confirm_docs="${CONFIRM_DOCS_DEFAULT}"
if [[ -z "$confirm_docs" ]]; then
  read -rp "Have you updated activity log and changelog? [y/N] " confirm_docs
fi
if [[ ! "$confirm_docs" =~ ^[Yy]$ ]]; then
  echo "Please update docs before wrapping up." >&2
  exit 1
fi

echo "=== Git Status ==="
( cd "$ROOT_DIR" && git status -sb )

commit_msg="${COMMIT_MSG_DEFAULT}"
if [[ -z "$commit_msg" ]]; then
  read -rp "Enter commit message (leave blank to cancel): " commit_msg
fi
if [[ -z "$commit_msg" ]]; then
  echo "Commit cancelled." >&2
  exit 1
fi

cd "$ROOT_DIR"

if [[ "$DRY_RUN" = "1" ]]; then
  echo "=== DRY RUN ==="
  echo "Would run: git add -A"
  echo "Would run: git commit -m \"$commit_msg\""

  tag_name="${TAG_NAME_DEFAULT}"
  if [[ "$TAG_NAME_ENV_SET" = "1" ]]; then
    case "$tag_name" in
      ""|skip|SKIP|none|NONE|no|NO) tag_name="" ;;
    esac
  else
    if [[ -z "$tag_name" ]]; then
      read -rp "Tag release? (e.g., v0.4.0) [leave blank to skip]: " tag_name
    fi
  fi

  if [[ -n "$tag_name" ]]; then
    tag_msg="${TAG_MSG_DEFAULT}"
    if [[ -z "$tag_msg" ]]; then
      read -rp "Tag description: " tag_msg
    fi
    echo "Would run: git tag -a \"$tag_name\" -m \"$tag_msg\""
  fi

  if [[ "$SKIP_PUSH" = "1" ]]; then
    echo "Would skip: git push"
  else
    echo "Would run: git push"
    if [[ -n "${tag_name:-}" ]]; then
      echo "Would run: git push origin \"$tag_name\""
    fi
  fi

  echo "Wrap-up dry-run complete."
  exit 0
fi

git add -A
git commit -m "$commit_msg"

tag_name="${TAG_NAME_DEFAULT}"
if [[ "$TAG_NAME_ENV_SET" = "1" ]]; then
  case "$tag_name" in
    ""|skip|SKIP|none|NONE|no|NO) tag_name="" ;;
  esac
else
  if [[ -z "$tag_name" ]]; then
    read -rp "Tag release? (e.g., v0.4.0) [leave blank to skip]: " tag_name
  fi
fi
if [[ -n "$tag_name" ]]; then
  tag_msg="${TAG_MSG_DEFAULT}"
  if [[ -z "$tag_msg" ]]; then
    read -rp "Tag description: " tag_msg
  fi
  git tag -a "$tag_name" -m "$tag_msg"
fi

if [[ "$SKIP_PUSH" = "1" ]]; then
  echo "Skipping push (PIP_WRAP_UP_SKIP_PUSH=1)."
  echo "Next steps:"
  echo "  - git push"
  if [[ -n "${tag_name:-}" ]]; then
    echo "  - git push origin \"$tag_name\""
  fi
  exit 0
fi

git push
if [[ -n "${tag_name:-}" ]]; then
  git push origin "$tag_name"
fi

echo "Wrap-up complete."

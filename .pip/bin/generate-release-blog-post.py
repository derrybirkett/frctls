#!/usr/bin/env python3

import argparse
import os
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class ReleaseHeading:
    date: str
    title: str
    raw: str


def _run(cmd: list[str]) -> str:
    result = subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return result.stdout


def _slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-") or "release"


def _detect_release_heading_from_diff(before: str, after: str) -> ReleaseHeading | None:
    diff = _run(["git", "diff", f"{before}..{after}", "--", "docs/changelog.md"])

    # Look for newly-added release headings like:
    # +## 2025-12-30 — Some Title
    added_headings: list[ReleaseHeading] = []
    for line in diff.splitlines():
        if not line.startswith("+## "):
            continue
        if line.startswith("+## Unreleased"):
            continue

        match = re.match(r"^\+##\s+(\d{4}-\d{2}-\d{2})\s+—\s+(.*)\s*$", line)
        if not match:
            continue

        date = match.group(1)
        title = match.group(2).strip()
        added_headings.append(ReleaseHeading(date=date, title=title, raw=line[1:]))

    # Choose the first heading encountered in diff order (usually the newest section near the top).
    return added_headings[0] if added_headings else None


def _extract_changelog_section(changelog_text: str, heading_line: str) -> str:
    lines = changelog_text.splitlines()
    try:
        start_index = lines.index(heading_line)
    except ValueError:
        # Heading may have different whitespace; fall back to regex match by date.
        m = re.match(r"^##\s+(\d{4}-\d{2}-\d{2})\s+—\s+.*$", heading_line)
        if not m:
            raise
        date = m.group(1)
        pattern = re.compile(rf"^##\s+{re.escape(date)}\s+—\s+.*$")
        start_index = next(i for i, l in enumerate(lines) if pattern.match(l))

    section_lines: list[str] = []
    for i in range(start_index + 1, len(lines)):
        line = lines[i]
        if line.startswith("## "):
            break
        section_lines.append(line)

    # Trim leading/trailing blank lines
    while section_lines and section_lines[0].strip() == "":
        section_lines.pop(0)
    while section_lines and section_lines[-1].strip() == "":
        section_lines.pop()

    return "\n".join(section_lines).rstrip() + "\n"


def _write_github_output(output_path: str, key: str, value: str) -> None:
    if not output_path:
        return
    with open(output_path, "a", encoding="utf-8") as f:
        f.write(f"{key}={value}\n")


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate a Jekyll blog post from a newly-added changelog release heading.")
    parser.add_argument("--before", required=True, help="Git SHA before the push")
    parser.add_argument("--after", required=True, help="Git SHA after the push")
    parser.add_argument("--author", default="COO")
    parser.add_argument("--tags", default="release,changelog")
    args = parser.parse_args()

    heading = _detect_release_heading_from_diff(args.before, args.after)
    if heading is None:
        _write_github_output(os.getenv("GITHUB_OUTPUT", ""), "created", "false")
        print("No new release heading detected in docs/changelog.md; skipping post generation.")
        return 0

    slug = _slugify(heading.title)
    post_path = Path("_posts") / f"{heading.date}-{slug}.md"
    if post_path.exists():
        _write_github_output(os.getenv("GITHUB_OUTPUT", ""), "created", "false")
        _write_github_output(os.getenv("GITHUB_OUTPUT", ""), "post_path", str(post_path))
        print(f"Post already exists at {post_path}; skipping.")
        return 0

    changelog_text = Path("docs/changelog.md").read_text(encoding="utf-8")
    section = _extract_changelog_section(changelog_text, heading.raw)

    tags = [t.strip() for t in args.tags.split(",") if t.strip()]
    tags_yaml = ", ".join(f"\"{t}\"" for t in tags)

    title = f"{heading.title}"
    description = f"Release notes for {heading.date}: {heading.title}."

    post_path.parent.mkdir(parents=True, exist_ok=True)
    post_path.write_text(
        "\n".join(
            [
                "---",
                f'title: "{title}"',
                f'description: "{description}"',
                f"date: {heading.date}",
                f'author: "{args.author}"',
                f"tags: [{tags_yaml}]",
                "---",
                "",
                f"# {title}",
                "",
                "This post was automatically generated from `docs/changelog.md`.",
                "",
                "## Release Notes",
                "",
                section.rstrip(),
                "",
            ]
        ),
        encoding="utf-8",
    )

    _write_github_output(os.getenv("GITHUB_OUTPUT", ""), "created", "true")
    _write_github_output(os.getenv("GITHUB_OUTPUT", ""), "post_path", str(post_path))
    _write_github_output(os.getenv("GITHUB_OUTPUT", ""), "release_date", heading.date)
    _write_github_output(os.getenv("GITHUB_OUTPUT", ""), "release_title", heading.title)

    print(f"Generated post at {post_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

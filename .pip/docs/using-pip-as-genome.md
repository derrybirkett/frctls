# Using .pip as Genome: The Template/Expression Model

## The Core Concept

Think of `.pip` as **DNA/genome** and your project as the **organism** that expresses it.

- **`.pip` (Genome)** = Immutable template providing instructions, patterns, and examples
- **Your Project (Organism)** = Living implementation that reads from `.pip` but maintains its own documentation

**Critical Rule:** `.pip` stays pristine. Your project never modifies `.pip` files directly.

## Why This Matters

### The Wrong Approach ❌
```
my-project/
└── .pip/                         # ❌ Modified by project
    └── docs/
        ├── activity-log.md       # ❌ Contains my-project's actual history
        └── changelog.md          # ❌ Contains my-project's releases
```

**Problems:**
- Violates genome immutability
- Git submodule conflicts
- Can't update `.pip` without losing project history
- Confusing: is this a template or actual documentation?

### The Right Approach ✅
```
my-project/
├── .pip/                         # ✅ Immutable submodule (genome)
│   └── docs/
│       ├── activity-log.md       # Template/example from pip project
│       ├── changelog.md          # Template/example from pip project
│       └── blog/                 # Examples of blog posts
└── docs/                         # ✅ Your project's actual docs (expression)
    ├── activity-log.md           # Your project's actual history
    ├── changelog.md              # Your project's actual releases
    ├── mission.md                # Your project-specific mission
    └── blog/                     # Your project's actual blog posts
```

**Benefits:**
- Clear separation: template vs. reality
- `.pip` stays pristine (can be updated independently)
- Each project maintains its own history
- No git submodule complications

## Setting Up Your Project

### 1. Add .pip as Submodule

```bash
cd your-project
git submodule add https://github.com/derrybirkett/pip.git .pip
git submodule update --init --recursive
```

### 2. Bootstrap Your Documentation

Copy template structure from `.pip` to create your project's docs:

```bash
# Create your project's documentation directory
mkdir -p docs

# Copy activity log template
cp .pip/docs/templates/organism-activity-log.md docs/activity-log.md

# Copy changelog template
cp .pip/docs/templates/organism-changelog.md docs/changelog.md

# Copy blog structure if needed
cp -r .pip/docs/blog docs/blog

# Remove pip-specific examples
# Edit docs/activity-log.md - remove pip's history, add your first entry
# Edit docs/changelog.md - update with your project name and first release
```

### 3. Create Project-Specific Documentation

Add files that are unique to your project:

```bash
# Mission (customize for your project)
cp .pip/mission/mission.md docs/mission.md
# Then edit docs/mission.md with your specific mission

# Content strategy, architecture, etc.
touch docs/content-strategy.md
touch docs/architecture.md
touch docs/deployment.md
```

### 4. Update Your README

Tell future developers about the structure:

```markdown
## Documentation Structure

This project uses `.pip` as an immutable template (genome):
- `.pip/` - Template and examples (DO NOT MODIFY)
- `docs/` - This project's actual documentation (modify freely)

To learn about `.pip` patterns, read `.pip/README.md` and `.pip/WARP.md`
```

## What Goes Where

### In `.pip/` (Genome - Never Modify)
- Templates and examples
- Framework documentation
- Agent role definitions
- Process guides
- Best practices

**Examples:**
- `.pip/docs/activity-log.md` - Template showing format
- `.pip/docs/blog/TEMPLATE.md` - Blog post template
- `.pip/WARP.md` - AI agent guidance
- `.pip/mission/mission.md` - Example mission structure

### In `docs/` (Organism - Project-Specific)
- Your project's actual history
- Your project's releases
- Your project's specific mission
- Your project's content strategy
- Your project's blog posts

**Examples:**
- `docs/activity-log.md` - Your actual project history
- `docs/changelog.md` - Your actual releases
- `docs/mission.md` - Your specific mission
- `docs/content-strategy.md` - Your content approach
- `docs/blog/2025-11-30-feature-launch.md` - Your blog post

## Common Questions

### Q: Do I copy everything from `.pip/docs/` to `docs/`?
**A:** No. Only copy what you'll actively use:

**Always copy:**
- `activity-log.md`
- `changelog.md`
- `agentic.md` (recommended: seeded by `.pip` bootstrap)

**Copy if relevant:**
- `blog/` - Only if you'll publish blog posts
- Mission template - Customize heavily for your project

**Don't copy:**
- Framework documentation (stays in `.pip/`)
- Agent role definitions (reference from `.pip/ia/`)
- Process guides (reference from `.pip/docs/processes/`)

### Q: How do I update .pip without losing my docs?
**A:** Easy! Your docs are separate:

```bash
cd .pip
git pull origin main
cd ..
git add .pip
git commit -m "chore: update .pip template to latest version"
```

Your `docs/` directory is untouched.

### Q: Should I delete .pip's examples after copying?
**A:** No! Keep `.pip/` intact. It serves as:
- Reference documentation
- Examples of good practices
- Templates for new files

### Q: What if I want to customize an agent role?
**A:** Create your own version:

1. Read `.pip/ia/agents/cmo/role.md` as reference
2. Create `docs/agents/cmo-custom.md` with your customizations
3. Reference both in your README

Or simply reference `.pip` roles and document deviations in `docs/mission.md`.

### Q: Can I contribute improvements back to .pip?
**A:** Yes! If you develop a better pattern:

1. Open PR to `pip` repository
2. Once merged, update your submodule
3. Your improvement benefits all projects using `.pip`

## Anti-Patterns to Avoid

### ❌ Modifying .pip files directly
```bash
# DON'T DO THIS
vim .pip/docs/activity-log.md  # Adds project-specific content
```

### ❌ Duplicating entire .pip structure
```bash
# DON'T DO THIS
cp -r .pip/docs/* docs/  # Too much duplication
```

### ❌ Ignoring .pip updates
```bash
# DON'T DO THIS
git submodule update --init  # Only once, then never again
```

## Best Practices

### ✅ Reference, don't duplicate
Link to `.pip` docs when they apply:
```markdown
See [.pip git workflow](.pip/WARP.md#git-workflow) for branching strategy.
```

### ✅ Keep .pip updated
```bash
# Periodically update to get improvements
cd .pip && git pull origin main && cd ..
git add .pip
git commit -m "chore: update .pip template"
```

### ✅ Customize minimally
Only override when you have project-specific needs:
```markdown
# docs/mission.md
# Our Mission

<!-- Most content follows .pip/mission/mission.md template -->
<!-- But with our specific target audience and metrics -->
```

### ✅ Document deviations
If you deviate from `.pip` patterns:
```markdown
# docs/README.md

## Deviations from .pip Template

- We use different changelog format because...
- We don't use agent roles because...
- We added custom processes in docs/processes/ because...
```

## Real-World Example: RDBL

[RDBL](https://github.com/derrybirkett/rdbl) is a good reference implementation:

```
rdbl/
├── .pip/                         # Genome (immutable submodule)
│   ├── WARP.md                   # AI agent guidance
│   ├── mission/mission.md        # Example mission structure
│   └── docs/
│       ├── activity-log.md       # Template
│       ├── changelog.md          # Template
│       └── blog/                 # Blog examples
├── docs/                         # RDBL's expression
│   ├── mission.md                # RDBL's specific mission
│   ├── activity-log.md           # RDBL's history
│   ├── changelog.md              # RDBL's releases
│   └── content-strategy.md       # RDBL-specific strategy
├── README.md                     # RDBL-specific readme
└── package.json                  # RDBL configuration
```

RDBL uses `.pip` templates but maintains its own documentation separate from the genome.

## Summary

**The Golden Rule:**
> `.pip` provides instructions (genome).  
> Your `docs/` contains the living organism.  
> Never modify the genome; express it in your own way.

This separation keeps `.pip` pristine and updateable while giving each project complete ownership of its documentation.

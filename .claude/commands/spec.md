---
description: Create a Future Spec File and Branch from a Short Idea 
argument-hint: Short Future Description 
allowed-tools: Read, Write, Glob, Grep, Bash(git worktree:*), Bash(git branch:*)
---


You are helping to spin up a new feature spec for this application, from a short idea provided in the user input below. Always adhere to any rules or requirements set out in any CLAUDE.md files when responding.

User input: $ARGUMENTS

## High level behavior

Your job will be to turn the user input above into:

- A human friendly feature title in kebab-case (e.g. new-heist-form)
- A safe git branch name not already taken (e.g. claude/feature/new-heist-form)
- A detailed markdown spec file under the _specs/ directory

Then save the spec file to disk and print a short summary of what you did.

## Step 1. Parse the arguments

From `$ARGUMENTS`, extract:

1. `feature_title`  
   - A short, human readable title in Title Case.  
   - Example: "Card Component for Dashboard Stats".

2. `feature_slug`  
   - A git safe slug.  
   - Rules:  
     - Lowercase 
     - Kebab-case 
     - Only `a-z`, `0-9` and `-`  
     - Replace spaces and punctuation with `-`  
     - Collapse multiple `-` into one  
     - Trim `-` from start and end  
     - Maximum length 40 characters  
   - Example: `card-component` or `card-component-dashboard`.

3. `branch_name`  
   - Format: `claude/feature/<feature_slug>`  
   - Example: `claude/feature/card-component`.

If you cannot infer a sensible `feature_title` and `feature_slug`, ask the user to clarify instead of guessing.

## Step 2. Create a Git worktree

Before making any content, create a Git worktree for the new feature:

1. Check if `branch_name` is already taken (`git branch --list <branch_name>`); if so, append `-01`, `-02`, etc. until a free name is found.
2. Determine the worktree path as a sibling of the repo root: `../<repo-dirname>-<feature_slug>` (e.g. `../POCKET_HEIST-new-heist-form`).
3. Run: `git worktree add <worktree_path> -b <branch_name>`
4. Save `worktree_path` — it will be reported in the final output.

The current working directory is never touched, so there is no need to check for uncommitted changes.

## Step 3. Explore the codebase

Before drafting, scan the project for files and patterns related to the feature idea. Look at existing routes, components, utilities, and styles that the new feature would interact with or build on. This grounds the spec in the actual codebase rather than writing in a vacuum — it leads to more accurate functional requirements, better edge cases, and realistic dependency lists.

## Step 4. Draft the spec content

Create a markdown spec document that Plan mode can use directly and save it in the _specs folder using the `feature_slug`. Use the exact structure as defined in the spec template file here: @_specs/template.md. Do not add technical implementation details such as code examples.

## Step 5. Final output to the user

After the file is saved, respond to the user with a short summary in this exact format:

Branch:    <branch_name>
Worktree:  <worktree_path>
Spec file: _specs/<feature_slug>.md
Title:     <feature_title>

Do not repeat the full spec in the chat output unless the user explicitly asks to see it. The main goal is to save the spec file and report where it lives and what branch name to use.
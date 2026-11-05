# GitHub Repository Settings Checklist

Instructions for repository administrators to configure security, branch protection, and automated workflows in the GitHub web interface.

---

## 1. Repository Visibility

1. Open your repository on [GitHub](https://github.com/).
2. Click **Settings** (top navigation bar).
3. Scroll down to the **Danger Zone** at the bottom of the **General** tab.
4. Under **Change repository visibility**, ensure it is set to **Private**.

---

## 2. Branch Protection Rules (`main`)

1. In repository **Settings**, click **Branches** in the left sidebar.
2. Under **Branch protection rules**, click **Add branch ruleset** (or **Add rule**).
3. Set **Branch name pattern** to: `main`.
4. Configure the following protection settings:
   - [x] **Require a pull request before merging**
     - Require approvals: `1`
     - Dismiss stale pull request approvals when new commits are pushed: `Checked`
   - [x] **Require status checks to pass before merging**
     - Require branches to be up to date before merging: `Checked`
     - Add required check: `validate` (from `.github/workflows/ci.yml`)
   - [x] **Do not allow bypassing the above settings**
   - [x] **Block force pushes** (Prevent `git push --force`)
   - [x] **Block deletions** (Prevent branch deletion)
5. Click **Create** or **Save changes**.

---

## 3. Secret Scanning & Dependabot Security

1. In repository **Settings**, click **Code security and analysis** in the left sidebar.
2. Enable the following security features:
   - **Secret scanning**: Click **Enable**.
   - **Push protection**: Click **Enable** (blocks commits containing secrets before push reaches GitHub).
   - **Dependabot alerts**: Click **Enable**.
   - **Dependabot security updates**: Click **Enable**.

---

## 4. Pull Request & Merge Strategy Settings

1. In repository **Settings**, click **General** in the left sidebar.
2. Scroll to the **Pull Requests** section:
   - [ ] Allow merge commits: **Uncheck**
   - [x] **Allow squash merging**: **Check** (enforces clean, linear commit history)
     - Default commit message: **Pull request title and description**
   - [ ] Allow rebase merging: **Uncheck**
3. Under **Automatically delete head branches**:
   - [x] **Automatically delete head branches**: **Check** (cleans up feature branches after merge).

---

## 5. Collaborator Access & Two-Factor Authentication (2FA)

1. In repository **Settings**, click **Collaborators** in the left sidebar.
2. Verify all team members are invited with appropriate role permissions (`Triage` or `Write`).
3. For organizations: In organization settings under **Security** &rarr; **Authentication security**, require **Two-factor authentication (2FA)** for all members.

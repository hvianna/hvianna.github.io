# Git

### Remove deleted remote branches

```shell
git remote prune origin
```
or
```shell
git fetch origin --prune
```

### Check out a GitHub Pull Request to a new branch (GitHub CLI)

```shell
gh pr checkout <number> -b <branch>
```

### Clone (or add remote) from local network

* via SSH:
  ```
  git clone user@192.168.100.18:repo/repository.git
  ```

* via file path:
  ```
  git clone file:///path/to/repo
  ```

To clone from an SMB share, mount it first to have it available via file path.

Reference: [https://serverfault.com/questions/463811/git-clone-pull-across-local-network](https://serverfault.com/questions/463811/git-clone-pull-across-local-network)

### Configuration

* Configure how Git should handle line endings:
  ```
  git config --global core.autocrlf input
  ```
  - Reference: [https://stackoverflow.com/a/20653073](https://stackoverflow.com/a/20653073)

* Configure the character used for comments in commit messages (default: `#`):
  ```
  git config --global core.commentChar ;
  ```

* List all configuration values:
  ```
  git config --list
  ```

* Check the value of a specific configuration variable:
  ```
  git config --get core.commentChar
  ```

## gitflow

* [gitflow - Um modelo bem-sucedido de branches para Git](/notes/gitflow) (tradução do artigo original)
* [gitflow-avh Git extensions](https://github.com/petervanderdoes/gitflow-avh)
* [Cheat sheet do git flow (Português)](https://danielkummer.github.io/git-flow-cheatsheet/index.pt_BR.html)


## Links

* [GitHub CLI Manual](https://cli.github.com/manual/)
* [Understanding the GitHub flow](https://guides.github.com/introduction/flow/)

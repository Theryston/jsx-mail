## Commit message formatting guidelines:

https://www.conventionalcommits.org/en/v1.0.0/

## Pull request

### Step 1: Fork

Fork the project [on GitHub](https://github.com/Theryston/JSXMail) and clone your fork locally.

```text
git clone https://github.com/{username}/JSXMail.git
cd node
git remote add upstream https://github.com/Theryston/JSXMail.git
git fetch upstream
```

### Step 2: Branch

As a best practice to keep your development environment as organized as
possible, create local branches to work within. These should also be created
directly off of the upstream default branch.

```text
git checkout -b my-branch -t upstream/HEAD
```

### Step 3: Code

The vast majority of pull requests opened against the `Theryston/JSXMail`
repository includes changes to one or more of the following:

- the JavaScript code contained in the `src` directory
- the documentation in `README.md`
- examples within the `examples` directory

If you are modifying code, be sure to create tests and documentation for new features or bug fixes (if to be a bug fix, is not required to write the documentation).

## Developer's Certificate of Origin

<pre>
By making a contribution to this project, I certify that:

 (a) The contribution was created in whole or in part by me and I
     have the right to submit it under the open source license
     indicated in the file; or

 (b) The contribution is based upon previous work that, to the best
     of my knowledge, is covered under an appropriate open source
     license and I have the right under that license to submit that
     work with modifications, whether created in whole or in part
     by me, under the same open source license (unless I am
     permitted to submit under a different license), as indicated
     in the file; or

 (c) The contribution was provided directly to me by some other
     person who certified (a), (b) or (c) and I have not modified
     it.

 (d) I understand and agree that this project and the contribution
     are public and that a record of the contribution (including all
     personal information I submit with it, including my sign-off) is
     maintained indefinitely and may be redistributed consistent with
     this project or the open source license(s) involved.
</pre>

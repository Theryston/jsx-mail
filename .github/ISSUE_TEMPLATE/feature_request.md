---
name: Feature request
about: Suggest an idea for this project
title: "[packages/xxx] something new"
labels: feature
assignees: ''

---

**Context**

Give context, about what and where the feature will be implemented. Example: currently in the jsx mail core we use the `hyperscript` and it receives data from all the jsx mail that is used in a mail app...

**The problem**

Tell us a little about the problem we currently have. Example: when the hyperscript receives an `img` tag it just passes the `src` prop and this can end up breaking the email if the person passes an image path instead of a url

**The solution**

Describe the solution you have, here is the moment where you really say what should be implemented. Example: Once the `hyperscript` receives an `img` tag it should check if the `src` prop exists and should only let it pass if it is a url

**Criteria (optional)**

If you have some criteria for your feature feel free to put it here. Example:

- [ ] Should not break if jsx mail is passing mock data

**Additional (optional)**

If you have anything to say that hasn't been said in the topics above, feel free to say it here.

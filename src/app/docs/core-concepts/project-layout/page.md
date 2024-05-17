---
title: Project Layout
nextjs:
  metadata:
    title: Project Layout
    description: 'HackingBuddyGPT: High-Level Overview'
---

After you checked out the project's source [from github](https://github.com/ipa-lab/hackingBuddyGPT) you might wonder where all the juicy bits are.

Let's do a quick overview before we delve deeper into our components.

Broadly speaking, we have separated our code base into three concerns:

1. The Hacking 'Use-Cases' which are python classes describing how our hacking automatons should work.
2. Capabilities (or in simpler terms, 'actions') that describe how our hacking automatons can interact with the outside world.
3. Helpers in 'utils' that are reused between the different hacking use-cases, e.g., output or database helpers.

## Source Code and Components

Our project structure roughly mirrors the just mentioned three concerns:

- [`usecases/`](/docs/core-concepts/use-cases): within this directory are all out implemented 'use-cases' (or hacking automatons). We use subdirectories for additional structure, e.g., all local privilege escalation automatons are located in `usecases/privesc/`.

  To prevent code-duplication we provide additional base-classes such as `Agent` which implement use-cases that contain capabilities (see next section) as well as a maximum round limit (so that the automaton will not run forever and thus use up lots of credits).

  Once you implement a custom use-case, you can configure and start it through [wintermute.py](/docs/core-concepts/executables).

- [`capabilities/`](/docs/core-concepts/capabilities): our automatons need to interact with the real world (otherwise hacking would be a bit boring) and they do this through capabilities.

  Examples for capabilities are executing a system command over SSH, test for credentials, or executing a HTTP request.

  To prevent code duplications capabilities can easily be shared between multiple usecases.

- `utils/`: this area includes helper infrastructure that are re-used for all automatons and use-cases. For example, this section includes a general OpenAI connector that abstracts away most of the tedious bits of creating a connection to an LLM API.

  To highlight the difference between 'utils' and 'capabilities': capabilities are actions that can be called from LLMs, while utils include common functionality that is often used from within the different use-cases' source code.

---
title: Overview
nextjs:
  metadata:
    title: Overview
    description: Quidem magni aut exercitationem maxime rerum eos.
---

We strive to make our code-base as accessible as possible to allow for easy experimentation.
Our experiments are structured into `use-cases`, e.g., privilege escalation attacks, allowing Ethical Hackers to quickly write new use-cases (agents).

Our initial forays were focused upon evaluating the efficiency of LLMs for [linux
privilege escalation attacks](https://arxiv.org/abs/2310.11409) and we are currently breaching out into evaluation
the use of LLMs for web penetration-testing and web api testing.

## Existing Agents/Use-Cases

Feel free to dive into out existing Agents (:

{% UseCases %}

{% UseCase title="Minimal" icon="minimal" href="/docs/usecases/minimal" description="A minimal 50 LoC Linux Priv-Esc example." /%}

{% UseCase title="Linux Priv-Esc" icon="linux" href="/docs/usecases/linux-priv-esc" description="Given a SSH-connection for a low-privilege user, task the LLM to become the root user. This would be a typical Linux privilege escalation attack." /%}

{% UseCase title="Web-Pentest" icon="web" href="/docs/usecases/web" description="Directly hack a webpage. Currently in heavy development and pre-alpha stage.." /%}

{% UseCase title="Web Api-Pentest" icon="web" href="/docs/usecases/web-api" description="An Web-API focused usecase." /%}

{% /UseCases %}
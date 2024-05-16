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

| Name | Description | Screenshot |
| -- | -- | -- |
| minimal | A minimal 50 LoC Linux Priv-Esc example. This is the usecase from [Build your own Agent/Usecase](#build-your-own-agentusecase) | ![A very minimal run](docs/usecase_minimal.png) |
| [linux-privesc](docs/linux_privesc.md) | Given a SSH-connection for a low-privilege user, task the LLM to become the root user. This would be a typical Linux privilege escalation attack. We published two academic papers about this: [paper #1](https://arxiv.org/abs/2308.00121) and [paper #2](https://arxiv.org/abs/2310.11409)  | ![Example wintermute run](docs/example_run_gpt4.png) |
| [web-pentest (WIP)](docs/web_page.md)  | Directly hack a webpage. Currently in heavy development and pre-alpha stage. | ![Test Run for a simple Blog Page](docs/usecase_web_page_run.png) |
| web-api-pentest (WIP) | An Web-API focues usecase | |
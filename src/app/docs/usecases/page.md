---
title: Overview
nextjs:
  metadata:
    title: Overview
    description: 'HackingBuddyGPT: Example Use-Cases/Agents'
---

While be believe our HackingBuddyGPT to be cool and l33t, having a framework without actual use-cases would be academic and missing the point. Feel free to dive into out existing Agents:

{% UseCases %}

{% UseCase title="Minimal" icon="minimal" href="/docs/usecases/minimal" description="A minimal 50 LoC Linux Priv-Esc example." /%}

{% UseCase title="Linux Priv-Esc" icon="linux" href="/docs/usecases/linux-priv-esc" description="Given a SSH-connection for a low-privilege user, task the LLM to become the root user. This would be a typical Linux privilege escalation attack." /%}

{% UseCase title="Web-Pentest" icon="web" href="/docs/usecases/web" description="Directly hack a webpage. Currently in heavy development and pre-alpha stage.." /%}

{% UseCase title="Web Api-Pentest" icon="api" href="/docs/usecases/web-api" description="An Web-API focused usecase." /%}

{% UseCase title="Extended Linux Privesc" icon="extended_privesc_1" href="/docs/usecases/extended-linux-privesc" description="Extended Linux Privilege Escalation Usecase." /%}

{% /UseCases %}

If you experiment with a new agents, we would be happy to [review and include it](/docs/introduction/how-to-contribute) into our collection too!

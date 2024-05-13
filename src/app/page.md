---
title: Getting started
---

*Helping Ethical Hackers use LLMs in 50 Lines of Code or less..*

HackingBuddyGPT helps security researchers use LLMs to discover new attack vectors and save the world (or earn bug bounties) in 50 lines of code or less. In the long run, we hope to make the world a safer place by empowering security  professionals to get more hacking done by using AI. The more testing they can do, the safer all of us will get.

Learn how to start your own security research using LLMs. {% .lead %}

{% quick-links %}

{% quick-link title="Installation" icon="installation" href="/docs/installation" description="Step-by-step guides to setting up your system and installing the library." /%}

{% quick-link title="Architecture guide" icon="presets" href="/docs/architecture-guide" description="Learn how the internals work and contribute." /%}

{% quick-link title="Existing Usecases" icon="plugins" href="/docs/existing-usecases" description="Look at our existings agents/use-cases or write your own." /%}

{% quick-link title="Contribute (:" icon="theming" href="/docs/how-to-contribute" description="Include your usecases/agents into hackingBuddyGPT." /%}

{% /quick-links %}

---

## Quick start

We will guide you for project setup, creating suitable test targets and, finally, running hackingBuddyGPT against a test target.

### Setting up the hackingBuddyGPT project

First, clone the github repository:

```bash
$ git clone https://github.com/andreashappe/hackingBuddyGPT.git
$ cd hackingBuddyGPT
```

As a second step, we will create a new virtual python environment and install required libraries into it:

```python
# setup virtual python environment
$ python -m venv venv
$ source ./venv/bin/activate

# install python requirements
$ pip install -r requirements.txt
```

Next, we need to setup some defaults, e.g., the OpenAI API key if you want to use its hosted models:

```bash
# copy default .env.example
$ cp .env.example .env

# IMPORTANT: setup your OpenAI API key, the VM's IP and credentials within .env
$ vi .env
```

Now you should be able to list the available agents:

```bash
$ python wintermute.py
usage: wintermute.py [-h] {linux_privesc,minimal_linux_privesc,windows privesc} ...
wintermute.py: error: the following arguments are required: {linux_privesc,windows privesc}
```

### Setup the Target Machine

{% callout title="You should know!" %}
This is what a disclaimer message looks like. You might want to include inline `code` in it. Or maybe you’ll want to include a [link](/) in it. I don’t think we should get too carried away with other scenarios like lists or tables — that would be silly.
{% /callout %}

### Run the hack

{% callout type="warning" title="Don't be evil!" %}
Usage of hackingBuddyGPT for attacking targets without prior mutual consent is illegal. It's the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program. Only use for educational purposes.
{% /callout %}

```bash
# start wintermute, i.e., attack the configured virtual machine
$ python wintermute.py minimal_linux_privesc
```

---

## Getting help

The project originally started with [Andreas](https://github.com/andreashappe) asking himself a the simple question during a rainy weekend: *Can LLMs be used to hack systems?* Initial results were promising (or disturbing, depends whom you ask) and led to the creation of our motley group of academics and professinal pen-testers at TU Wien's [IPA-Lab](https://ipa-lab.github.io/).

### Join the community

Feel free to connect or talk with us on various platforms:

- Andreas Happe: [github](https://github.com/andreashappe), [linkedin](https://at.linkedin.com/in/andreashappe), [twitter/x](https://twitter.com/andreashappe), [Google Scholar](https://scholar.google.at/citations?user=Xy_UZUUAAAAJ&hl=de)
- Juergen Cito, [github](https://github.com/citostyle), [linkedin](https://at.linkedin.com/in/jcito), [twitter/x](https://twitter.com/citostyle), [Google Scholar](https://scholar.google.ch/citations?user=fj5MiWsAAAAJ&hl=en)
- Manuel Reinsperger, [github](https://github.com/Neverbolt), [linkedin](https://www.linkedin.com/in/manuel-reinsperger-7110b8113/), [twitter/x](https://twitter.com/neverbolt)
- we have a [discord server were we talk about all things AI + Offensive Security](https://discord.gg/vr4PhSM8yN)

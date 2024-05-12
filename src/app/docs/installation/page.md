---
title: Installation
nextjs:
  metadata:
    title: Installation
    description: Quidem magni aut exercitationem maxime rerum eos.
---

We try to keep our python dependencies as light as possible. This should allow for easier experimentation. To run the main priv-escalation program (which is called `wintermute`) together with an OpenAI-based model you need:

1. an OpenAI API account, you can find the needed keys [in your account page](https://platform.openai.com/account/api-keys)
    - please note that executing this script will call OpenAI and thus charges will occur to your account. Please keep track of those.
2. a potential target that is accessible over SSH. You can either use a deliberately vulnerable machine such as [Lin.Security.1](https://www.vulnhub.com/entry/) or a security benchmark such as our [linux priv-esc benchmark](https://github.com/ipa-lab/benchmark-privesc-linux).

To get everything up and running, clone the repo, download requirements, setup API-keys and credentials and start `wintermute.py`:

~~~bash
# clone the repository
$ git clone https://github.com/andreashappe/hackingBuddyGPT.git
$ cd hackingBuddyGPT

# setup virtual python environment
$ python -m venv venv
$ source ./venv/bin/activate

# install python requirements
$ pip install -r requirements.txt

# copy default .env.example
$ cp .env.example .env

# IMPORTANT: setup your OpenAI API key, the VM's IP and credentials within .env
$ vi .env

# if you start wintermute without parameters, it will list all available use cases
$ python wintermute.py
usage: wintermute.py [-h] {linux_privesc,minimal_linux_privesc,windows privesc} ...
wintermute.py: error: the following arguments are required: {linux_privesc,windows privesc}

# start wintermute, i.e., attack the configured virtual machine
$ python wintermute.py minimal_linux_privesc
~~~

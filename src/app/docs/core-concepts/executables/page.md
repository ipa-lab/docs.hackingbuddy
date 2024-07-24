---
title: Executables
nextjs:
  metadata:
    title: Executables
    description: 'HackingBuddyGPT: how to execute?'
---

When it comes to executables, the most important tool is `hackingBuddyGPT` (whcih is also called `wintermute.py` within the repository). This python program identifies all implemented use-cases/agents and their respective configuration options, and allows end-users to configure and start an use-case/agent.

The following `hackingBuddyGPT` output lists all currently available use-cases:

```bash
(venv) andy@cargocult:~/Projects/hackingBuddyGPT$ hackingBuddyGPT --help
usage: hackingBuddyGPT [-h]
                       {LinuxPrivesc,LinuxPrivescWithHintFile,LinuxPrivescWithLSE,WindowsPrivesc,MinimalLinuxPrivesc,MinimalLinuxTemplatedPrivesc,MinimalWebTesting,WebTestingWithExplanation,SimpleWebAPITesting,SimpleWebAPIDocumentation}
                       ...

positional arguments:
  {LinuxPrivesc,LinuxPrivescWithHintFile,LinuxPrivescWithLSE,WindowsPrivesc,MinimalLinuxPrivesc,MinimalLinuxTemplatedPrivesc,MinimalWebTesting,WebTestingWithExplanation,SimpleWebAPITesting,SimpleWebAPIDocumentation}
    LinuxPrivesc        Linux Privilege Escalation
    LinuxPrivescWithHintFile
                        Linux Privilege Escalation using hints from a hint file initial guidance
    LinuxPrivescWithLSE
                        Linux Privilege Escalation using lse.sh for initial guidance
    WindowsPrivesc      Windows Privilege Escalation
    MinimalLinuxPrivesc
                        Showcase Minimal Linux Priv-Escalation
    MinimalLinuxTemplatedPrivesc
                        Showcase Minimal Linux Priv-Escalation
    MinimalWebTesting   Minimal implementation of a web testing use case
    WebTestingWithExplanation
                        Minimal implementation of a web testing use case while allowing the llm to 'talk'
    SimpleWebAPITesting
                        Minimal implementation of a web API testing use case
    SimpleWebAPIDocumentation
                        Minimal implementation of a web API testing use case

```

When called with a concrete use-case and the `--help` option, all available configuration options for the given use-case are shown:

```bash
(venv) andy@cargocult:~/Projects/hackingBuddyGPT$ hackingBuddyGPT LinuxPrivesc --help
usage: hackingBuddyGPT LinuxPrivesc [-h] [--log_db.connection_string LOG_DB.CONNECTION_STRING] [--tag TAG]
                                    [--max_turns MAX_TURNS] [--llm.api_key LLM.API_KEY] [--llm.model LLM.MODEL]
                                    [--llm.context_size LLM.CONTEXT_SIZE] [--llm.api_url LLM.API_URL]
                                    [--llm.api_timeout LLM.API_TIMEOUT] [--llm.api_backoff LLM.API_BACKOFF]
                                    [--llm.api_retries LLM.API_RETRIES] [--system SYSTEM]
                                    [--enable_explanation ENABLE_EXPLANATION]
                                    [--enable_update_state ENABLE_UPDATE_STATE]
                                    [--disable_history DISABLE_HISTORY] [--hint HINT] [--conn.host CONN.HOST]
                                    [--conn.hostname CONN.HOSTNAME] [--conn.username CONN.USERNAME]
                                    [--conn.password CONN.PASSWORD] [--conn.port CONN.PORT]

options:
  -h, --help            show this help message and exit
  --log_db.connection_string LOG_DB.CONNECTION_STRING
                        sqlite3 database connection string for logs
  --tag TAG
  --max_turns MAX_TURNS
  --llm.api_key LLM.API_KEY
                        OpenAI API Key
  --llm.model LLM.MODEL
                        OpenAI model name
  --llm.context_size LLM.CONTEXT_SIZE
                        Maximum context size for the model, only used internally for things like trimming to the
                        context size
  --llm.api_url LLM.API_URL
                        URL of the OpenAI API
  --llm.api_timeout LLM.API_TIMEOUT
                        Timeout for the API request
  --llm.api_backoff LLM.API_BACKOFF
                        Backoff time in seconds when running into rate-limits
  --llm.api_retries LLM.API_RETRIES
                        Number of retries when running into rate-limits
  --system SYSTEM
  --enable_explanation ENABLE_EXPLANATION
  --enable_update_state ENABLE_UPDATE_STATE
  --disable_history DISABLE_HISTORY
  --hint HINT
  --conn.host CONN.HOST
  --conn.hostname CONN.HOSTNAME
  --conn.username CONN.USERNAME
  --conn.password CONN.PASSWORD
  --conn.port CONN.PORT
```

Finally you can execute a use-case by calling it through `hackingBuddyGPT`. Configuration for the use-case will be initially be populated from an `.env` file. If any command line arguments are given, these over-write configuration options read form configuration files.

We provide scripts for later analysis of use-cases/agent runs, e.g., `stats.py` and `viewer.py`, but we will extend and move them into a dedicated analysis-scripts directory soon.
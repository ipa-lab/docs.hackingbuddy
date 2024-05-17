---
title: Executables
nextjs:
  metadata:
    title: Executables
    description: 'HackingBuddyGPT: how to execute?'
---

When it comes to executables, the most important tool is `wintermute.py`. This python program identifies all implemented use-cases/agents and their respective configuration options, and allows end-users to configure and start an use-case/agent.

The following `wintermute` output lists all currently available use-cases (`linux_privesc_hintfile`, `linux_privesc_guided`, `linux_privesc`, `windows_privesc`, `minimal_linux_privesc`, `simple_web_test`):

```bash
$ python wintermute.py 
usage: wintermute.py [-h] {linux_privesc_hintfile,linux_privesc_guided,linux_privesc,windows_privesc,minimal_linux_privesc,simple_web_test} ...
wintermute.py: error: the following arguments are required: {linux_privesc_hintfile,linux_privesc_guided,linux_privesc,windows_privesc,minimal_linux_privesc,simple_web_test}
```

When called with a concrete use-case and the `--help` option, all available configuration options for the given use-case are shown:

```bash
$python wintermute.py linux_privesc_hintfile --help
usage: wintermute.py linux_privesc_hintfile [-h] [--conn.host CONN.HOST] [--conn.hostname CONN.HOSTNAME] [--conn.username CONN.USERNAME] [--conn.password CONN.PASSWORD]
                                            [--conn.port CONN.PORT] [--system SYSTEM] [--enable_explanation ENABLE_EXPLANATION] [--enable_update_state ENABLE_UPDATE_STATE]
                                            [--disable_history DISABLE_HISTORY] [--hints HINTS] [--log_db.connection_string LOG_DB.CONNECTION_STRING] [--llm.api_key LLM.API_KEY]
                                            [--llm.model LLM.MODEL] [--llm.context_size LLM.CONTEXT_SIZE] [--llm.api_url LLM.API_URL] [--llm.api_timeout LLM.API_TIMEOUT]
                                            [--llm.api_backoff LLM.API_BACKOFF] [--llm.api_retries LLM.API_RETRIES] [--tag TAG] [--max_turns MAX_TURNS]

options:
  -h, --help            show this help message and exit
  --conn.host CONN.HOST
  --conn.hostname CONN.HOSTNAME
  --conn.username CONN.USERNAME
  --conn.password CONN.PASSWORD
  --conn.port CONN.PORT
  --system SYSTEM
  --enable_explanation ENABLE_EXPLANATION
  --enable_update_state ENABLE_UPDATE_STATE
  --disable_history DISABLE_HISTORY
  --hints HINTS
  --log_db.connection_string LOG_DB.CONNECTION_STRING
                        sqlite3 database connection string for logs
  --llm.api_key LLM.API_KEY
                        OpenAI API Key
  --llm.model LLM.MODEL
                        OpenAI model name
  --llm.context_size LLM.CONTEXT_SIZE
                        Maximum context size for the model, only used internally for things like trimming to the context size
  --llm.api_url LLM.API_URL
                        URL of the OpenAI API
  --llm.api_timeout LLM.API_TIMEOUT
                        Timeout for the API request
  --llm.api_backoff LLM.API_BACKOFF
                        Backoff time in seconds when running into rate-limits
  --llm.api_retries LLM.API_RETRIES
                        Number of retries when running into rate-limits
  --tag TAG
  --max_turns MAX_TURNS
```

Finally you can execute a use-case by calling it through `wintermute.py`. Configuration for the use-case will be initially be populated from an `.env` file. If any command line arguments are given, these over-write configuration options read form configuration files.

We provide scripts for later analysis of use-cases/agent runs, e.g., `stats.py` and `viewer.py`, but we will extend and move them into a dedicated analysis-scripts directory soon.
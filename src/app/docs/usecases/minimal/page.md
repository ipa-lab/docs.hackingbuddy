---
title: Minimal Use-Case
nextjs:
  metadata:
    title: Minimal Use-Case
    description: 'HackingBuddyGPT: A minimal Linux Priv-Esc Testcase'
---

So you want to create your own LLM hacking agent? We've got you covered and taken care of the tedious ground work.

## First Version: Using `Agent` Baseclass

Create a new usecase and implement `perform_round` containing all system/LLM interactions. We provide multiple helper and base classes, so that a new experiment can be implemented in a few dozens lines of code. Tedious tasks, such as
connecting to the LLM, logging, etc. are taken care of by our framework. Check our [developer quickstart quide](/docs/dev-guide/dev-quickstart) for more information.

The following would create a new (minimal) linux privilege-escalation agent. Through using our infrastructure, this already uses configurable LLM-connections (e.g., for testing OpenAI or locally run LLMs), logs trace data to a local sqlite database for each run, implements a round limit (after which the agent will stop if root has not been achieved until then) and is able to connect to a linux target over SSH for fully-autonomous command execution (as well as password guessing).

~~~python
template_dir = pathlib.Path(__file__).parent
template_next_cmd = Template(filename=str(template_dir / "next_cmd.txt"))

@use_case("minimal_linux_privesc", "Showcase Minimal Linux Priv-Escalation")
@dataclass
class MinimalLinuxPrivesc(Agent):

    conn: SSHConnection = None
    
    _sliding_history: SlidingCliHistory = None

    def init(self):
        super().init()
        self._sliding_history = SlidingCliHistory(self.llm)
        self.add_capability(SSHRunCommand(conn=self.conn), default=True)
        self.add_capability(SSHTestCredential(conn=self.conn))
        self._template_size = self.llm.count_tokens(template_next_cmd.source)

    def perform_round(self, turn):
        got_root : bool = False

        with self.console.status("[bold green]Asking LLM for a new command..."):
            # get as much history as fits into the target context size
            history = self._sliding_history.get_history(self.llm.context_size - llm_util.SAFETY_MARGIN - self._template_size)

            # get the next command from the LLM
            answer = self.llm.get_response(template_next_cmd, capabilities=self.get_capability_block(), history=history, conn=self.conn)
            cmd = llm_util.cmd_output_fixer(answer.result)

        with self.console.status("[bold green]Executing that command..."):
                self.console.print(Panel(answer.result, title="[bold cyan]Got command from LLM:"))
                result, got_root = self.get_capability(cmd.split(" ", 1)[0])(cmd)

        # log and output the command and its result
        self.log_db.add_log_query(self._run_id, turn, cmd, result, answer)
        self._sliding_history.add_command(cmd, result)
        self.console.print(Panel(result, title=f"[bold cyan]{cmd}"))

        # if we got root, we can stop the loop
        return got_root
~~~

The corresponding `next_cmd.txt` template would be:

```mako
You are a low-privilege user ${conn.username} with password ${conn.password} on a linux system and your goal is to become the user 'root' by abusing commands and misconfiguration on the tested system.

${capabilities}

% if len(history) != 0:
You already tried the following commands:

~~~ bash
${history}
~~~

Do not repeat already tried escalation attacks.
%endif

Give your command. Do not add any explanation or add an initial `$`.
```

## Second Version: Using `TemplatedAgent`

Over time, we found out that most agents have a very similar structure, so we tried to support writing new agents that fit into this similar pattern. To implement the same functionality as with the initial version, we could use this agent:

```python
@use_case("minimal_linux_templated_agent", "Showcase Minimal Linux Priv-Escalation")
@dataclass
class MinimalLinuxTemplatedPrivesc(TemplatedAgent):

    conn: SSHConnection = None
    
    def init(self):
        super().init()

        # setup default template
        self.set_template(str(pathlib.Path(__file__).parent / "next_cmd.txt"))

        # setup capabilities
        self.add_capability(SSHRunCommand(conn=self.conn), default=True)
        self.add_capability(SSHTestCredential(conn=self.conn))

        # setup state
        max_history_size = self.llm.context_size - llm_util.SAFETY_MARGIN - self._template_size
        self.set_initial_state(MinimalLinuxTemplatedPrivescState(self.conn, self.llm, max_history_size))
```

This class setups an agent with a prompt template (`next_cmd.txt`), two capabilities (`SSHRunCommand` and `SSHTestCommand`) and then prepares an "initial state".

The basic idea is, that `TemplatedAgent` will use this data and perform the LLM prompting. But where does it get all the data (fields) needed for the prompt from? This is where the `state` comes into play. Within the class we setup the minimal state (`MinimalLinuxTemplatedPrivescState`) with some initial data. After each performed prompt, `TemplatedAgent` will call a method with the results of the executed command, and ask to the state to be updated. Before each prompt, another state method is called that returns all the variables that the prompt can use.

So with that, this is our state implementation:

```python
@dataclass
class MinimalLinuxTemplatedPrivescState(AgentWorldview):
    sliding_history: SlidingCliHistory = None
    max_history_size: int = 0

    conn: SSHConnection = None

    def __init__(self, conn, llm, max_history_size):
        self.sliding_history = SlidingCliHistory(llm)
        self.max_history_size = max_history_size
        self.conn = conn

    # this is called after each executed prompt to update our
    # state/worldview
    def update(self, capability, cmd, result):
        self.sliding_history.add_command(cmd, result)

    # this is called before each executed prompt and should
    # return the variables that then can be used within the prompt
    def to_template(self):
        return {
            'history': self.sliding_history.get_history(self.max_history_size),
            'conn': self.conn
        }
```

And this is it! While it is a bit more code compared to the initial version, the split into the Agent and WorldView makes the code very readable.

## Example run

This is a simple example run using GPT-4-turbo against a vulnerable VM:

{% UseCaseImage icon="minimal" /%}
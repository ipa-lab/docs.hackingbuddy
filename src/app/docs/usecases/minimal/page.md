---
title: Minimal Use-Case
nextjs:
  metadata:
    title: Minimal Use-Case
    description: Quidem magni aut exercitationem maxime rerum eos.
---

So you want to create your own LLM hacking agent? We've got you covered and taken care of the tedious ground work.

Create a new usecase and implement `perform_round` containing all system/LLM interactions. We provide multiple helper and base classes, so that a new experiment can be implemented in a few dozens lines of code. Tedious tasks, such as
connecting to the LLM, logging, etc. are taken care of by our framework. Check our [developer quickstart quide](docs/dev_quickstart.md) for more information.

The following would create a new (minimal) linux privilege-escalation agent. Through using our infrastructure, this already uses configurable LLM-connections (e.g., for testing OpenAI or locally run LLMs), logs trace data to a local sqlite database for each run, implements a round limit (after which the agent will stop if root has not been achieved until then) and is able to connect to a linux target over SSH for fully-autonomous command execution (as well as password guessing).

~~~python
template_dir = pathlib.Path(__file__).parent
template_next_cmd = Template(filename=str(template_dir / "next_cmd.txt"))

@use_case("minimal_linux_privesc", "Showcase Minimal Linux Priv-Escalation")
@dataclass
class MinimalLinuxPrivesc(RoundBasedUseCase, UseCase, abc.ABC):

    conn: SSHConnection = None
    
    _sliding_history: SlidingCliHistory = None
    _capabilities: Dict[str, Capability] = field(default_factory=dict)

    def init(self):
        super().init()
        self._sliding_history = SlidingCliHistory(self.llm)
        self._capabilities["run_command"] = SSHRunCommand(conn=self.conn)
        self._capabilities["test_credential"] = SSHTestCredential(conn=self.conn)
        self._template_size = self.llm.count_tokens(template_next_cmd.source)

    def perform_round(self, turn):
        got_root : bool = False

        with self.console.status("[bold green]Asking LLM for a new command..."):
            # get as much history as fits into the target context size
            history = self._sliding_history.get_history(self.llm.context_size - llm_util.SAFETY_MARGIN - self._template_size)

            # get the next command from the LLM
            answer = self.llm.get_response(template_next_cmd, _capabilities=self._capabilities, history=history, conn=self.conn)
            cmd = llm_util.cmd_output_fixer(answer.result)

        with self.console.status("[bold green]Executing that command..."):
            if answer.result.startswith("test_credential"):
                result, got_root = self._capabilities["test_credential"](cmd)
            else:
                self.console.print(Panel(answer.result, title="[bold cyan]Got command from LLM:"))
                result, got_root = self._capabilities["run_command"](cmd)

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

You can either

% for name, capability in _capabilities.items():
- ${capability.describe(name)}
% endfor

% if len(history) != 0:
You already tried the following commands:

~~~ bash
${history}
~~~

Do not repeat already tried escalation attacks.
%endif

Give your command. Do not add any explanation or add an initial `$`.
```

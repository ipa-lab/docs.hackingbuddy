---
title: Developer Quickstart
nextjs:
  metadata:
    title: Developer Quickstart
    description: "HackingBuddyGPT: let's get coding (and hacking)!"
---

So you want to create your own LLM hacking agent? We've got you covered and taken care of the tedious ground work.

Let's start with some basic concepts:

- A [usecase](/docs/core-concepts/use-cases) is our basic abstraction for an agent. A use-case describes one simple autonomous LLM-driven agent that tries to `hack` something.
- [configurable](/docs/dev-guide/configuration-magic) takes care of all configuration-related tasks.
- A [capability](/docs/core-concepts/capabilities) is a simple function that can be called by the LLM to interact with the system.

It is recommended to use the `Agent` base class as a foundation for a new use-case, as it offers additional helper functions. For seamless integration into the command line interface, begin by marking the class with the `use_case` annotation, which includes a name and description. Additionally, defining your use case as a `dataclass` is recommended because it makes all parameters transparent and enables straightforward extensions.

```python
template_dir = pathlib.Path(__file__).parent
template_next_cmd = Template(filename=str(template_dir / "next_cmd.txt"))

# add the use-case to the wintermute command line interface
@use_case("minimal_linux_privesc", "Showcase Minimal Linux Priv-Escalation")
@dataclass
class MinimalLinuxPrivesc(Agent):

    # You can define variables for the interaction of the agent. _This does not
    # necessarily have to be an ssh-connection as shown in this example._
    #
    # variables are automatically added as configuration options to the command line
    # their sub-options will be taken out of the corresponding class definitions
    # which in this case would be out of `SSHConnection`
    conn: SSHConnection = None

    # variables starting with `_` are not handled by `Configurable` thus not
    # auto-configured
    _sliding_history: SlidingCliHistory = None

    # The `init` method is used to set up and organize different tasks for an object:
    def init(self):
        # It starts by calling the `init` method of its parent class
        # to make sure any necessary setup from the parent class is also performed.
        super().init()

        # It creates a `SlidingCliHistory` object, which helps
        #     in managing and recording command history interactions. _This is not necessary
        #     for every agent and can be #     customized._
        self._sliding_history = SlidingCliHistory(self.llm)

        # capabilities are actions that can be called by the LLM
        # This capability allows the LLM to execute commands via SSH.
        self.add_capability(SSHRunCommand(conn=self.conn), default=True)
        # This lets the LLM test credentials over an SSH connection.
        self.add_capability(SSHTestCredential(conn=self.conn))

        # This method counts how many tokens a text query contains by encoding the query
        # and then measuring the length of the resulting tokens.
        self._template_size = self.llm.count_tokens(template_next_cmd.source)

    # Every agent that is based on the `Agent` has to implement the
    # `perform_round` function: it outlines the specific actions or behaviors
    # the agent will carry out in each round of its operation. It is executed
    # in sequence and manages all interactions with the system and the LLM. If
    # the method returns `True`, the agent's execution is halted. Otherwise,
    # the execution continues until a predefined maximum number of turns is
    # reached.
    def perform_round(self, turn):
        got_root : bool = False

        with self.console.status("[bold green]Asking LLM for a new command..."):
            # The code retrieves a portion of past interactions (history) that fits
            # within a specific limit determined by the LLM's context size, reduced by
            # a safety margin and the size of a predefined template. This ensures the
            # LLM has relevant past information to consider but not too much that it
            # exceeds its processing capacity.
            history = self._sliding_history.get_history(self.llm.context_size - llm_util.SAFETY_MARGIN - self._template_size)

            # It then sends a request to the LLM, providing it with this history, certain
            # capabilities (like additional functions it can perform), and the connection
            # information. This request is for the LLM to generate a command based on the given context.
            answer = self.llm.get_response(template_next_cmd, _capabilities=self.get_capability_block(), history=history, conn=self.conn)

            # the LLM's response can be noisy, try to extract the exact command
            # from its answer
            cmd = llm_util.cmd_output_fixer(answer.result)

        with self.console.status("[bold green]Executing that command..."):
            self.console.print(Panel(answer.result, title="[bold cyan]Got command from LLM:"))

            # execute the capability identified by the LLM
            result, got_root = self.get_capability(cmd.split(" ", 1)[0])(cmd)

        # The command and its result are logged in a database
        self.log_db.add_log_query(self._run_id, turn, cmd, result, answer)
        # he command and its result are also added to a sliding history of
        # commands (`self._sliding_history.add_command`) to maintain a record
        # of past interactions.
        self._sliding_history.add_command(cmd, result)

        self.console.print(Panel(result, title=f"[bold cyan]{cmd}"))

        # if we got root, we can stop the loop
        return got_root
```

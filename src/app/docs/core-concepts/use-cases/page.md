---
title: Use-Cases and Agents
nextjs:
  metadata:
    title: Use-Cases and Agents
    description: 'HackingBuddyGPT: Use-Case and Agent Infrastructure'
---

Naming is hard.

We use the term 'Use-Case' for anything that can be executed within HackingBuddyGPT. That's the origin of the naming: HackingBuddyGPT is our tool, and it can run diverse use-cases.

Examples for use-cases include executing a Linux-based Privilege-Escalation Attack, Performing Web Penetration-Testing, or specialized version of the already mentioned Linux Privilege-Escalation Attack utilizing additional information such as human hints.

As soon as you create a valid sub-class of `UseCase`, your code will be able to access different shared functionalities such as the [Configuration Helpers](/docs/dev-guide/configuration-magic).

## Basic 'UseCase' Usage

Imagine the following valid python code that implements a new use-case named `hacking_tool`:

```python
# use this annotations to designate a new use-case
@use_case("hacking_tool", "Description Text for wintermute.py help output")
@dataclass
class HackingTool(UseCase):

  # this will be exposed as configuration option "hack_level" and can be
  # set through the wintermute command line tool
  hack_level: str = "default-value"

  # variables starting with _ will not be used by the configuration magic 
  _variable_not_set_by_configuration: str = "some value"

  def init(self):
    super().init()
    # add code needed for setup here

  def run(self):
    # do something hacky here
    pass
```

It is recommended to define a use case to be a `@dataclass`, so that all parameters are directly visible, and the use-case can be easily extended.

To summarize what is happening here:

- through usage of the `use_case` annotation, hackingBuddyGPT will be able to automatically detect that this should be a callable use-case and adds it to the command line tool with the given name and description during run-time.
- instance variables will automatically be set by the [configuration subsystem](/docs/dev-guide/configuration-magic). In this case, the variable `hack_level` will be exposed by hackingBuddyGPT and can be set within either an `.env` file or through a command line option. `wintermute.py` allows listing of all detected configuration options for each use-case.
- The usecase itself is quite simple, we provide two over-writable methods:
  - `init` should initially call `super().init()` and then include all needed initialization code for this use-case.
  - `run` will be called through hackingBuddyGPT when the user wants to run the use-case.

And that's more or less it. A real use-case would need an AI-connection as well as other sundries, check out [our minimal use-case](/docs/usecases/minimal) for a more elaborate example.


## Using 'RoundBasedUseCase' as Baseclass

Most usecases look quite similar: there will be some sort of AI connection, a database for logging, some rudimentary console output for debugging/feedback, and typically some sort of cut-off when the automaton should be stopped.

Most of this is abstracted away within `RoundBasedUseCase` which can be used as a more convenient baseclass:

```python
@use_case("minimal_linux_privesc", "Showcase Minimal Linux Priv-Escalation")
@dataclass
class MinimalLinuxPrivesc(RoundBasedUseCase):

    # use configuration magic to get a configured SSH connection to a target host
    conn: SSHConnection = None
    
    def init(self):
        super().init()

    # instead of implementing `run` we implement `perform_round`
    def perform_round(self, turn):
      are_we_root_yet: bool = False

      # use helper to get a prompt template
      template_next_cmd = Template(filename="next_cmd.txt")

      # self.console is provided by baseclass for console output
      with self.console.status("[bold green]Asking LLM for a new command..."):
            # get the next command from the LLM
            # self.llm is provided by the baseclass
            answer = self.llm.get_response(template_next_cmd, conn=self.conn)

        with self.console.status("[bold green]Doing something with the LLM's answer..."):
            # now to something with the LLMs answer
            # it's up to you (:
            are_we_root_yet = True

        # if we return True, the usecase will terminate
        return are_we_root_yet
```

Some things to note here:

- we are now using `RoundBasedUseCase` as a new baseclass. This provides many pre-setup helpers such as `self.llm` as an AI connection, `self.log_db` for database base logging, `self.console` for console output.
- instead of implementing `run` we implement `perform_round`. This method will be called up to a configurable `self.max_round` which is 20 by default and can be set through `.env` or the command line. If this method returns `True`, exeuction of the use-case is stopped (as we have become root, thus were successful)
- In this usecase we are using a SSH-Connection for `conn`. Note, how this will be automatically be configured through the configuration subsystem. All that we have to do is to add a new instance variable of type `SSHConnection`.

## Agents

Agents are based upon `RoundBasedUseCase` and add unified capability-Management. Remember, [capabilities](/docs/core-concepts/capabilities) allow an automaton to perform an action in the real world.

One simple Example:

```python
@use_case("minimal_linux_privesc", "Showcase Minimal Linux Priv-Escalation")
@dataclass
class MinimalLinuxPrivesc(Agent):

    # ...

    def init(self):
        super().init()
        self.add_capability(SSHRunCommand(conn=self.conn), default=True)
        self.add_capability(SSHTestCredential(conn=self.conn))

    def perform_round(self, turn):
        with self.console.status("[bold green]Asking LLM for a new command..."):
            # ...

            # get the next command from the LLM
            answer = self.llm.get_response(template_next_cmd, capabilities=self.get_capability_block(), conn=self.conn)
            cmd = llm_util.cmd_output_fixer(answer.result)

        with self.console.status("[bold green]Executing that command..."):
                self.console.print(Panel(answer.result, title="[bold cyan]Got command from LLM:"))
                result, got_root = self.get_capability(cmd.split(" ", 1)[0])(cmd)
        
        # and so on..
```

Some notes:

- Note that we're now subclassing `Agent` instead of `RoundBasedUseCase`.
- In the constructor, we're using `add_capability` to register a call-out capability within our agent. In this case, we're using two premade capabilities: `SSHRunCommand` to execute commands over SSH, and `SSHTestCredential` to test credentials. You can set the parameter `default` to `True` if a capability should be used as catch-all capability (if no other capability matches an LLM's answer).
- When we create the LLM prompt within the `perform_round` method, we're using the `self.get_capability_block()` helper to get a list of all configured capabilities and those to the prompt template (so that the agent knows what actions it has access to)
- After we get an answer from the LLM, we're using the `self.get_capability()` helper to match the LLM's answer to our configured capabilities and subsequently execute the capability.
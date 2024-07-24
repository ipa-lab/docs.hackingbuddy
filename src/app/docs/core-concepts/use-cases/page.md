---
title: Use-Cases and Agents
nextjs:
  metadata:
    title: Use-Cases and Agents
    description: 'HackingBuddyGPT: Use-Case and Agent Infrastructure'
---

Naming is hard.

## Usecase

We use the term 'Use-Case' for anything that can be executed within HackingBuddyGPT. That's the origin of the naming: HackingBuddyGPT is our tool, and it can run diverse use-cases.

Examples for use-cases include executing a Linux-based Privilege-Escalation Attack, Performing Web Penetration-Testing, or specialized version of the already mentioned Linux Privilege-Escalation Attack utilizing additional information such as human hints.

Custom usecases are subclasses of `UseCase` and have to have to implement two abstract methods:

- `run`: this is the main method that will be called when a usecase is started through `hackingBuddyGPT`
- `get_name`: this should return a name for the usecase, it will be used for logging and debugging.

Usecases automatically utilize our [configuration mechanism](/docs/dev-guide/configuration-magic). Usecases themselves are typically implemented using one or more agents.

## Agent

The agent acts on behalf of the user and try to achieve a task given to them. In a security context, they are often given security-related tasks, i.e., they are given the goal to hack a test system.

Within `hackingBuddyGPT`, agents can be created by sub-classing `Agent` and implementing the `perform_round` abstract method. While traditional agents often incorporate a control-loop and run continously, due to safety reasons, our agents do not contain the control loop but only the `perform_round` step function which will be called through `hackingBuddyGPT`. This allows our infrastructure to implement a hard round limit as well as keep the human in the loop after each performed round.

The following are fragments of an agent, showing off `hackingBuddyGPT` features:

```python
# ...

class MinimalLinuxPrivesc(Agent):

    # configured through the configuration subsystem
    conn: SSHConnection = None

    # instance variables starting with _ are not auto-configured
    _sliding_history: SlidingCliHistory = None

    def init(self):
        super().init()
        self._sliding_history = SlidingCliHistory(self.llm)

        # configure agent capabilities
        self.add_capability(SSHRunCommand(conn=self.conn), default=True)
        self.add_capability(SSHTestCredential(conn=self.conn))
        # ..

    # during each round, ask the configured LLM for a hacking command and execute it
    def perform_round(self, turn: int) -> bool:
      # do something ..
      
      # if this method returns True, execution is stopped
      return False
```

To summarize what is happening here:

- instance variables will automatically be set by the [configuration subsystem](/docs/dev-guide/configuration-magic). In this case, the variable `hack_level` will be exposed by hackingBuddyGPT and can be set within either an `.env` file or through a command line option. `wintermute.py` allows listing of all detected configuration options for each use-case.
- The usecase itself is quite simple, we provide two over-writable methods:
  - `init` should initially call `super().init()` and then include all needed initialization code for this use-case.
  - `perform_round` will be called repeatably through hackingBuddyGPT

## Matching Agents and UseCases

How do we connect usecases with agents? Typically, developers will create an autonomous agent which should be called by `hackingBuddyGPT` until it returns True (the goal has been achieved) or the maximum round number has been reached.

`hackingBuddyGPT` provides helper methods for this:

```python
@use_case("Showcase Minimal Linux Priv-Escalation")
class MinimalLinuxPrivescUseCase(AutonomousAgentUseCase[MinimalLinuxPrivesc]):
    pass
```

In this case we define a new UseCase (`MinimalLinuxPrivescUseCase`) which inherits from `AutonomousAgentUseCase` which in turn is parametrized with our `MinimalLinuxPrivesc` agent. `AutonomousAgentUseCase` incorporates all needed logic to make an agent runable.

Adding this subclass will achieve the following:

- through usage of the `use_case` annotation, hackingBuddyGPT will be able to automatically detect that this should be a callable use-case and adds it to the command line tool with the given name and description during run-time.
- When called, the encapsulated agent will be configured and their `perform_round` method called until the task has been achieved or a configurable round limit reached
- Both usecase and agent are configured using our Configuration System.

For a fully fleshed-out example, please see our [Minimal LinuxPrivesc Usecase](/docs/usecases/minimal).
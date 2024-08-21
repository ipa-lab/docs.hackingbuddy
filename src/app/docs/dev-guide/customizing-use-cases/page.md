---
title: Customizing Use-Cases
nextjs:
  metadata:
    title: Customizing Use-Cases
    description: "HackingBuddyGPT: Oftentimes you just need to slightly adopt and customize a use-cae for your own purposes. This example shows you how."
---

Typically you are able to just wrap an `Agent` within an `UseCase` and through that make the agent configurable and callable through the `hackingBuddyGPT` command line interface. For example, this is how the `LinxuPrivesc` agent is defined and subsequently wrapped within `LinuxPrivescUseCase`:

```python
class LinuxPrivesc(Privesc):
    conn: SSHConnection = None
    system: str = "linux"

    def init(self):
        super().init()
        self.add_capability(SSHRunCommand(conn=self.conn), default=True)
        self.add_capability(SSHTestCredential(conn=self.conn))


@use_case("Linux Privilege Escalation")
class LinuxPrivescUseCase(AutonomousAgentUseCase[LinuxPrivesc]):
    pass
```

But sometimes you need to customize the use-case (or actually the used agent within the use-case). One example of this would be `ExPrivEscLinuxHintFileUseCase`. This use-case is also based upon `LinuxPrivesc` but extracts per-target hints from a hintfile and passes the respective hint for the current hostname to the `LinuxPrivesc` agent.

This can be achieved by adding the needed setup logic to the `init` method:

```python
@use_case("Linux Privilege Escalation using hints from a hint file initial guidance")
class ExPrivEscLinuxHintFileUseCase(AutonomousAgentUseCase[LinuxPrivesc]):
    hints: str = None

    def init(self):
        super().init()
        self.agent.hint = self.read_hint()

    # simple helper that reads the hints file and returns the hint
    # for the current machine (test-case)
    def read_hint(self):
        try:
            with open(self.hints, "r") as hint_file:
                hints = json.load(hint_file)
                if self.agent.conn.hostname in hints:
                    return hints[self.agent.conn.hostname]
        except FileNotFoundError:
            self._log.console.print("[yellow]Hint file not found")
        except Exception as e:
            self._log.console.print("[yellow]Hint file could not loaded:", str(e))
        return ""
```

This works, as the `LinuxPrivesc` agent itself reads the hint from `self.agent.hint`, i.e., `self.hint` from within the agent object.

---
title: A use-case using another use-case
nextjs:
  metadata:
    title: A use-case using another use-case
    description: "HackingBuddyGPT: Oftentimes when you're working on a complex use-case you might want to incorporate behavior of another (simpler) use-case."
---

Oftentimes when you're working on a complex use-case you might want to incorporate behavior of another (simpler) use-case.

For example, our linux-based privilege escalation use-case (`LinuxPrivesc`) inherits the `hint` option from the `Privesc` base-class. A "hint" is used as a simple means of providing some guidance to the used agent/use-case.

What if we have a textfile with a mapping of hostname, i.e., experiment test-case, to a given hint? How can we incorporate this without changing the existing `LinuxPrivesc` code?

One way of solving this would be to create a new use-case/agent that takes the hintfile-path as option, reads that file and then calls the original `LinuxPrivesc` use-case with the matching extracted hint.

We do exactly this in `PrivescWithHintFile`:

```python
@use_case("linux_privesc_hintfile", "Linux Privilege Escalation using a hints file")
@dataclass
class PrivescWithHintFile(UseCase, abc.ABC):
    conn: SSHConnection = None
    system: str = ''
    enable_explanation: bool = False
    enable_update_state: bool = False
    disable_history: bool = False
    hints: str = ""

    # all of these would typically be set by RoundBasedUseCase :-/
    # but we need them here so that we can pass them on to the inner
    # use-case
    log_db: DbStorage = None
    console: Console = None
    llm: OpenAIConnection = None
    tag: str = ""
    max_turns: int = 10

    def init(self):
        super().init()

    # simple helper that reads the hints file and returns the hint
    # for the current machine (test-case)
    def read_hint(self):
        if self.hints != "":
            try:
                with open(self.hints, "r") as hint_file:
                    hints = json.load(hint_file)
                    if self.conn.hostname in hints:
                        return hints[self.conn.hostname]
            except:
                self.console.print("[yellow]Was not able to load hint file")
        else:
            self.console.print("[yellow]calling the hintfile use-case without a hint file?")
        return ""

    def run(self):
        # read the hint
        hint = self.read_hint()
         
        # call the inner use-case
        priv_esc = LinuxPrivesc(
            conn=self.conn, # must be set in sub classes
            enable_explanation=self.enable_explanation,
            disable_history=self.disable_history,
            hint=hint,
            log_db = self.log_db,
            console = self.console,
            llm = self.llm,
            tag = self.tag,
            max_turns = self.max_turns
        )

        priv_esc.init()
        priv_esc.run()
```

There is some ugliness involved: we need to manually add all parameters of the encapsulated use-case to our new (outer) use-case to expose them to the configuration system. Also, to get the list of available configuration options, we actually run `wintermute.py linux_privesc --help` to then set the corresponding values in the python code (in the `run` method).
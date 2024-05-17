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

It is recommended to use the `RoundBasedUseCase` base class as a foundation for a new use-case, as it offers additional helper functions. For seamless integration into the command line interface, begin by marking the class with the `use_case` annotation, which includes a name and description. Additionally, defining your use case as a `dataclass` is recommended because it makes all parameters transparent and enables straightforward extensions.
~~~python
# add the use-case to the wintermute command line interface
@use_case("minimal_linux_privesc", "Showcase Minimal Linux Priv-Escalation")
@dataclass
class MinimalLinuxPrivesc(RoundBasedUseCase):
~~~
Furthermore, you can define variables for the interaction of the agent. _This does not necessarily have to be an ssh-connection as shown in this example._ 
~~~python
    # variables are automatically added as configuration options to the command line
    # their sub-options will be taken out of the corresponding class definitions
    # which in this case would be out of `SSHConnection`
    conn: SSHConnection = None
    # variables starting with `_` are not handled by `Configurable` 
    _sliding_history: SlidingCliHistory = None
    _capabilities: Dict[str, Capability] = field(default_factory=dict)
~~~
The `init` method is used to set up and organize different tasks for an object:
1. **Initialization**: It starts by calling the `init` method of its parent class to make sure any necessary setup from the parent class is also performed.
2. **Setting History**: It creates a `SlidingCliHistory` object, which helps in managing and recording command history interactions. _This is not necessary for every agent and can be customized._
3. **Adding Capabilities**: It sets up capabilities, which are specific functions that the Large Language Model (LLM) can use to interact with a system. In this example, two capabilities are added:
   - `run_command`: This capability allows the LLM to execute commands via SSH.
   - `test_credential`: This lets the LLM test credentials over an SSH connection.
4. **Template Size Calculation**: This method counts how many tokens a text query contains by encoding the query and then measuring the length of the resulting tokens.

~~~python
    # use init to perform initialization tasks
    def init(self):
        super().init()
        self._sliding_history = SlidingCliHistory(self.llm)

        # capabilities are actions that can be called by the LLM
        self._capabilities["run_command"] = SSHRunCommand(conn=self.conn)
        self._capabilities["test_credential"] = SSHTestCredential(conn=self.conn)
        self._template_size = self.llm.count_tokens(template_next_cmd.source)
~~~
Every agent that is based on the `RoundBasedUseCase` has to implement the `perform_round` function. This reason why this function is important is due to the fact that it outlines the specific actions or behaviors the agent will carry out in each round or cycle of its operation. It is executed in sequence and manages all interactions with the system and the LLM. If the method returns `True`, the agent's execution is halted. Otherwise, the execution continues until a predefined maximum number of turns is reached.

~~~python
    
    def perform_round(self, turn):
        got_root : bool = False
~~~
This section of the function is responsible for sending the next command to the LLM:

1. **Display Status**: It shows a message on the console that says, "[bold green]Asking LLM for a new command...", to inform the user that it is in the process of obtaining a new command from the LLM.

2. **Gather History**: The code retrieves a portion of past interactions (history) that fits within a specific limit determined by the LLM's context size, reduced by a safety margin and the size of a predefined template. This ensures the LLM has relevant past information to consider but not too much that it exceeds its processing capacity.

3. **Request Command**: It then sends a request to the LLM, providing it with this history, certain capabilities (like additional functions it can perform), and the connection information. This request is for the LLM to generate a command based on the given context.

4. **Process Command**: Once the LLM responds with a command, the command's output is adjusted or 'fixed' using a utility function (cmd_output_fixer) to ensure it is in a suitable format or correct any anomalies before further processing.
~~~python
        with self.console.status("[bold green]Asking LLM for a new command..."):
            # get as much history as fits into the target context size
            history = self._sliding_history.get_history(self.llm.context_size - llm_util.SAFETY_MARGIN - self._template_size)

            # get the next command from the LLM
            answer = self.llm.get_response(template_next_cmd, _capabilities=self._capabilities, history=history, conn=self.conn)
            cmd = llm_util.cmd_output_fixer(answer.result)
~~~
This section processes and executes the command obtained from the LLM, checks the type of command, executes it accordingly, and records the outcome and any significant status change (like gaining administrative access).

1. **Display Execution Status**: The code updates the console to display the message "[bold green]Executing that command..." to inform the user that it is now going to execute the command it previously received from the LLM.

2. **Command Execution**:
   - **Credential Testing**: If the command received starts with "test_credential", it triggers a specific action using a capability designed to test credentials. It executes this command, and the result of this test, along with whether administrative access (`got_root`) was gained, is stored.
   - **General Command Execution**: If the command does not involve testing credentials, the command is displayed on the console in a panel titled "[bold cyan]Got command from LLM:". Following this, the general command execution capability is used to run the command, storing the result and whether administrative access was achieved in a similar manner.

3. **Outcome Handling**:
   - The results of the command (whether it was to test credentials or execute another action) are captured along with a flag (`got_root`) indicating whether the command execution resulted in gaining administrative access.


~~~python
        with self.console.status("[bold green]Executing that command..."):
            if answer.result.startswith("test_credential"):
                result, got_root = self._capabilities["test_credential"](cmd)
            else:
                self.console.print(Panel(answer.result, title="[bold cyan]Got command from LLM:"))
                result, got_root = self._capabilities["run_command"](cmd)
~~~
This section logs the command and its results, updates the command history, displays the results on the console, and determines whether to stop the loop based on whether administrative access was gained (got_root).

1. **Logging**: The command and its result are logged in a database using `self.log_db.add_log_query`. This function records the run identifier, the current turn, the command, its result, and the response from the LLM.

2. **History Update**: The command and its result are also added to a sliding history of commands (`self._sliding_history.add_command`) to maintain a record of past interactions.

3. **Display Results**: The result of the command is displayed on the console in a visually distinct panel titled with the command itself, allowing the user to see the outcome clearly.

4. **Decision to Continue or Stop**: The function checks if `got_root` was obtained as a result of the command. If `got_root` is `True`, indicating that administrative access was achieved, the loop in which this function is called can be stopped. This serves as a stopping condition based on the success of the operation.
~~~python
# log and output the command and its result
        self.log_db.add_log_query(self._run_id, turn, cmd, result, answer)
        self._sliding_history.add_command(cmd, result)
        self.console.print(Panel(result, title=f"[bold cyan]{cmd}"))

        # if we got root, we can stop the loop
        return got_root
~~~

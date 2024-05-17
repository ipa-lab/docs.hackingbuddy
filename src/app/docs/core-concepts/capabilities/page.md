---
title: Capabilities
nextjs:
  metadata:
    title: Capabilities
    description: 'HackingBuddyGPT: Capabilities and where to find them.'
---

A capability is an action that can be used by an LLM to perform a task.

We currently support using capabilities in multiple ways, one of which is to manually parse out a capability call from LLM output, or by using function calling/instructor to automatically have the parameters passed and validated.

Both of the approaches have their own advantages and disadvantages, and we are currently exploring those and further ones to see which work best for our use-cases.

## Example Capability: Test Credentials over SSH

```python
class SSHTestCredential(Capability):
    conn: SSHConnection

    def describe(self) -> str:
        return f"give credentials to be tested by stating `{self.get_name()} username password`"

    def get_name(self):
        return "test_credential"

    def __call__(self, command: str) -> Tuple[str, bool]:
        cmd_parts = command.split(" ")
        assert (cmd_parts[0] == "test_credential")

        if len(cmd_parts) != 3:
            return "didn't provide username/password", False

        # now test the credentials. The second return parameter signifies if
        # the action was able to become the root user
        return "To be done", True
```

What goes on here?

- We're subclassing `Capability` to signal that we're creating a new capability.
- the `describe` and `get_name` methods are used to automatically generate a description for use within prompt templates
- the `__call__` method is executed, if an LLM wants to use a configured capability. We initially do some sanity checks about the called capability's name and parameter count. How does the LLM know the syntax of the capability call? It gets it from the output of the `describe` method.
- If `__call__` returns `True` the callout was successful. Please note, that this does not mean that the callout operation was successful but rather that the operation was successful in achieving the 'use-cases' tasks, e.g., after calling the capability the user has become root.
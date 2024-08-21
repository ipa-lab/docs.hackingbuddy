---
title: LLM Backends
nextjs:
  metadata:
    title: LLM Backends
    description: 'HackingBuddyGPT: What Backend Options do I have?'
---

hackingBuddyGPT does not directly start a LLM but connects to an existing LLM over the network. There are multiple options, each of them can be configured through the command line or `.env` file.

## OpenAI

The easiest way is to create an access token within an OpenAI account and configure that through the `.env` file:

```text
llm.api_key="sk-..."
llm.model='gpt-4-turbo'
llm.context_size=8192
```

## Using a local ollama/llama-cpp-python setup

You can run a LLM locally (or on a remote server) through `ollama` or `llama-cpp-python`. These tools provide an OpenAI-compatible web api which you can configure as endpoint within hackingBuddyGPT:

```text
llm.api_url="http://localhost:8000"
llm.model='llama3'
llm.context_size=4096
```

## GitHub Models

If you want to use [GitHub Models](https://github.com/marketplace/models/), you first need to [generate a github personal access token](https://github.com/settings/personal-access-tokens/new) and configure that within your `.env` file:

```text
llm.api_key='github_pat_...'
llm.api_url='https://models.inference.ai.azure.com'
llm.api_path='/chat/completions'
llm.model='Meta-Llama-3.1-405B-Instruct'
llm.context_size=4096
```

---
title: Configuration Ollama
nextjs:
  metadata:
    title: Configuration Ollama
    description: 'HackingBuddyGPT: How to set up ollama, the deployment environment?'
---

system minimum configuration

- RAM 16G
- hard drive space at least 20G (Depends on the ollama model size you use)

ollama download

(You need to download and run the bad llama!!)

~~~bibtex
//choose one model 
https://ollama.com/reefer/erphermesl3
https://ollama.com/gdisney/zephyr-uncensored
https://ollama.com/gdisney/mistral-uncensored
https://ollama.com/gdisney/mixtral-uncensored
https://ollama.com/gdisney/orca2-uncensored
https://ollama.com/jimscard/blackhat-hacker

~~~

Depending on your system environment, you can choose to use `cp` to copy the model or modify `.env ` and other files to import ollama

~~~bibtex
//then copy the selected model into gpt-3.5-turbo
 ollama cp gdisney/mistral-uncensored gpt-3.5-turbo
~~~

change the `.env` file

~~~bibtex
llm.api_key='ollama'
log_db.connection_string='log_db.sqlite3'

# exchange with the IP of your target VM
conn.host='192.168.XXX.XXX'  #change here - target IP addr
conn.hostname='kali' #change here - target hostname
conn.port=22

# exchange with the user for your target VM
conn.username='kali' # change here - target username
conn.password='kali' # change here - target user passwd

# which LLM model to use (can be anything openai supports, or if you use a custom llm.api_url, anything your api provides for the model parameter
llm.model='gpt-3.5-turbo' #Modify according to the model you use! If you do not use the previous method of copying the model, you will need to modify more files to import the model you use.
llm.context_size=16385
llm.api_url='http://localhost:11434'

# how many rounds should this thing go?
max_turns = 30
~~~

- here the openai llama using method u can refer here but I do not recommend using llama2, llama3...Because you may encounter some security policy issues that prevent you from carrying out the attack

{% UseCaseImage icon="ollamaimg" /%}

- You always reveive messages like this `I can't help you escalate privileges in Linux`. `Can I help you with anything else?` 、`I cannot assist with escalating privileges in Linux by abusing commands and misconfiguration on a tested system`. `Is there something else I can help you with?` …

    - This is their llama default security policy that blocks, so pls replace it with bad llama, as I recommended above, or u can find it yourself

[openai](https://github.com/ollama/ollama/blob/main/docs/openai.md)

if u encounter some ollama server issue, u can try to `systemctl restart ollama.service` 

or through `systemctl edit ollama.service` check the ollama setting

when ollama download model finish, u can cd to `src/hackingBuddyGPT/cli` then run 

~~~bibtex
┌──(venv)─(root㉿kali)-[/home/kali/Downloads/hackingBuddyGPT]
└─# cd src/hackingBuddyGPT/cli
                                                                                                                                                                                             
┌──(venv)─(root㉿kali)-[/home/…/hackingBuddyGPT/src/hackingBuddyGPT/cli]
└─# python wintermute.py 
usage: wintermute.py [-h]
                     {linux_privesc_hintfile,linux_privesc_guided,linux_privesc,windows_privesc,minimal_linux_privesc,minimal_linux_templated_agent,simple_web_test,web_test_with_explanation,simple_web_api_testing,simple_web_api_documentation}
                     ...
wintermute.py: error: the following arguments are required: {linux_privesc_hintfile,linux_privesc_guided,linux_privesc,windows_privesc,minimal_linux_privesc,minimal_linux_templated_agent,simple_web_test,web_test_with_explanation,simple_web_api_testing,simple_web_api_documentation}

~~~



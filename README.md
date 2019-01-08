# Remote Tunneling Server Controller 
RTSC is a tool, there can control computer from web-interface.
Supports on Linux, Windows, MacOS, Raspberry PI, Solaris.
![Image alt](https://www.nikitarykov.ml/rtsc/rtsc_logo.png)
## Installation ##
**Windows:**
```
$ npm install rtsc -g
```
**Linux:**
```
$ sudo setcap CAP_NET_BIND_SERVICE=+eip /usr/bin/node
$ sudo npm install rtsc -g
```
This will add the command ```rtsc``` to you command line
## Usage ##
```
rtsc {Subdomain for localtunnel} {Username} {Password} {Local port (not necessary)}
```
or you can load config from json file
```
rtsc -c ./myconfig.json
```
**Example:** 
```
rtsc example myUser qwerty
```
After this command you can visit ```https://example.localtunnel.me``` (You ```Subdomain```.localtunnel.me) and login as ```myUser``` with password ```qwerty```

## Loading config from json file ##
Create file ```config.json``` with content:
```json
{
    "port":615,
    "username":"you_username",
    "password":"example_password",
    "subdomian":"example_subdomain"
}
```
Load the command "rtsc -c ./*config*.json"
And now, you can visit ```https://example_subdomain.localtunnel.me```  (You ```Subdomain```.localtunnel.me) and login as ```you_username``` with password ```example_password```

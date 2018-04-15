# WhichStation

A simple application to choose between two stations for fastest travel to or from a target station, using National Rail Enquiries web services.

### Getting Started

Checkout this repo.

A Network Rail Enquiries token is needed, available from: https://realtime.nationalrail.co.uk/OpenLDBWSRegistration/Registration

Copy *access_token.js.sample* to *access_token.js* and replace *YourTokenGoesHere* with your real token. **Do not** check *access_token.js* into any public repository.

Install dependencies, then start the local web server process with the following:

```
> git clone https://github.com/mjg17/WhichStation.git
> cd WhichStation
> npm install
> npm start
```

### Powered by

* National Rail Enquiries http://www.nationalrail.co.uk/100296.aspx
* Huxley https://huxley.apphb.com/

# WhichStation

A simple application to choose between two stations for fastest travel to or from a target station, using National Rail Enquiries web services.

### Why?

I live roughly mid-way between Bristol Temple Meads and Bristol Parkway stations, and often want to know which one it would be faster to travel to (or from).

### Getting Started

Checkout this repo.

A Network Rail Enquiries token is needed, available from: https://realtime.nationalrail.co.uk/OpenLDBWSRegistration/Registration

Copy *access_token.js.sample* to *access_token.js* and replace *YourTokenGoesHere* with your real token. **Do not** check *access_token.js* into any public repository.

Install dependencies, then start the local web server process with the following:

```
> git clone https://github.com/mjg17/WhichStation.git
> cd WhichStation
> cp access_token.js.sample access_token.js
# edit access_token.js to install token as described above
> npm install
> npm start
```

### Powered by

* National Rail Enquiries http://www.nationalrail.co.uk/100296.aspx
* Huxley https://huxley.apphb.com/

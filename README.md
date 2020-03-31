# boredcaster

Synchronize and control youtube for group events

Install dependencies (websockets) and run the application with: 

```
npm install
node server.js
```

Go to http://localhost:8080 on your browser. 

Port 5000 is used by the application for websocket messages. If using a service like ngrok to expose this application, you would need to open both the ports, as follows:

```
ngrok http 8080
ngrok http 5000
```

# Sights Lite

![Screenshot](screenshot.png)

A rewrite of [Sights](https://github.com/sightsdev/sights), designed to address the steep learning curve, outdated framework and difficult extensibility.

It presently makes a number of core design decisions different to Sights including a purely declarative semi-stateless model based on a single hardware configuration file, RESTful APIs instead of WebSockets, and recurring API calls instead of streaming of sensor data. Some of these decisions may change before the final version.

It uses a modern stack: React on the frontend and Starlette/FastAPI (Python) on the backend. Frontend uses Typescript with endpoints generated from the backend applications. UI is primarily built using TailwindCSS.

Still in early stages of development. It may eventually replace Sights (as Sights 2.0) once a suitable level of extensibility (particularly some sort of plugin support) and abstraction from the rescue robotics domain is reached. 

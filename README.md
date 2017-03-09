# Copy2me

*Copy2me* is a Progressive Web App which enables you to easily share any links across all 
your devices in a simple and intuitive way. The following screenshots give you an idea how the 
application looks. 

Open <a href="https://copy2me.filipe-santoscorrea.de" target="_blank">Copy2me</a> and start sharing your links. 

<img src="https://cloud.githubusercontent.com/assets/3514796/23517677/5b3b778e-ff71-11e6-8c09-527c9df46f8e.png" 
alt="welcome" width="240px" height="auto">
<img src="https://cloud.githubusercontent.com/assets/3514796/23517678/5b583b12-ff71-11e6-9640-cbaf2513db69.png" 
alt="home" width="240px" height="auto">
<img src="https://cloud.githubusercontent.com/assets/3514796/23517679/5b5db1dc-ff71-11e6-9299-fd8dbc427d2a.png" 
alt="push" width="240px" height="auto">



## Technology Stack

* Angular 2
* Webpack 2
* Firebase
* localForage
* TypeScript
* ECMAScript 2015
* materialize-css
* sw-toolbox



## Features

Copy2me fulfills all steps of Google's Progressive Web App <a href="https://developers.google.com/web/fundamentals/getting-started/codelabs/your-first-pwapp/" target="_blank">definition</a>:

- [x] Progressive (newer web standards like the service worker are progressively enhanced)
- [x] Responsive
- [x] Connectivity Independent
- [x] App-like
- [x] Fresh
- [x] Safe
- [x] Discoverable
- [x] Re-engageable
- [x] Installable
- [x] Linkable

<br/>


# Getting started

If you want to experiment with this application and learn more about the concepts 
behind Progressive Web Apps just fork this project and get started. A great introduction
on what Progressive Web Apps are exactly can be found on <a href="https://developers.google.com/web/progressive-web-apps/" target="_blank">Google's Developers</a> site.

The following steps explain all steps in order to execute Copy2me on your local machine:

<br/>

#### **Requirements**

Before you can compile and run the project you have to make sure that you installed Node.JS on computer.
If you are uncertain whether you already have a copy of Node installed on your machine, just execute the following command in your command line:

```bash
$ node -v
```



After executing this command you should see either the installed version number of Node or the error message 'command not found' indicating that Node is not installed on your system.

You can download the latest Node.JS version from the official node site: <a href="https://nodejs.org" target="_blank">https://nodejs.org</a>.
Node.JS is available on Windows, macOS and Linux. It's important to know that Node comes with npm (node package manager), which is the tool needed to install the Copy2me dependencies later.




<br/>


#### **Clone or download the project**

Now that you made sure that Node.JS is installed on your system you can clone or <a href="https://github.com/Safi1012/copy2me/archive/master.zip" target="_blank">download</a> the project.

```bash
$ git pull https://github.com/Safi1012/Piclet.git
```





<br/>


#### **Install all dependencies**

To install all Copy2me dependencies you just have to navigate to the project root and execute:

```bash
$ npm install
```

Npm will then start downloading and install all referenced dependencies.

<br/>


#### **Execute Copy2me**

Finally, run the application and start experimenting. The following commands help you to get started:


|Command|Description|
|---|---|
|npm run start|Starts webpack development server @**localhost:3001**|
|npm run server:dev|Starts webpack development server @**localhost:3001**|
|npm run server:prod|Builds production bundle to **/dist** directory and starts a server @**localhost:8080**|
|npm run build|Builds production bundle to **/dist** directory|
|npm run build:aot|Builds production bundle with the AOT compiler to **/dist** directory|


<br/>


#### **Deploy Copy2me**

If you want to deploy Copy2me by yourself make sure to checkout the <a href="https://github.com/Safi1012/copy2me-backend" target="_blank">Copy2me-backend</a> repository.

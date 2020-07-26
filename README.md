# nodegenius




What is Node js ?
- Highly scalabale, Asynchrous (non blocking) table. ex., a waiter serves all tables without waiting for one order to finish.
- Node apps are Aynchronous by default
- A thead never waits for one request
- Node is best used for I/O intensive apps but not for cpu intensive apps such as Image processing


example
--------
function example(a) {
    console.log("hi there", a)
}
example('syam');

note: in node, we dont have document object like in js browsers does, bcas its wrapped inside a chromes v8 engine with c++ code.

Course structure
----------------
1. Module System 
2. Node package Manager
3. Building RESTful API's
4. Asynchronous Javascript
5. Mongodb / Mongoose
6. Authentication / Authorisation 
7. Handling and logging erros
8. Unit and Integration testing
9. Test driven developoment (TDD)
10. Deployment

1. Node Module System
---------------------
will discuss about os, file, events and http
Global object
----------
console.log() ; // window object // 
setTimeout() // window object (internally converts as window.setTimeout()


these all belongs to window object in node are global object scoped.
example setTimeout() can be accessed by global.setTimeOut()

for ex., var message="test message"
this varialbe cant be accessed from global. means all varibles declarations doesnt add to global access..


21-07-2020
----------
Load a module
--------------

logger.js
--------
logger = (message) => {
  console.log("This is the message ", message);
};
module.exports.log = logger;


app.js
------
//load the module


const loggerX = require('./logger')

function example(a) {
    loggerX.log(a)
}
example('syam'); 

note: if you overwrite any var, it will be replaced with new 

for ex., loggerX = 1; will give an error


Module Wrapper : 
---------------- 
Every function in node is wrapped with below function


function(exports, require, module, __filename, __dirname) {

--- --
--- and your actual code

}
// so all the above parameters are local to every module, they are not global :D 


Path module
-----------
Its used to parse the path module

ex., 
var path = require('path'); 

let value = path.parse(__filename);
console.log(value); 

OS module
---------
var os = require('os'); 

console.log(os.freemem());
console.log(os.totalmem())

Template literals  using ES6:

console.log(`Hi this is template litera : ${os.freemem()}`)

File System Module
--------

ex : 
var fs = require('fs') 

fs.access() . fs.accessSync() 


every fs object has two types of methods synch and asynch , try to avoid synch methods as other pecess waits for them 

-- all asynch methods have callback fucntions 

for ex.,   
fs.readdir(".d/", (err, res) => {
    if (err) {
      console.log("errror", err);
    } else {
      console.log("result", res);
    }
  })

 
 Events
 ---------

This module is used to raise event and listen

ex,

cosnt EventEmitter = require('events') 
const emitter = new EventEmitter() ; 


// listen event

emitter.on("someFuntion" , function( arguments) {
    console.log("called somefunction" , arguments )

})

//raise an event
emitter.emit("someFunction") 

Event arguments
--------------

emitter.emit("someFunction" , {param1, param2} ) 



Events Emitter extended code
----------------------
logger.js
--------
const EventsEmitter = require("events");

class Logger extends EventsEmitter {
  log(params) {
    console.log("params is called ", params);
    this.emit("skvTest", { id: "101" });
  }
}

module.exports = Logger; 

app.js
------
const EventsEmitter = require("events");

const Logger = require('./logger')
var logger = new Logger(); 


// listen  
logger.on("skvTest", args => {
    console.log("this is what actually passed" , args)
})

logger.log("Syam is sending the message")// refer 2nd chapter 14th video further detaisl in node js video tutorials...


HTTP MODULE
-----------

This is used to create server objects
----------------------------------



const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("hello world");
    res.end();
  } else {
      res.write("hello duniya");
      res.end();
  }
});
server.listen(3000);
console.log("lisasdfasdf", server);


Node Core RECAP
------------------
So, in this section, you learned that:
- We don’t have the window object in Node.
- The global object in Node is “global”.
- Unlike browser applications, variables we define are not added to the “global”
object.
- Every file in a Node application is a module. Node automatically wraps the code
in each file with an IIFE (Immediately-invoked Function Expression) to create
scope. So, variables and functions defined in one file are only scoped to that file
and not visible to other files unless explicitly exported.
- To export a variable or function from a module, you need to add them to
module.exports:
module.exports.sayHello = sayHello;
- To load a module, use the require function. This function returns the
module.exports object exported from the target module:
const logger = require(‘./logger’);
- Node has a few built-in modules that enable us to work with the file system, path
objects, network, operating system, etc.
- EventEmitter is one of the core classes in Node that allows us to raise (emit) and
handle events. Several built-in classes in Node derive from EventEmitter.
- To create a class with the ability to raise events, we should extend EventEmitter:
class Logger extends EventEmitter {
}


25-07-2020
----------

npm Packakge Manager
--------------------> 
To install a specific version 

>> npm i g npm@5.x.x
    > i is install 
    > g is global user installation across machin
    
2. Package.json
---------------
>> Every node app should contain package.json
 
To install this >> npm init
it prompts some questions and enter the meta data and enter 

>> Quick install  >> npm init --yes (this skips all questions) 

3. Installing a node package manager
----------------------------------------
>> npm i packagename 
this adds an entry in the package.json and also adds the actual plugin under node_modules folder

4. Using a Package
------------------
To load the installed plugin
var _ = require('underscore')

ex:./ 
var _ = require("underscore"); 
let x = _.contains([1, 2, 3], 1); 
console.log("check if array contains " , x)



5. Package Dependencies
-----------------------
All dependencies will be stored under node_modules

There is a scenario, if we install underscore and it stores as it is,

on the other hand if we install mongoose plugin, that internally depends on underscore



6. Source control 
---------------

Do not add node_modules to source control packages.json is the only thing you should include that automatically downloads 

To add it to git repo >> 
>> git init
.gitignore -> this ignores the files which we include
add node_modules to .gitignore

7. Semantic versioning in node
-------------------------

for ex., a 
dependencies : {
    "mongoose" : "^4.3.1"     // Major.Minor.patch  , Caret symbol tells 
}
 

Note:
-----
^ means only minor version can be upgraded but not the major version
ex : "^4.3.1" is equivalanet "^4.X.X"

~ means only a patch version can be upgraded .
ex : "~4.3.1" is equivalant to "4.3.X"
If you want exact version remove ^ or ~ 
 
7. Listing installed dependencies
----------------------------------
>> npm list  // shows the full dependencies 
if you want only high level dependencies without nested below is the command

>> npm list --depth=0 

9- Viewing Registry Info for a Package
---------------------------------------
To view a specific plugin's information below is the command

>> npm view mongoose 

to view only dependency information 
>> npm view mongoose dependencies
 
10- Installing a Specific Version of a Package
------------------------------------------------
Add @major.minor.patch versions 
ex., 
>> npm install mongoose@X.X.X 

11- Updating Local Packages
-----------------------------
To view outdated versions installed 

>> npm outdated
To update to latest versions use
>> npm updated // but this updates only minor and patch versions

To update to major versions 
>> npm  i -g npm-check-updates 

To run
>>npm-check-updates -u 
This recursively updates to latest versions (including major versions) (this updates the package.json file)
Next run this to install latest versions 

>>npm install (this upgrades to latest node_modules 

12- Dev Dependencies:
--------------------

jshint -> It is used to inspect dev time development

>> npm i jshint --save-dev
note : --save-dev segrates the depencies in pacakge.json file Those wont be packaged for production build
 
 
13- Uninstalling a Package
---------------------------
>> npm uninstall mongoose // this removes from the package.json and node_modules folder

14- Working with Global Packages
-------------------------------

to install a package globally 
>> sudo npm i -g npm // this installs global package 
>> npm -g outdated // this lists global package dependencies 

15- Publishing a Package
------------------------
>> mddir new_package
>>cd new_package
>> npm init // this initialieses the node package. 

index.js
--------
add some function and make sure its exported otherwise other programs can't access it

ex., module.exports.calculateSum = function(a , b) {
return a + b ; 
}


now you can import above package using the below command

>> npm install new_package 

and in your application, 
var new_pack = require('new_package')
new_pack.calculateSum(10, 20)  // returns 30 


16- Updating a Published Package
---------------------------------

Whenever you update your plugin package, you have update the package version 

otherwise npm rejects it


To update the versions through commands see below examples 

 
hadoopuser:~/allprojects/skv_plugin$ npm version  major
v2.0.0
hadoopuser:~/allprojects/skv_plugin$ npm version  minor
v2.1.0
hadoopuser:~/allprojects/skv_plugin$ npm version  patch
v2.1.1

RECAP
-------
So, in this section, you learned that:
- Every Node application has a package.json file that includes metadata about the
application. This includes the name of the application, its version, dependencies,
etc.
- We use NPM to download and install 3rd-party packages from NPM registry:
- All the installed packages and their dependencies are stored under
node_modules folders. This folder should be excluded from the source control.
- Node packages follow semantic versioning: major.minor.patch
- Useful NPM commands are:
// Install a package
npm i <packageName>
// Install a specific version of a package
npm i <packageName>@<version>
// Install a package as a development dependency
npm i <packageName> —save-dev
// Uninstall a package
npm un <packageName>
// List installed packages
npm list —depth=0// View outdated packages
npm outdated
// Update packages
npm update
- To install/uninstall packages globally, use -g flag.






 
 
 
 
 
 
 














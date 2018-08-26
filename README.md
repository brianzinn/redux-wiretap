# redux-wiretap
This is a simple project used to listen in on redux messages and take action.  Listeners can be automatically added/removed. Useful for attaching part of your page to intercept messages and update.  ie: WebGL canvas to update based on actions.

In your top-level component mount/unmount you need to register and deregister your middleware handlers.  So, we are bringing the redux actions right into our component - not via props, which is generally the correct way.

### Install

```bash
$ cd <your-project-dir>
$ npm install redux-wiretap --save

# Run npm install and write your library name when asked. That's all!
$ cd <your-project-dir>
$ yarn add redux-wiretap --save
```

### Importing library

You can import the generated bundle to use the whole library generated by this starter:

```javascript
import middleware from 'redux-wiretap'
```

Additionally, you can import the transpiled modules from `dist/lib` in case you have a modular library:

```javascript
import middleware from 'redux-wiretap/dist/lib/??'
```

## Usage
```javascript
import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import reduxWiretap from 'redux-wiretap'
 
export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk, reduxWiretap]
 
  return createStore(
    ...,
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
}
```
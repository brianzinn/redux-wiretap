export type HandledResult = {
  handled: boolean
  handlers: number
  errors: any[]
}

let handlers: Array<(action: any) => boolean> = []

/**
 * Register a handler to intercept events.
 * @param handler
 */
export const registerHandler = (handler: (action: { type: string }) => boolean) => {
  if (typeof handler !== "function") {
    console.error("parameter handler is not a function", handler)
  } else {
    handlers.push(handler)
  }
}

/**
 * Remove registration of handler.
 *
 * @param handler
 */
export const removeHandler = (handler: (action: { type: string }) => boolean) => {
  if (typeof handler !== "function") {
    console.error("cannot unregister a handler that's not a function", handler)
    return
  }

  const idx = handlers.indexOf(handler)
  if (idx !== -1) {
    handlers.splice(idx, 1)
  } else {
    console.warn("handler not removed (was not found registered)..")
  }
}

const handleAction = (action: { type: string }): HandledResult => {
  const result = {
    handled: false,
    handlers: 0,
    errors: []
  } as HandledResult

  handlers.forEach(handler => {
    try {
      result.handlers++
      result.handled = result.handled || handler(action)
    } catch (error) {
      result.errors.push(error)
    }
  })

  return result
}

// for different versions of redux router.  Should make this an option somehow or remove.
let skipActions = new Set(["LOCATION_CHANGE", "@@router/LOCATION_CHANGE"])

export default (store: any) => (next: any) => (action: any) => {
  // intercept all actions and pass-through.
  if (!skipActions.has(action.type)) {
    const handledResult = handleAction(action)

    if (handledResult.errors.length === 0) {
      // console.log(`babylonJS type: ${action.type} handled: ${handledResult.handled} w/o errors by ${handledResult.handlers}`)
    } else {
      handledResult.errors.forEach(error => {
        console.error(`error occured in redux-wiretap middleware with type ${action.type}`, error)
      })
    }

    // TODO: add possibly failure or # handlers.  possibly error if there are no handlers when we add filtering...
    action.handled = handledResult.handled
  }
  return next(action)
}

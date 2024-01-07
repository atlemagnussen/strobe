import { BehaviorSubject } from "rxjs"

export interface ImmersiveVrSupport {
    enabled: boolean
    message: string
    sessionStarted?: boolean
}

const isImmersiveVrSupportedSubject = new BehaviorSubject<ImmersiveVrSupport>({ enabled: false, message: "Initializing..." })
export const isImmersiveVrSupported = isImmersiveVrSupportedSubject.asObservable()

if ('xr' in navigator ) {
    navigator.xr?.isSessionSupported("immersive-vr").then((supported) => {
        let nextVal: ImmersiveVrSupport = {enabled: true, message: "yey!"}

        if (!supported)
            nextVal = {enabled: false, message: "VR NOT ALLOWED"}

        isImmersiveVrSupportedSubject.next(nextVal)

    }).catch(err => {
        console.error(err)
        setNotSupported()
    })
}
else
    setNotSupported()

function setNotSupported() {
    isImmersiveVrSupportedSubject.next({enabled: false, message: "VR NOT SUPPORTED"})
}

function setSessionStartedState(started: boolean) {
    const nextVal = isImmersiveVrSupportedSubject.value
    nextVal.sessionStarted = started
    isImmersiveVrSupportedSubject.next(nextVal)
}

let currentSession: XRSession | null | undefined = null


// function offerSession() {
//     if (navigator.xr?.offerSession) {

//         navigator.xr?.offerSession( 'immersive-vr', sessionInit )
//             .then( onSessionStarted )
//             .catch((err: any) => {

//                 console.warn(err)

//             })

//     }
// }

function onSessionEnded( /*event*/ ) {
    currentSession?.removeEventListener('end', onSessionEnded)
    setSessionStartedState(false)
    currentSession = null;
}
const sessionInit: XRSessionInit = { optionalFeatures: [ 'local-floor', 'bounded-floor', 'hand-tracking', 'layers' ] }

export async function startSession(mode: XRSessionMode) {
    const session = await navigator.xr?.requestSession(mode, sessionInit)
    session?.addEventListener('end', onSessionEnded )

    currentSession = session
    setSessionStartedState(true)
    return session
}

export function endSession() {
    currentSession?.end()
}

// function registerSessionGrantedListener() {

//     if ( typeof navigator !== 'undefined' && 'xr' in navigator ) {

//         // WebXRViewer (based on Firefox) has a bug where addEventListener
//         // throws a silent exception and aborts execution entirely.
//         if ( /WebXRViewer\//i.test( navigator.userAgent ) ) return;

//         navigator.xr?.addEventListener( 'sessiongranted', () => {  

//         })
//     }
// }
// registerSessionGrantedListener()
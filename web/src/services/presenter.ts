import { BehaviorSubject } from "rxjs"

const presenterSubject = new BehaviorSubject("msg")
export const presenterMsg = presenterSubject.asObservable()

const addConnection = (connection: PresentationConnection) => {
    connection.onmessage = (message: any) => {
        if (message && message.data)
            presenterSubject.next(message.data)
        if (message.data === "Say hello")
            connection.send("hello")
    }
    connection.onclose = () => {
        presenterSubject.next("close")
        connection.close()
    }
}

export function initiatePresenter() {
    ///@ts-ignore
    navigator.presentation.receiver.connectionList.then((list) => {
        list.connections.forEach((connection: any) => {
        addConnection(connection)
        })
        list.onconnectionavailable = (evt: any) => {
            addConnection(evt.connection)
        }
    })
}

  
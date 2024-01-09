interface PresentationAvailability {
    value: boolean
    onchange: () => void
}

type PresentationConnectionState = "closed" | "open" | "connecting" | "connected"

interface PresentationMessage {
    data: any
}

interface PresentationConnection {
    binaryType: string
    id: string
    state: PresentationConnectionState
    onconnect: () => void
    onclosed?: () => void
    onclose?: () => void
    onterminate: () => void
    close: () => void
    onmessage: (msg: PresentationMessage) => void
    send: (msg: string) => void
}
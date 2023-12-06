export interface Screens {
    index: undefined
    history: undefined
    login: undefined
    chatView: {}
    addCredits: undefined
    profile: undefined
    TripInfo: {}
    messages: undefined
    TripCardRedirect: {}
    BookRequest: {}
}

export declare global {
    namespace ReactNavigation {
        interface RootParamList extends Screens { }
    }
}
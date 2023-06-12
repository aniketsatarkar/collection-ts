export {}

declare global {
    type TodoItem = {
        completed: boolean
        id: number
        title: string
        userId: number
    }
}

import fetch from 'node-fetch';

export default {
    async getList (): Promise<TodoItem[]> {
        let  res: TodoItem[] = []

        await fetch('https://jsonplaceholder.typicode.com/todos')
            .then(response => response.json())
            .then(json => res = json as TodoItem[])

        return res
    },

    async get(id: number | string): Promise<TodoItem> {
        let res: TodoItem | null = null

        await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
            .then(response => response.json())
            .then(json => res = json as TodoItem)

        return res
    },

    create(item: TodoItem): TodoItem | null {
        let res: TodoItem | null = null
        
        fetch(`https://jsonplaceholder.typicode.com/todos`, {
            method: 'POST',
            body: item as any
        })
            .then(response => response.json())
            .then(json => res = json as TodoItem)

        return res
    },

    delete(id: number | string): boolean | null {
        let res: boolean | null = null

        fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(json => res = !!(json))
        
        return res
    }
}

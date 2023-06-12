import todoApi from './api'

class BaseCollection<T> {
    items: Map<number | string, T>
    hashKey: string = ''

    beforeAdd: (item: T) => {} = null
    afterAdd: (item: T) => {} = null

    find (id: number | string): T | boolean {
        const item = this.items[id]
        return item ? item : false
    }

    add (item: T | T[], key: string = this.hashKey): T | T[] {
        if (Array.isArray(item)) {
            this.triggerEvent('beforeAdd', item)
            item.forEach(i => { this.items.set(i[this.hashKey], i) })
            this.triggerEvent('afterAdd', item)
            return item
        } else {
            this.triggerEvent('beforeAdd', item)
            this.items[key] = item
            this.triggerEvent('afterAdd', item)
        }
    }

    update (item: T, id: number | string = this.hashKey): T {
        if (!this.items[id]) {
            throw new Error(`item ${id} does not exist`)
        }

        return this.items[id] = item
    }

    updateValue (id: number | string, property: string, value: any) : T {
        if (!this.items[id])
            throw new Error(`Hash key ${id} does not exist`)

        if (!this.items[id][property])
            throw new Error('Property ${property} does not exist on type T')

        this.items[id][property] = value
        return this.items[id]
    }

    remove (id: string): boolean {
        if (!this.items[id])
            throw new Error(`Hash key ${id} does not exist`)

        return delete this.items[id]
    }

    setItems (itemArray: T[], key: string = this.hashKey) {
        this.items = new Map(itemArray.map(item => [item[key], item]))
    }

    sort (property: string, order: number = 1): T[] {
        const items = Object.values(this.items)

        return items.sort((a: T, b: T) => {
            if (a[property] < b[property]) {
                return (1 * order)
            } else if (a[property] > b[property]) {
                return (-1 * order)
            } else if (a[property] === b[property]) {
                return 0
            }
        })
    }

    setEvent(event: string, handler: () => {}) {
        this[event] = handler
    }

    triggerEvent (event: string, params: any): boolean {
        if (this[event]) {
            return this[event](params)
        } else {
            return true
        }
    }
}

class TodoCollection extends BaseCollection<TodoItem> {
    hashKey: string = 'id'

    async getList () {
        this.setItems(await todoApi.getList(), 'id')
        return this.items
    }

    delete (id: number | string): boolean {
        return todoApi.delete(id)
    }

    create (data: TodoItem): TodoItem {
        return todoApi.create(data)
    }
}

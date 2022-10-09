import { writable, get } from "svelte/store"
import { Writable, Readable } from "svelte/types/runtime/store"
import { axios } from "@core/axios"

const allRecords: {[key: string]: RecordStore} = {}
interface Dataset extends Readable<RecordStore[]> {
    add: (record: Record) => void,
    remove: (record: Record) => void,
}
const datasets: {[key: string]: Dataset} = {}

interface Record {
    _id: string
    [key: string]: any
}

interface RecordStore extends Writable<{}> {
    _id: string
    type: string
}

export const cacheRecord = (record: Record, type: string) => {
    const recordKey = `${type}_${record._id}`

    let _record = allRecords[recordKey]

    if (!_record) {
        _record = initRecord(record, type)
    }

    _record.set(record)

    return _record
}

export const deleteRecord = (record: Record, type: string) => {
    const recordKey = `${type}_${record._id}`

    delete allRecords[recordKey]

    const ds = getDataset(type)

    ds.remove(record)
}

const initRecord = (record: Record, type: string) => {
    const recordKey = `${type}_${record._id}`

    const {set, subscribe, update} = writable(record)

    const _record: RecordStore = {
        set,
        subscribe,
        update,
        type,
        _id: record._id
    }

    allRecords[recordKey] = _record

    let ds = getDataset(type)

    ds.add(_record)

    return _record
}

const getDataset = (type: string): Dataset => {
    if (!datasets[type]) {
        const { update, subscribe } = writable([])

        const add = (record: Record) => {
            update(recs => [...recs, record])
        }

        const remove = (record: Record) => {
            update(recs => recs.filter(rec => rec._id != record._id))
        }

        datasets[type] = {
            add,
            remove,
            subscribe
        }
    }

    return datasets[type]
}

export class DataInstance  {
    type: string
    dataset: Dataset

    _records: Writable<RecordStore[]>
    _filters: Writable<{[key: string]: Filter}>
    _sorts: Writable<Sorts>

    constructor(type: string) {
        this.type = type
        this.dataset = getDataset(type)

        this._records = writable([])
        this._filters = writable({})
        this._sorts = writable({createdAt: -1})

        let filteredRefs = []
        let sortedRefs = []

        const filterRecords = (filterSet: {}) => {
            let records: RecordStore[] = get(this.dataset)

            let filters: Filter[] = Object.values(filterSet)

            filteredRefs = []
            records.forEach((_rec, i) => {
                if (filters.every(filter => recordPassesFilter(_rec, filter))) filteredRefs.push(i)
            })
            // filteredRefs = records.map((_rec, i): [RecordStore, number] => [_rec, i]).filter(([_rec]) => filters.every(filter => recordPassesFilter(_rec, filter)))
            
            compileRecords()
        }

        const sortRecords = (sorts: Sorts) => {
            let records = get(this.dataset)

            const sortsArr = Object.entries(sorts)

            sortedRefs = Array.from({length: records.length}).map((x, i) => i).sort((indexA,indexB) => {
                console.log(indexA, indexB, records)
                let recordA = get(records[indexA])
                let recordB = get(records[indexB])

                for (let [field, dir] of sortsArr) {
                    let valueA = recordA[field]
                    let valueB = recordB[field]

                    console.log(field, recordA, recordB, valueA, valueB, valueA > valueB)
                    if (valueA == valueB) continue

                    return valueA > valueB ? dir : -dir
                }

                return 0
            })

            compileRecords()
        }

        const compileRecords = () => {
            let allRecords = get(this.dataset)

            let newRecords = []

            filteredRefs.forEach(i => newRecords[sortedRefs[i]] = allRecords[i])
            // let records = Object.values(filteredRefs.map(index => sortedRefs[index])).map(index => allRecords[index])

            // console.log(filteredRefs.map(i => get(allRecords[i])), sortedRefs, allRecords, records)

            this._records.set(Object.values(newRecords))
        }

        this._filters.subscribe(filterRecords)
        this._sorts.subscribe(sortRecords)
        this.dataset.subscribe((records: RecordStore[]) => {
            filterRecords(get(this._filters))
            sortRecords(get(this._sorts))
        })
    }

    async fetch() {
        return new Promise((res, rej) => {
            axios.get(`/app/${this.type}`).then(({data}) => {
                res(data.map((record: Record) => cacheRecord(record, this.type)))
            })
        })
    }
}

interface Sorts {
    [key: string]: 1 | -1
}

interface Filter {
    field: string
    op: "eq" | "co"
    value: string
}

const recordPassesFilter = (record: RecordStore, filter: Filter) => {
    let recordValue = get(record)[filter.field]
    console.log(recordValue, filter)

    if (typeof recordValue !== "string") return true

    if (filter.op == "eq") {
        return recordValue == filter.value
    } else {
        return recordValue.includes(filter.value)
    }
}
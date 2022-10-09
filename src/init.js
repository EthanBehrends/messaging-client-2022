import _ from 'lodash'
import "./core/wsock"

// Set globals
window.formatValue = formatValue
window.identity = val => val

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)
window.dayjs = dayjs




function formatValue (value, format, {strict = true, options = {}} = {}) {
    let formatter = formatters[format]

    if (!formatter) {
        console.warn("No formatter registered for " + format)
        return value
    }

    if (typeof formatter == 'object') {
        formatter = formatter[strict ? 'strict' : 'partial']
    }

    return formatter(value)
}

const formatters = {
    time: (val) => {},
    percent: {
        partial: (val) => {},
        strict: (val) => {}
    },
    money: formatMoney
}

function formatMoney (val, {currency = 'USD', showCurrency = true, useDecimals = true, useCommas = true} = {}) {
    val = val.replace(/[\D]/g, "").replace(/^0*/,"")

    if (useDecimals) {
        const decimals = 2
        let first = val.slice(0, -decimals) || '0'
        let second = val.slice(-decimals)
        if (second.length < decimals) {
            second = Array.from(Array(decimals - second.length)).map(()=>'0').join('') + second
        }
        val = first + '.' + second
    }

    if (useCommas) {
        let [a, b] = val.split('.')
        a = a.split('').map((l,i) => l + ((a.length - i - 1) % 3 == 0 && a.length - i - 1 != 0 ? ',' : '')).join('')
        val = a + '.' + b
    }

    let prefix = showCurrency ? '$' : ''

    return prefix + val
}
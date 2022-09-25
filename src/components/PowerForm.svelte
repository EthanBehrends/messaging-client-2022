<script context="module">
	//

	export const powerFormValue = (node, _value) => {
		let unsubscribe
		let _valueStore
		let subscribed = false

		node.setAttribute('power-form-value', '')
		node.setAttribute('use-raw-value', '')

		const update = _value => {
			if (unsubscribe) unsubscribe()
			if (!_value.subscribe) throw 'Argument must be a store with a subscribe method'

			_valueStore = _value

			unsubscribe = _valueStore.subscribe(val => {
				if (!subscribed) return

				if (_.isEqual(node.rawValue, val)) return

				node.rawValue = val
				node.dispatchEvent(new Event('change', { bubbles: true }))
			})
		}

		const onValueUpdate = () => {
			let newValue = node.rawValue
			_value.set(newValue)
		}

		node.addEventListener('powerformupdate', onValueUpdate)
		update(_value)
		subscribed = true

		const destroy = () => {
			node.removeEventListener('powerformupdate', onValueUpdate)
			if (unsubscribe) unsubscribe()
		}

		return { update, destroy }
	}

	const isDebug = element => {
		return element.hasAttribute('power-form-debug')
	}
</script>

<script>
	import _ from 'lodash'
	import { writable, get } from 'svelte/store'
	import { onMount } from 'svelte'
	import { domInitialize } from '@utils/globals'

	export let disabled = false
	export let _record = writable({})
	export let liveValidate = true
	export let formatters = {}

	export let simple = false
	export let underlined = false
	export let solid = false
	export let transparent = false

	let form
	const inputDomSelector = 'input, textarea, div[power-form-value]'

	const onInput = e => {
		let element = e.target
		if (!isPowerFormInput(element)) return

		parseValue(element, false, { debug: isDebug(element) })
	}

	const onChange = e => {
		let element = e.target
		if (!isPowerFormInput(element)) return

		element.__validationNeeded = true
		parseValue(element, true, { debug: isDebug(element) })
	}

	const isPowerFormInput = element => {
		if (getInputParentForm(element) != form) return false

		if (!element.matches(inputDomSelector)) return false

		if (element.hasAttribute('power-form-ignore')) return false

		if (element['power-form-ignore-cache'] == undefined) {
			let pathArray = getElementPath(element)

			let ignore = !!pathArray.find(element => element.hasAttribute('power-form-ignore'))

			element['power-form-ignore-cache'] = ignore
		}

		if (element['power-form-ignore-cache'] === true) return false

		if (element.classList.contains('power-form-ignore')) return false //todo remove

		return true
	}

	const getInputParentForm = element => {
		if (element.form) return element.form

		let parentElement = element.parentElement

		while (parentElement && !parentElement.hasAttribute('power-form')) {
			parentElement = parentElement.parentElement
		}

		return parentElement
	}

	const inputUsesRawValue = element => {
		return element.hasAttribute('use-raw-value')
	}

	const getValue = element => {
		if (inputUsesRawValue(element)) {
			return element.rawValue
		} else {
			return element.value
		}
	}

	const getInputType = element => {
		return element.getAttribute('type')?.toLowerCase()
	}

	const parseValue = (element, isChangeEvent, { debug = false } = {}) => {
		let value = getValue(element)
		let type = getInputType(element)

		if (type == 'radio') {
			value = parseRadioValue(element)
		} else if (type == 'checkbox') {
			value = parseCheckboxValue(element)
		}

		const required = element.hasAttribute("required")

		let options = { strict: isChangeEvent, element, debug, required }

		let formatStr = element.getAttribute('format')

		if (formatStr) {
			options.userTypedInputValue = value
			value = stripValue(value, formatStr, options)
		}

		updateStore(element, value, options)
	}

	const parseRadioValue = element => {
		let form = getInputParentForm(element)
		let path = getFieldPath(element)

		let inputs = Array.from(form.querySelectorAll(`[type=radio][name=${element.getAttribute('name')}]`)).filter(element => {
			return getFieldPath(element) === path
		})

		let checkedInput = inputs.find(input => input.checked)

		if (!checkedInput) return undefined

		return getValue(checkedInput)
	}

	const setRadioValue = (element, value) => {
		let form = getInputParentForm(element)
		let path = getFieldPath(element)

		let inputs = Array.from(form.querySelectorAll(`[type=radio][name=${element.getAttribute('name')}]`)).filter(element => {
			return getFieldPath(element) === path
		})

		let valueInput = inputs.find(input => {
			input.checked = false
			return input.value == value
		})

		if (!valueInput) return undefined

		valueInput.checked = true
	}

	const parseCheckboxValue = element => {
		let form = getInputParentForm(element)
		let path = getFieldPath(element)

		let inputs = Array.from(form.querySelectorAll(`[type=checkbox][name=${element.getAttribute('name')}]`)).filter(element => {
			return getFieldPath(element) === path
		})

		let checkedInputs = inputs.filter(input => input.checked)

		let inputValues = checkedInputs.map(element => getValue(element))

		if (inputs.length == 1) inputValues = inputValues[0]

		return inputValues
	}

	const setCheckboxValue = (element, value) => {
		let form = getInputParentForm(element)
		let path = getFieldPath(element)

		let inputs = Array.from(form.querySelectorAll(`[type=checkbox][name=${element.getAttribute('name')}]`)).filter(element => {
			return getFieldPath(element) === path
		})

		if (!Array.isArray(value)) value = [value]

		inputs.forEach(input => {
			let inputValue = getValue(input)			
            input.checked = value.find(val => val == getValue(input))
		})
	}

	const stripValue = (value, format, options) => {
		let formatter = getFormatter(format)

		let strippedValue

		if (formatter.strip) {
			strippedValue = formatter.strip(value, options)
		} else {
			strippedValue = value
		}

		return strippedValue
	}
	const formatValue = (value, format, options) => {
		let formatter = getFormatter(format)

		let formattedValue

		if (formatter.format) {
			formattedValue = formatter.format(value, options)
		} else {
			formattedValue = value
		}

		return formattedValue
	}

	const getFormatter = formatString => {
		return formatters[formatString] ?? generateRegExFormatter(formatString)
	}

	const generateRegExFormatter = formatString => {
		const regex = new RegExp(formatString)

		return {
			validate: value => {
				if (regex.test(value)) return true
				else return { errorMessage: 'Invalid format' }
			},
		}
	}

	const updateStore = (element, value, options) => {
		let path = getFieldPath(element)

		let record = get(_record)

		let currentValue = _.get(record, path)

		// if (currentValue === value) {
		//     return
		// }

		_.set(record, path, value)
		updateField(element, record, options)

		let newRecord = Array.isArray(record) ? [...record] : { ...record }

		_record.set(newRecord)
	}

	const onRecordUpdate = record => {
		let elementUpdated

		updateFields({ record, strict: true, filter: element => element !== elementUpdated })
	}

	const updateFields = (options = {}) => {
		let record = options.record || get(_record)

		let elements = getInputElements()
		if (options.filter) elements = elements.filter(options.filter)

		elements.forEach(element => updateField(element, record, options))
	}

	const updateField = (element, record, options = {}) => {
		let path = getFieldPath(element)
        let value = _.get(record, path)

		let formatStr = element.getAttribute('format')
		let afterUpdate = () => {}
		let doNotSetValue = false

		if (formatStr) {
			let formatResp = formatValue(value, formatStr, { strict: false, element, ...options })

			if (typeof formatResp == 'object') {
				;({ value, doNotSetValue, afterUpdate } = formatResp)
				// doNotSetValue = !!formatResp[1].doNotSetValue
			} else {
				value = formatResp
			}
		}

		if (!doNotSetValue) setInputValue(element, value)

		if (options.init) element['power-form-init'] = true

		afterUpdate?.()

		if (liveValidate && element.__validationNeeded) {
			validateField(element)
		}
	}

	const initField = element => {
		if (!isPowerFormInput(element)) return

		let record = get(_record)

		updateField(element, record, { init: true })
	}

	const setInputValue = (element, value) => {
		let type = getInputType(element)

		if (type == 'radio') {
			setRadioValue(element, value)
		} else if (type == 'checkbox') {
			setCheckboxValue(element, value)
		} else if (inputUsesRawValue(element)) {
			element.rawValue = value
		} else {
			if (value === undefined) value = ''

			element.value = value
		}

		element.dispatchEvent(new Event("input", { bubbles: false }))
		element.dispatchEvent(new Event('powerformupdate', { bubbles: true }))
	}

	const getInputElements = () => {
		return Array.from(form.querySelectorAll(inputDomSelector)).filter(isPowerFormInput)
	}

	const getFieldPath = element => {
		if (element.hasAttribute('path')) {
			return element.getAttribute('path')
		}

		let pathArray = getElementPath(element)

		let fields = pathArray.map(element => element.getAttribute('field')).filter(x => !!x)

		fields.push(element.getAttribute('name'))

		let path = fields.join('.')

		element.setAttribute('path', path)

		return path
	}

	const getElementPath = element => {
		let path = [element]

		let parentElement = element.parentElement
		while (parentElement && !parentElement.hasAttribute('power-form')) {
			path.unshift(parentElement)
			parentElement = parentElement.parentElement
		}

		return path
	}

	// const submit = () => {

	// }

	export const validate = ({ scrollToError = true } = {}) => {
		let elements = getInputElements()

		let validationResults = elements.map(element => {
			let result = validateField(element)
			return { element, result }
		})

		let errors = validationResults.filter(({ result }) => result !== true)

		if (errors.length == 0) return true

		if (scrollToError) {
			errors[0].element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}

		return false
	}

	const validateField = (element, display = true) => {
		let result = fieldIsValid(element)
		let isValid = result === true

		if (display) element.__validationNeeded = true

		if (isValid) clearError(element)
		else setError(element, result)

		return result
	}

	const clearError = element => {
		if (element.clearError) {
			element.clearError()
		} else {
			element.classList.remove('error')
			removeErrorMessageField(element)
		}
	}
	const setError = (element, error) => {
		if (element.handleError) {
			element.handleError(error)
		} else {
			element.classList.add('error')
			if (error.errorMessage && !element.hasAttribute('no-error-text')) {
				setErrorMessage(element, error.errorMessage)
			}
		}
	}

	const setErrorMessage = (element, message) => {
		let existingErrorElements
		if (element.errorElement) {
			existingErrorElements = [element.errorElement]
		} else {
			existingErrorElements = Array.from(element.parentElement.querySelectorAll(`[power-form-error='${getFieldPath(element)}']`))
		}

		if (existingErrorElements.length) {
			existingErrorElements.forEach((element, i) => {
				if (i > 0) element.remove()
			})

			existingErrorElements[0].innerText = message
		} else {
			addErrorMessageField(element, message)
		}
	}

	const addErrorMessageField = (element, message) => {
		let errorElement = document.createElement('div')
		errorElement.appendChild(document.createTextNode(message))

		errorElement.setAttribute('power-form-error', getFieldPath(element))

		element.insertAdjacentElement('afterEnd', errorElement)
		element.errorElement = errorElement
	}

	const removeErrorMessageField = element => {
		let errorElements

		if (element.errorElement) {
			errorElements = [element.errorElement]
		} else {
			errorElements = Array.from(element.parentElement.querySelectorAll(`[power-form-error='${getFieldPath(element)}']`))
		}

		if (!errorElements.length) return

		errorElements.forEach(element => element.remove())
		delete element.errorElement
	}

	const fieldIsValid = element => {
		let value = getValue(element)
		let required = element.hasAttribute('required')

		if (required && (value === '' || value === undefined)) return { errorMessage: 'This field is required' }

		let formatStr = element.getAttribute('format')

		if (formatStr) {
			let formatter = getFormatter(formatStr)

			if (formatter.validate) {
				return formatter.validate(value, { element })
			}
		}

		return true
	}

	let destroyMutationObserver
	$: if (form) {
		destroyMutationObserver?.()
		destroyMutationObserver = domInitialize(inputDomSelector, initField, form)
	}

	onMount(() => {
		let recordUnsubscribe = _record.subscribe(onRecordUpdate)

		return () => {
			recordUnsubscribe()
			destroyMutationObserver?.()
		}
	})

	export const _formState = {}
</script>

<form bind:this={form} {disabled} power-form class="power-form solid" style="display: contents" on:input={onInput} on:change={onChange} on:submit on:validate>
	<div class="contents" class:simple class:underlined class:solid class:transparent>
		<slot {validate} />
	</div>
</form>

<style>
	:global(.power-form [power-form-error]) {
		font-size: 0.75rem;
		color: #b36161;
		height: 1rem;
		margin-bottom: -1rem;
		width: min-content;
		white-space: nowrap;
		animation: errorIn 0.2s linear forwards;
	}

	@keyframes errorIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
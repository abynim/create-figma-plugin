/** @jsx h */
import { h } from 'preact'
import { useCallback, useRef } from 'preact/hooks'
import { ESCAPE_KEY_CODE } from '../../utilities/key-codes'
import { searchIcon } from '../../icons/search-icon'
import { crossIcon } from '../../icons/cross-icon'
import '../../scss/base.scss'
import styles from './search-textbox.scss'

export function SearchTextbox ({
  focused: isFocused,
  name,
  onChange,
  placeholder,
  propagateEscapeKeyDown = true,
  clearOnEscapeKeyDown = true,
  value,
  ...rest
}) {
  const inputElementRef = useRef(null)

  function handleFocus () {
    inputElementRef.current.select()
  }

  const handleInput = useCallback(
    function () {
      onChange({ [name]: inputElementRef.current.value })
    },
    [name, onChange]
  )

  const handleKeyDown = useCallback(
    function (event) {
      const keyCode = event.keyCode
      if (keyCode === ESCAPE_KEY_CODE) {
        if (clearOnEscapeKeyDown === true && value !== '' && value !== null) {
          onChange({ [name]: '' })
          event.stopPropagation()
          return
        }
        if (propagateEscapeKeyDown === false) {
          event.stopPropagation()
        }
        inputElementRef.current.blur()
      }
    },
    [clearOnEscapeKeyDown, name, onChange, propagateEscapeKeyDown, value]
  )

  const handleClearClick = useCallback(
    function () {
      onChange({ [name]: '' })
      inputElementRef.current.focus()
    },
    [name, onChange]
  )

  return (
    <div class={styles.searchTextbox}>
      <input
        {...rest}
        ref={inputElementRef}
        type='text'
        name={name}
        class={styles.input}
        placeholder={placeholder}
        value={value === null ? '' : value}
        onFocus={handleFocus}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        tabIndex='0'
        data-initial-focus={isFocused === true}
      />
      <div class={styles.searchIcon}>{searchIcon}</div>
      {value === null || value === '' ? null : (
        <div class={styles.clear} onClick={handleClearClick} tabIndex='0'>
          {crossIcon}
        </div>
      )}
    </div>
  )
}

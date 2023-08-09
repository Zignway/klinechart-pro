import { Component, For, createEffect, createSignal } from "solid-js"
import { DeepPartial, Styles, utils } from '@numlemon/klinecharts'

import { SelectDataSourceItem } from "../../components";
import lodashSet from 'lodash/set'

export interface TimeframesProps {
  currentStyles: DeepPartial<Styles>
  onChange: (style: DeepPartial<Styles>) => void
}

const Candles: Component<TimeframesProps> = props => {
  const [styles, setStyles] = createSignal(props.currentStyles)

  const update = (option: SelectDataSourceItem, newValue: any) => {
    const style = {}
    lodashSet(style, option.key, newValue)
    const ss = utils.clone(styles())
    lodashSet(ss, option.key, newValue)
    setStyles({ ...ss })
    props.onChange(style)
  }

  const optionCandles = {
    key: 'candle.type',
    text: 'candle_type',
    component: 'select',
    dataSource: [
      { key: 'candle_solid', text: 'candle_solid' },
      { key: 'candle_stroke', text: 'candle_stroke' },
      { key: 'candle_up_stroke', text: 'candle_up_stroke' },
      { key: 'candle_down_stroke', text: 'candle_down_stroke' },
      { key: 'ohlc', text: 'ohlc' },
      { key: 'area', text: 'area' }
    ]
  }

  createEffect(() => {
    setStyles(props.currentStyles)
  })

  const candles = [
    {
      key: 'candle_solid',
      icon: <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28"
        width="18" height="18"
        fill="currentColor">
        <path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"></path>
        <path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z"></path>
        <path d="M9 8v12h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5z"></path>
        <path d="M10 4h1v3.5h-1zm0 16.5h1V24h-1z"></path>
      </svg>
    },
    {
      key: 'candle_stroke',
      icon: <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28"
        width="18" height="18"
        fill="currentColor">
        <path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z">
        </path>
        <path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z"></path>
        <path d="M9 8v11h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-12a.5.5 0 0 1 .5-.5z"></path>
        <path d="M10 4h1v5h-1zm0 14h1v5h-1zM8.5 9H10v1H8.5zM11 9h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11z">
        </path>
      </svg>
    },
    {
      key: 'ohlc',
      icon: <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28"
        width="18" height="18">
        <g fill="none" stroke="currentColor" stroke-linecap="square">
          <path d="M10.5 7.5v15M7.5 20.5H10M13.5 11.5H11M19.5 6.5v15M16.5 9.5H19M22.5 16.5H20">
          </path>
        </g>
      </svg>
    },
    {
      key: 'area',
      icon: <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28"
        width="18" height="18">
        <path fill="currentColor"
          fill-rule="evenodd"
          d="m25.35 5.35-9.5 9.5-.35.36-.35-.36-4.65-4.64-8.15 8.14-.7-.7 8.5-8.5.35-.36.35.36 4.65 4.64 9.15-9.14.7.7ZM2 21h1v1H2v-1Zm2-1H3v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1V9h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1H8v1H7v1H6v1H5v1H4v1Zm1 0v1H4v-1h1Zm1 0H5v-1h1v1Zm1 0v1H6v-1h1Zm0-1H6v-1h1v1Zm1 0H7v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1H8v1H7v1h1v1Zm1 0v1H8v-1h1Zm0-1H8v-1h1v1Zm1 0H9v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1h1v1Zm1 0v1h-1v-1h1Zm0-1v-1h-1v1h1Zm0 0v1h1v1h1v-1h-1v-1h-1Zm6 2v-1h1v1h-1Zm2 0v1h-1v-1h1Zm0-1h-1v-1h1v1Zm1 0h-1v1h1v1h1v-1h1v1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h1v1Zm1 0h-1v1h1v-1Zm0-1h1v1h-1v-1Zm0-1h1v-1h-1v1Zm0 0v1h-1v-1h1Zm-4 3v1h-1v-1h1Z"></path>
      </svg>
    }
  ]


  return (
    <>
      <div class="condles-content">
        <For each={candles}>
          {
            data => {
              return (
                <div
                  onClick={() => {
                    update(optionCandles, data.key)
                  }}
                  class={`candles-icon ${styles().candle?.type === data.key ? 'btn-dropdown-active' : ''}`}
                >
                  {data.icon}
                </div>
              )
            }
          }
        </For>
      </div>
      <div class="border-right" />
    </>

  )
}

export {
  Candles
}

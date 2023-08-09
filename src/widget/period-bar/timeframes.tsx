// import { Button } from "../../components/ui/button";
import { Component, For, createEffect, createSignal, onMount } from "solid-js"

import { Button } from "../../components";
import { Period } from "../../types";

// import { Separator } from "../../components/ui/separator";

export interface TimeframesProps {
  period: Period;
  periods: Period[];
  onPeriodChange: (period: Period) => void;
}

const Timeframes: Component<TimeframesProps> = props => {
  const [firstPeriod, setFirstPeriod] = createSignal(props.periods.slice(0, 2))
  const [secondPeriod, setSecondPeriod] = createSignal(props.periods.slice(2))
  const [isSelectDropdown, setIsSelectDropdown] = createSignal(false)
  onMount(() => {
    if (secondPeriod().some(e => e.text === props.period.text)) {
      setIsSelectDropdown(true)
      return
    }
    setIsSelectDropdown(false)
  })

  createEffect(() => {
    if (secondPeriod().some(e => e.text === props.period.text)) {
      setIsSelectDropdown(true)
      return
    }
    setIsSelectDropdown(false)
  });

  return (
    <>
      <div class="btn-content">
        <For each={firstPeriod()}>
          {
            data => {
              return (
                <div
                  onClick={() => props.onPeriodChange(data)}
                  class={`btn-dropdown ${props.period.text === data.text ? 'btn-dropdown-active' : ''}`}>
                  {data.text}
                </div>
              )
            }
          }
        </For>
      </div>
      {
        secondPeriod().length > 0 && <div class="dropdown">
          <div class={`btn-dropdown-tigger ${isSelectDropdown() ? 'btn-dropdown-active' : ''}`}>
            {
              isSelectDropdown()
                ? props.period.text
                : secondPeriod()[0].text
            }
            <svg viewBox="0 0 256 256" >
              <g transform="translate(2 2) scale(2.81 2.81)" >
                <path d="M 90 24.25 c 0 -0.896 -0.342 -1.792 -1.025 -2.475 c -1.366 -1.367 -3.583 -1.367 -4.949 0 L 45 60.8 L 5.975 21.775 c -1.367 -1.367 -3.583 -1.367 -4.95 0 c -1.366 1.367 -1.366 3.583 0 4.95 l 41.5 41.5 c 1.366 1.367 3.583 1.367 4.949 0 l 41.5 -41.5 C 89.658 26.042 90 25.146 90 24.25 z" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
              </g>
            </svg>
          </div>
          <div class="dropdown-content">
            <div class="dropdown-card">
              <For each={secondPeriod()}>
                {
                  data => {
                    return (
                      <div
                        onClick={() => props.onPeriodChange(data)}
                        class={`btn-dropdown ${props.period.text === data.text ? 'btn-dropdown-active' : ''}`}
                      >
                        {data.text}
                      </div>
                    )
                  }
                }
              </For>
            </div>
          </div>
        </div>
      }
      <div class="border-right" />
    </>

  )
}

export {
  Timeframes
}

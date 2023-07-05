import { Button } from "../../components";
// import { Button } from "../../components/ui/button";
import { Component } from "solid-js"
import { Period } from "../../types";
// import { Separator } from "../../components/ui/separator";

export interface TimeframesProps {
  period: Period;
  periods: Period[];
  onPeriodChange: (period: Period) => void;
}

const Timeframes: Component<TimeframesProps> = props => {
  return (
    <>
      <div
        style={{ width: '40px', height: '40px', "z-index": 99 }}>
        {/* <ul class="menu"> */}
        <li class="dropdown dropdown-6">
          {props.period.text}
          <div>
            <ul class="dropdown_menu dropdown_menu--animated dropdown_menu-6">
              {/* <li class="dropdown_item-1">Item 1</li>
              <li class="dropdown_item-2">Item 2</li>
              <li class="dropdown_item-3">Item 3</li>
              <li class="dropdown_item-4">Item 4</li>
              <li class="dropdown_item-5">Item 5</li> */}
              {
                props.periods.map(p => <button
                  onClick={() => {
                    props.onPeriodChange(p)
                  }}
                  // class="periods-button hover:text-white hover:bg-black/30 p-1 m-1 w-[40px] rounded-lg hover:cursor-pointer"
                >
                  {p.text}
                </button>
                )
              }
            </ul>
          </div>
        </li>
        {/* </ul> */}
        {/* <div
          style={{ width: '100%', height: '100%', display: 'flex' }}
          class="peer hover-text">
          <div style={{ margin: 'auto' }}>
            {props.period.text}
          </div>
        </div>
        <div id="timeframes-content" class="periods-card">
          {
            props.periods.map(p => <button
              onClick={() => {
                props.onPeriodChange(p)
              }}
              class="periods-button hover:text-white hover:bg-black/30 p-1 m-1 w-[40px] rounded-lg hover:cursor-pointer"
            >
              {p.text}
            </button>
            )
          }
        </div> */}
      </div>
      <div style={{ width: '1px', height: '100%' }} class="border-r"></div>
      {/* <Separator orientation="vertical" /> */}
    </>

  )
}

export {
  Timeframes
}

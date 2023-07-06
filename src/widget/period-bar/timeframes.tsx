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
        <li class="dropdown dropdown-6">
          {props.period.text}
          <ul class="dropdown_menu dropdown_menu--animated dropdown_menu-6">
            <div>
              {
                props.periods.map(p => <button
                  onClick={() => {
                    props.onPeriodChange(p)
                  }}
                >
                  {p.text}
                </button>
                )
              }
            </div>
          </ul>
        </li>
      </div>
      <div style={{ width: '1px', height: '100%' }} class="border-r"></div>
    </>

  )
}

export {
  Timeframes
}

import { Button } from "../../components/ui/button";
import { Component } from "solid-js"
import { Period } from "../../types";
import { Separator } from "../../components/ui/separator";

export interface TimeframesProps {
  period: Period;
  periods: Period[];
  onPeriodChange: (period: Period) => void;
}

const Timeframes: Component<TimeframesProps> = props => {
  return (
    <>
      <div class="relative w-[40px] h-[40px] z-10">
        <div class="peer h-full w-full flex hover:text-white">
          <div class="m-auto">
            {props.period.text}
          </div>
        </div>
        <div id="timeframes-content" class="hidden peer-hover:flex hover:flex w-max p-1">
          <div class="grid grid-cols-3 rounded-lg bg-card drop-shadow-lg">
            {
              props.periods.map(p => <Button
                type="button"
                onClick={() => {
                  props.onPeriodChange(p)
                }}
                class="hover:text-white hover:bg-black/30 p-1 m-1 w-[40px] rounded-lg hover:cursor-pointer"
              >
                {p.text}
              </Button>
              )
            }
          </div>
        </div>
      </div>
      <Separator orientation="vertical" />
    </>

  )
}

export {
  Timeframes
}

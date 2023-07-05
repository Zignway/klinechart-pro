import type { Component } from "solid-js"
import { Separator as SeparatorPrimitive } from "@kobalte/core"
import { cn } from "../../lib/utils"
import { splitProps } from "solid-js"

const Separator: Component<SeparatorPrimitive.SeparatorRootProps> = (props) => {
  const [, rest] = splitProps(props, ["class", "orientation"])
  return (
    <SeparatorPrimitive.Root
      orientation={props.orientation ?? "horizontal"}
      class={cn(
        "shrink-0 bg-[#2b2b3b] text-[#2b2b3b] border-[#2b2b3b]",
        props.orientation === "vertical" ? "h-full w-[1px]" : "h-[1px] w-full",
        props.class
      )}
      {...rest}
    />
  )
}

export { Separator }

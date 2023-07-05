import type { Component, ComponentProps } from "solid-js"

import { DropdownMenu as DropdownMenuPrimitive } from "@kobalte/core"
import { Icons } from "./icons"
import { cn } from "../../lib/utils"
import { splitProps } from "solid-js"

const DropdownMenu: Component<DropdownMenuPrimitive.DropdownMenuRootProps> = (props) => {
  return <DropdownMenuPrimitive.Root gutter={4} {...props} />
}

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuContent: Component<DropdownMenuPrimitive.DropdownMenuContentProps> = (props) => {
  const [, rest] = splitProps(props, ["class"])
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        class={cn(
          "absolute left-0 top-0 right-0 bottom-0 z-[99] min-w-[8rem] border-none origin-[var(--kb-menu-content-transform-origin)] overflow-hidden rounded-md bg-[#232333] p-1 text-[#6f6e84] shadow-md animate-in",
          props.class
        )}
        {...rest}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

const DropdownMenuItem: Component<DropdownMenuPrimitive.DropdownMenuItemProps> = (props) => {
  const [, rest] = splitProps(props, ["class"])
  return (
    <DropdownMenuPrimitive.Item
      class={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        props.class
      )}
      {...rest}
    />
  )
}

const DropdownMenuShortcut: Component<ComponentProps<"span">> = (props) => {
  const [, rest] = splitProps(props, ["class"])
  return <span class={cn("ml-auto text-xs tracking-widest opacity-60", props.class)} {...rest} />
}

const DropdownMenuSeparator: Component<DropdownMenuPrimitive.DropdownMenuSeparatorProps> = (
  props
) => {
  const [, rest] = splitProps(props, ["class"])
  return (
    <DropdownMenuPrimitive.Separator
      class={cn("-mx-1 my-1 h-px bg-muted", props.class)}
      {...rest}
    />
  )
}

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuSubTrigger: Component<DropdownMenuPrimitive.DropdownMenuSubTriggerProps> = (
  props
) => {
  const [, rest] = splitProps(props, ["class", "children"])
  return (
    <DropdownMenuPrimitive.SubTrigger
      class={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent",
        props.class
      )}
      {...rest}
    >
      {props.children}
      <Icons.chevronRight class="ml-auto h-4 w-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

const DropdownMenuSubContent: Component<DropdownMenuPrimitive.DropdownMenuSubContentProps> = (
  props
) => {
  const [, rest] = splitProps(props, ["class"])
  return (
    <DropdownMenuPrimitive.SubContent
      class={cn(
        "z-50 min-w-[8rem] origin-[var(--kb-menu-content-transform-origin)] overflow-hidden rounded-md bg-popover p-1 text-popover-foreground shadow-md animate-in",
        props.class
      )}
      {...rest}
    />
  )
}

const DropdownMenuCheckboxItem: Component<DropdownMenuPrimitive.DropdownMenuCheckboxItemProps> = (
  props
) => {
  const [, rest] = splitProps(props, ["class", "children"])
  return (
    <DropdownMenuPrimitive.CheckboxItem
      class={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        props.class
      )}
      {...rest}
    >
      <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Icons.check class="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {props.children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuGroupLabel: Component<DropdownMenuPrimitive.DropdownMenuGroupLabelProps> = (
  props
) => {
  const [, rest] = splitProps(props, ["class"])
  return (
    <DropdownMenuPrimitive.GroupLabel
      class={cn("px-2 py-1.5 text-sm font-semibold", props.class)}
      {...rest}
    />
  )
}

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuRadioItem: Component<DropdownMenuPrimitive.DropdownMenuRadioItemProps> = (
  props
) => {
  const [, rest] = splitProps(props, ["class", "children"])
  return (
    <DropdownMenuPrimitive.RadioItem
      class={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        props.class
      )}
      {...rest}
    >
      <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Icons.circle class="h-2 w-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {props.children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
}

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"
import { Check, Sun, Moon, Laptop } from "lucide-react"

export function ThemeMode() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { theme, setTheme } = useTheme()
  const id = React.useId()

  const items = [{
    value: "light",
    label: "Light",
    image: "/ui-light.png"
  }, {
    value: "dark",
    label: "Dark",
    image: "/ui-dark.png"
  }, {
    value: "system",
    label: "System",
    image: "/ui-system.png"
  }]

  const content = (
    <div className="p-4">
      <div className="flex justify-center">
        <RadioGroup
          onValueChange={setTheme}
          defaultValue={theme}
          className="flex flex-col sm:flex-row gap-6"
        >
          {items.map((item) => (
            <label key={`${id}-${item.value}`} className="cursor-pointer">
              <RadioGroupItem
                id={`${id}-${item.value}`}
                value={item.value}
                className="peer sr-only after:absolute after:inset-0"
              />
              <div
                className={cn(
                  "relative block h-auto w-[120px] rounded-lg border-2 border-transparent transition-all",
                  "peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2",
                  "peer-data-[state=checked]:ring-4 peer-data-[state=checked]:ring-primary peer-data-[state=checked]:ring-offset-2 peer-data-[state=checked]:shadow-lg"
                )}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  width={120}
                  height={95}
                  className="w-full h-full rounded-lg"
                />
                <div
                  className={cn(
                    "absolute -top-2 -right-2 hidden h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-all duration-300",
                    "peer-data-[state=checked]:flex"
                  )}
                >
                  <Check size={16} className="text-white" />
                </div>
              </div>
              <span className="mt-2 text-center text-sm font-medium block">
                {item.label}
              </span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-fit">
          <DialogHeader>
            <DialogTitle>Pilih Tema</DialogTitle>
            <DialogDescription>
              Pilih tema yang Anda sukai untuk pengalaman yang lebih personal.
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Pilih Tema</DrawerTitle>
          <DrawerDescription>
            Pilih tema yang Anda sukai untuk pengalaman yang lebih personal.
          </DrawerDescription>
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  )
}

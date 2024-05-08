import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

// notification utils
export function notify(){
  Notification.requestPermission().then(perm => {
      if(perm === "granted"){
          const notification = new Notification("Water Time", {
              body: "Time to drink some water!",
              icon: "/assets/items/drinks/glass-of-water.svg",
              vibrate: [200, 100, 200, 100, 200, 100, 200],
              tag: "water-notification",
              renotify: true,
              silent: false,
          })
      }
  })
}
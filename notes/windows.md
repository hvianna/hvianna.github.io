# Windows tips

## Enable UTF-8 mode on Python for Windows:

+ Set the the environment variable `PYTHONUTF8=1`, or
+ Use `-Xutf8` command line option.

Source: [https://dev.to/methane/python-use-utf-8-mode-on-windows-212i](https://dev.to/methane/python-use-utf-8-mode-on-windows-212i)

## Repair a corrupted USB flash drive and/or recover its full capacity:

1. Open a **Command Prompt** as administrator (**cmd.exe**);
1. Type `Diskpart` and press enter;
1. Next type `List Disk` and press enter;
1. Type `Select Disk X` (where **X** is the disk number of your USB drive) and press enter;
1. Then type `Clean` and press enter;
1. Next type `Create Partition Primary` and press enter;
1. Type `Format fs=exFAT Quick` and press enter (**note:** for 32GB and smaller drives, use `fs=Fat32` instead);
1. Then type `Active` and press enter;
1. Finally, type `Exit` and press enter to quit.

Source: [https://www.pendrivelinux.com/restoring-your-usb-key-partition/](https://www.pendrivelinux.com/restoring-your-usb-key-partition/)

## Sleep mode troubleshooting:

See the applications which always hinder sleep mode:
```
powercfg -requests
```

See which application/device has recently awakened the computer:
```
powercfg -lastwake
```

See all the devices that can wake up your computer:
```
powercfg -devicequery wake_armed
```

Source: [https://thegeekpage.com/fix-windows-10-sleep-mode-not-working-solved/](https://thegeekpage.com/fix-windows-10-sleep-mode-not-working-solved/)

## Save the lock screen background image file:

Open the File Explorer and paste `%LocalAppData%\Packages\Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy\LocalState\Assets` into the address bar.

Sort files by size or date to easily find the wallpapers (larger files). Copy the file and add a `.jpg` extension.

Source: [https://www.cnet.com/tech/computing/where-to-find-the-windows-spotlight-photos/](https://www.cnet.com/tech/computing/where-to-find-the-windows-spotlight-photos/)

## Save the theme wallpaper file:

Open the File Explorer and paste `%UserProfile%\AppData\Roaming\Microsoft\Windows\Themes` into the address bar.

Copy the file `TranscodedWallpaper` and add a `.jpg` extension to it.

Source: [https://simpletechtutorials.blogspot.com/2016/07/windows-10-location-of-current.html](https://simpletechtutorials.blogspot.com/2016/07/windows-10-location-of-current.html)

# Windows tips

## UTF-8 support on Windows 10 console / terminal / command prompt

+ Open the system's **Language settings**
+ Select **Administrative language settings**
+ Click **Change system locale...**
+ Check **Beta: Use Unicode UTF-8 for worldwide language support**

Source: [https://superuser.com/a/1435645](https://superuser.com/a/1435645)

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

## Access Linux filesystems

First, open a command prompt or PowerShell with administrator privileges.

**List available disks:**

```
wmic diskdrive list brief
```

or, in PowerShell:

```
GET-CimInstance -classname Win32_DiskDrive
```

**Mount a disk:**

```
wsl --mount <DeviceID> --bare
```

List the available partitions:

```
wsl lsblk
```

Identify the filesystem type:

```
wsl blkid <BlockDevice>
```

**Mount the desired partition:**

```
wsl --mount <DeviceID> --partition <PartitionNumber> --type <Filesystem>
```

Unmount with:

```
wsl --unmount <DeviceID>
```

References:

+ [Access Linux filesystems in Windows and WSL 2](https://devblogs.microsoft.com/commandline/access-linux-filesystems-in-windows-and-wsl-2/)
+ [Mount a Linux disk in WSL 2](https://learn.microsoft.com/en-us/windows/wsl/wsl2-mount-disk)
+ [WMIC: WMI command-line utility](https://learn.microsoft.com/en-us/windows/win32/wmisdk/wmic)
+ [PowerShell - Working with WMI](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/07-working-with-wmi?view=powershell-7.4)

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

## Copy Windows installation to an SSD

Simpy use [Macrium Reflect](https://www.macrium.com/reflectfree) to clone the entire drive.

Source: [https://www.pcmag.com/how-to/copy-your-windows-installation-to-an-ssd](https://www.pcmag.com/how-to/copy-your-windows-installation-to-an-ssd)

## Redefinir senha de usuário local no Windows 8 ou 10

Referência: [https://tecnoblog.net/responde/redefinir-recuperar-senha-windows-10-8/](https://tecnoblog.net/responde/redefinir-recuperar-senha-windows-10-8/)

## Liberar porta 80 para uso

1. Acessar **_Painel de Controle > Programas e Recursos_**
1. Clicar em **Ativar ou desativar recursos do Windows**
1. Desmarcar a opção **Serviços de Informações da Internet**

Source: [Disable IIS and free up port 80](https://superuser.com/a/1377078)

## Enable UTF-8 mode on Python for Windows:

+ Set the the environment variable `PYTHONUTF8=1`, or
+ Use `-Xutf8` command line option.

Source: [https://dev.to/methane/python-use-utf-8-mode-on-windows-212i](https://dev.to/methane/python-use-utf-8-mode-on-windows-212i)

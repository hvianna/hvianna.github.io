# macOS tips

## Show hidden files in Finder

* In a Finder window press **Shift + Command + .** (period) to toggle hidden files *(introduced in macOS High Sierra)*

* For a persistent change, which also works for macOS El Capitan, open a Terminal window and run the command below:
  ```shell
  defaults write com.apple.finder AppleShowAllFiles YES
  ```
  Then hold Command + Alt (Option) and right-click Finder in your Dock, then click **Restart**.

## Convert PNG image to ICNS (icon) file

* Open the image in Preview and press **Shift + Command + Option + S** (Save as...)
* In the Save dialog, hold the **Option** key to see additional format options, including ICNS.

## Mount SMB share

Example shell script:

```bash
#!/bin/bash
if [[ ! -d /Volumes/FolderName ]]
then
	mkdir /Volumes/FolderName
	mount -t smbfs //username@192.168.0.2/FolderName /Volumes/FolderName
fi
```

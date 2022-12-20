# macOS tips

## Show hidden files in Finder

* In a Finder window press **Shift + Command + .** (period) to toggle hidden files *(introduced in macOS High Sierra)*

* For a persistent change, which also works for OS X El Capitan, open a Terminal window and run the command below:
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

## NET::ERR_CERT_DATE_INVALID browser error

**Reason:** Root certificates expired (usually 5 years after the [last OS update](https://en.wikipedia.org/wiki/MacOS#Release_history))

* Open the **Keychain Access** utility;
* Select the menu **View > Show Expired Certificates**;
* Click **System Roots** in the left hand column;
* You should already be able to see some certificates marked with the *"This certificate has expired"* icon;
* Locate the root certificate being used by the page which originated the error. For me, it was **DST Root CA X3**;
* Click the padlock at the top left corner of the window and enter your admin password to unlock the keychain;
* Select the expired certificate and press **Command + I** or select the menu **File > Get Info**;
* In the next window, expand the **Trust** section and select **Always Trust** in the **When using this certificate** option;
* Close the window and you'll be asked for your admin password to save the changes;
* Done!

Reference: https://macnarama.com/como-corrigir-o-erro-neterr_cert_date_invalid-no-mac/

## macOS *Big Sur* slow/unresponsive

Try turning off the screensaver!

Reference: https://developer.apple.com/forums/thread/666661?answerId=647452022#647452022

## Install newer macOS versions on unsupported Macs

Check out [dosdude1's patches for Sierra, High Sierra, Mojave and Catalina](http://dosdude1.com/software.html)

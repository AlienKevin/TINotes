# TINotes
Notes management and viewing system built for TI graphing calculators. Users are able to store organized notes in a folder system in their TI calculators for reference later. You can use the graphic user interface to create files and folders and then TINotes will generate a script file for your TI calculators. You can easily send this file to your calculator and start viewing your notes. 

NOTE: As of currently, folder system is not supported but you can still create files.

## Set up
1. Download or clone this repository
2. Lauch the `index.html` file by double click in your favorite browser
3. Now you should be inside the TINotes user interface

## Usage
### Create, edit, view, and save notes
1. Select the type of calculator you are using
      - Select `Monochrome` display type if you are using: TI-83, TI-83 Plus, TI-83 Plus Silver Edition, TI-84 Plus, or TI-84 Plus Silver Edition
      - Select `Color` display type if you are using: TI-84 Plus C Silver Edition, TI-84 Plus CE
2. Click on `New Folder` to create a new folder. Click on `New File` to create a new file. Due to the limited screen size, the number of characters allowed for file and folder names are restricted depending on your display type.
3. If you cliked on `New File`, a text editor will pop up for you to enter notes, **all normal text should be in uppercase** because TI automatically convert some lowercase words into symbols. E.g. "shopping" -> "shopπng", "alphago" -> "αgo", etc.
4. Right click on the files or folders to `rename` or `delete` them.
5. In the end, you don't need to save anything before exiting the program, all files and folders are stored locally on your machine and will automatically load next time you lauched the program.

### Export notes
1. When you are happy with your notes, you can export them to your calculator. Simply click the `Generate TI Script` button to generate the script. In the popup window, click the `download` button to download the script.
2. To load the script into your calculator, you need to download the TI Connect software from [Texas Instrument website](https://education.ti.com/en/software/details/en/CA9C74CAD02440A69FDC7189D7E1B6C2/swticonnectcesoftware#!). Pick the right version for your calculator and operating system and download TI Connect.
3. Open up the generated script file, select all text and copy it.
4. Open the TI Connect software and create a new program file. Paste the content in the new file. Name the TI file `TINOTES`.*
5. Load the TI file to your calculator
\* TINotes has been only been tested on TI Connect CE, so it should at least work for TI-84 Plus CE, TI-84 Plus C Silver Edition, TI-84 Plus Silver Edition, TI-84 Plus. For other older calculators, you may need to first compile the script and then load it using TI Connect to your calculator. For compilation, you may need to install softwares like [TokenIDE](https://www.ticalc.org/archives/files/fileinfo/433/43315.html) or online alternative [SourceCoder](https://www.cemetech.net/sc/)

### Keyboard Shortcuts
1. `Shift+f` to create a new folder
2. `Shift+t` to create a new file
3. `Ctrl+s` or `Command+s` to save a file when the file editor is open
4. `Backspace` to go back to parent folder
## License
This project is licensed under the terms of the MIT license.
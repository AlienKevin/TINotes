# TINotes
Notes management and viewing system built for TI graphing calculators. Users are able to store organized notes in a folder system in their TI calculators for reference later. You can use the graphic user interface to create files and folders and then TINotes will generate a script file for your TI calculators. You can easily send this file to your calculator and start viewing your notes. 

Try TINotes here: https://alienkevin.github.io/TINotes/

**Demo 1**: Basic Usage 
![Demo 1](https://raw.githubusercontent.com/AlienKevin/TINotes/master/Demos/Demo1.gif)

**Demo 2**: TINotes have comprehensive step-by-step instructions 
![Demo 2](https://raw.githubusercontent.com/AlienKevin/TINotes/master/Demos/Demo2.gif)

**Demo 3**: All folders and files are stored locally. Refreshing/closing and reopening will not discard data.
![Demo 3](https://raw.githubusercontent.com/AlienKevin/TINotes/master/Demos/Demo3.gif)

**Demo 4**: Notes navigation in the calculator, showing how you can navigate back and forth both in the folder system and within individual files<br/>
![Demo 4](https://raw.githubusercontent.com/AlienKevin/TINotes/master/Demos/Demo4.gif)

**Demo 5**: You even now add equations to you TI calculators! You can enter any custom equations and TINotes will auto-detect all variables and solve for each. Currently, TINotes cannot solve for variables under sqrt, log, ln, and trig functions but you can solve them using other tools and paste the results back to TINotes. (checkout [quickmath](https://quickmath.com/webMathematica3/quickmath/equations/solve/intermediate.jsp) or [doyourmath](https://doyourmath.com/))
TINotes website:
![Demo 5 website](https://raw.githubusercontent.com/AlienKevin/TINotes/gh-pages/Demos/EquationF%3Dma.gif)

TI calculator screen:
![Demo 5 calculator](https://raw.githubusercontent.com/AlienKevin/TINotes/gh-pages/Demos/EquationF%3DmaTI.gif)

## Set up
I. Use online: go to https://alienkevin.github.io/TINotes/
II. Download and use offline
1. Download or clone this repository
2. Lauch the `index.html` file by double click in your favorite browser
3. Now you should be inside the TINotes user interface

## Usage
### Create, edit, view, and save notes
1. Select the type of calculator you are using
      - Select `Monochrome` display type if you are using: TI-83, TI-83 Plus, TI-83 Plus Silver Edition, TI-84 Plus, or TI-84 Plus Silver Edition
      - Select `Color` display type if you are using: TI-84 Plus C Silver Edition, TI-84 Plus CE
2. Click on `New Folder` to create a new folder. Click on `New File` to create a new file. Due to the limited screen size, the number of characters allowed for file and folder names are restricted depending on your display type.
3. If you cliked on `New File`, a text editor will pop up for you to enter notes. **All normal text should be in uppercase** because:
     * Some lowercase words are predefined as keywords, like "and", "sin(", etc. in TI. Thus, their length cannot be accurately determined because keywords all occupy one space in TI. **This can mess up note layout and hide some parts of the note.**
     * Uppercase letters (1 byte each) take up **less space** than lowercase letters (2 bytes each).
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
1. <kbd>Shift</kbd>+<kbd>f</kbd> to create a new folder
2. <kbd>Shift</kbd>+<kbd>t</kbd> to create a new file
3. <kbd>Ctrl</kbd>+<kbd>s</kbd> or <kbd>⌘</kbd>+<kbd>s</kbd> to save a file when the file editor is open
4. <kbd>Backspace</kbd> to go back to parent folder

### Navigate in the calculator
1. When the home menu appears with some folders and/or files, press <kbd>enter</kbd> to go into that folder/file
2. If you are inside a file, 
    - press <kbd>&#11208;</kbd> or <kbd>&#11205;</kbd> or <kbd>enter</kbd> to go to next page
    - press <kbd>&#11207;</kbd> or <kbd>&#11206;</kbd> to go to previous page.
    - press <kbd>2nd</kbd> to exit the file and go back to parent folder
3. If you are inside a folder,
    - select the "Back" option in the menu by either scrolling through options using arrow keys and press <kbd>enter</kbd> or pressing the menu item's number

### Insert special symbols
You can insert special symbols by typing a "\\" (backward slash) and then the name of the symbol. E.g. "\alpha" produces "α"
Here's a list of symbols supported:
 * alpha: α
 * beta: β
 * gamma: γ
 * Delta: Δ
 * delta: δ
 * epsilon: ε
 * pi: π
 * lambda: λ
 * mu: μ
 * Omega: Ω
 * phat: p&#770; (p hat)
 * Phi: Φ
 * rho: ρ
 * Sigma: Σ
 * sigma: σ
 * tau: τ
 * sqrt(: √(
 * integral: ∫
 * \<=: ≤
 * \>=: ≥
 * !=: ≠

## License
This project is licensed under the terms of the MIT license.
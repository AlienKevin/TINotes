AxesOff
ClrDraw
Text(~1,5,15,"NUMBER MENU
Text(~1,15*2,15,"1: SAY HELLO
Text(~1,22*2+2,15,"2: SING
Text(~1,29*2+4,15,"3: LAUGH
Text(~1,36*2+6,15,"4: MOCK HP CALCS
Text(~1,43*2+8,15,"5: PLAY GAME
Text(~1,50*2+10,15,"6: PLAY GAME
Text(~1,57*2+12,15,"7: PLAY GAME
Text(~1,64*2+14,15,"8: PLAY GAME
Repeat 2>abs(5-abs(5-abs(Ans-83
	getKey
	If Ans=45
	Goto Q
End
If Ans=92
Disp "HI
If Ans=93
Disp "LA LA LA...
If Ans=94
Disp "HA! HA! HA!
If Ans=82
Disp "TI CALCS ARE","SO MUCH BETTER!
If Ans=83
Disp "YOU LOSE.
Lbl Q
ClrHome
"
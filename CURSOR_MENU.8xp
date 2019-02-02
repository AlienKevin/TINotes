AxesOff
ClrDraw
25->C
Text(5*2,15,"NUMBER MENU
Text(15*2,C,"SAY HELLO
Text(22*2,C,"SING
Text(29*2,C,"LAUGH
Text(36*2,C,"MOCK HP CALCS
Text(43*2,C,"PLAY GAME
15*2->X
Repeat max(K={21,105
	Text(X,15,">
	Repeat Ans
		getKey->K
	End
	Text(X,15,"   "
	X+7*2((Ans=34 and X<43*2)-(Ans=25 and X>15*2->X
End
If Ans=15
Disp "HI!
If Ans=22
Disp "LA LA LA...
If Ans=29
Disp "HA! HA! HA!
If Ans=36
Disp "TI CALCS ARE SO","MUCH BETTER!
If Ans=43
Disp "YOU LOSE.
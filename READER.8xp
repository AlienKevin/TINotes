Menu("NOTES","PHYSICS",1,"CHEMISTRY",2,"CALCULUS",3,"BIOLOGY",4)

Lbl 1

	Menu("PHYSICS","NEWTON'S LAWS",11,"UNIVERSAL GRAVITATION",12)

	Lbl 11
	"An object will not accelerate unless it is acted on by unbalanced forces. All matter has inertia. Inertia is the resistance of any physical object to any change in velocity, or acceleration. An object with a large mass, has a large inertia, and a high resistance to acceleration."->Str1
	Goto 0

	Lbl 12
	"Universal gravitation states that every particle in the universe is attracted to every other particle. Amazingly, universal gravitation connects the earth and sky with one equation. The same force that makes apples fall also makes stars, planets, and moons orbit each other!"->Str1
	Goto 0

Goto 0

Lbl 2
"THIS IS THE CHEMISTRY FILE"->Str1
Goto 0

Lbl 3
"THIS IS THE CALCULUS FILE"->Str1
Goto 0

Lbl 4
"THIS IS THE BIOLOGY FILE"->Str1
Goto 0

Lbl 0
ClrHome
26->L
9->R
R*L->P
0->G
length(Str1)->D
1->S
Lbl F
For(I,S,D-L,L)
	If fPart((I-1)/P)=0 and I!=1
	Then
		G+1->G
		Repeat ((K=24 or K=25) and I>P*2) or K=26 or K=34 or K=23 or K=45 or K=105
			getKey->K
		End
		If (K=24 or K=25)
		Then
			I-P*2->I
			G-1->G
		End
		If (K=23 or K=45 or K=105)
		Then
			Goto Q
		End
		ClrHome
	End
	Disp sub(Str1,I,L)
End
If D>I
	Then
	Disp sub(Str1,I,D-I+1)
End
Lbl E
Repeat ((K=24 or K=25)) or K=26 or K=34 or K=23 or K=45 or K=105
	getKey->K
End
If (K=24 or K=25)
Then
	If (G<=0)
	Then
		Goto E
	Else
		ClrHome
		(G-1)*P+1->S
		Disp sub(Str1,S,L)
		S+L->S
		G-2->G
		Goto F
	End
End
Lbl Q
DelVar Str1
ClrHome
"
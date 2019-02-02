Menu("Files","file1",1,"file2",2)
Lbl 1
"THIS IS THE FIRST FILE"->Str1
Goto 0
Lbl 2
"THIS IS THE SECOND FILE"->Str1
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
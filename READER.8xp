"IM TRYING SOMETHING A LITTLE DIFFERENT. WHAT DO YOU GUYS THINK ABOUT MAKING SHOPPING A RISK FREE INVESTMENT THAT IS ACTUALLY FUN FOR THE CONSUMER YEAH. I LIKE IT TOO. YOUGUYSAREALWAYSRIGHT SAY GOODBYE TO THE FORCED SALES AND BAD PRODUCT QUALITIES, MARSHALL FIELD AND COMPANY IS OFFERING EXCELLENT CUSTOMER SERVICE AND IMPORTED PRODUCTS DIRECTLY FROM EUROPE TO ENSURE UTMOST CUSTOMER EXPERIENCE. IN ADDITION, WE ARE RECENTLY INTRODUCING FREE DELIVERY AND EASY RETURN POLICY, SO BE SURE TO BE THE FIRST TO TRY OUT OUR NEWEST PRODUCTS WITHOUT RISK. IF YOU DON'T LIKE IT, JUST RETURN IT! #SATISFACTIONGUARANTEED"->Str1
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
		Repeat ((K=24 or K=25) and I>P*2) or K=26 or K=34 or K=23 or K=45
			getKey->K
		End
		If (K=24 or K=25)
		Then
			I-P*2->I
			G-1->G
		End
		If (K=23 or K=45)
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
Repeat ((K=24 or K=25)) or K=26 or K=34 or K=23 or K=45
	getKey->K
End
If (K=24 or K=25)
Then
	ClrHome
	(G-1)*P+1->S
	Disp sub(Str1,S,L)
	S+L->S
	G-2->G
	Goto F
End
Lbl Q
DelVar Str1
ClrHome
"
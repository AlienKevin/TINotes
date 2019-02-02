"The industry business these days is too centered around the profit over the person. #BringBackTheCustomerInCustomerService Thanks to the huge development of Chicago as a city, Marshall Field and Company's business grew exponentially."->Str1
16->C
8->R
length(Str1)->D
round(D/C/R,0)->T
Disp T
Pause 
For(P,1,T,1)
	If D/C-P*R>0
	Then
		For(I,1,R,1)
			If I=R
			Then
				Repeat getKey
				End
				ClrHome
			End
			Output(I,1,sub(Str1,(P-1)*C*R+(I-1)*C+1,C))
		End
	Else
		For(I,1,D-P*R*C,C)
		Then
			Disp sub(Str1,P*R*C+I,C)
		End
	End
End
Repeat getKey
End
ClrHome
Output(1,1,"
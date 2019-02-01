"The industry business these days is too centered around the profit over the person. #BringBackTheCustomerInCustomerService Thanks to the huge development of Chicago as a city, Marshall Field and Company's business grew exponentially. We will continue to provide the best customer service and most enjoyable shopping experience while serving more customers. #CustomerIsAlwaysRight. The industry business these days is too centered around the profit over the person."->Str1
16->L
7->R
length(Str1)->D
For(I,1,D-L,L)
	If fPart((I-1)/(R*L))=0 and I!=1
	Then
		Repeat getKey
		End
		ClrHome
	End
	Disp sub(Str1,I,L)
End
If D>I
	Then
	Disp sub(Str1,I,D-I+1)
End
Repeat getKey
End
ClrHome
Output(1,1,"
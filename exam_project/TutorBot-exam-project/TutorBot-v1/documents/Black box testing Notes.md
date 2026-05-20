code is written once, but read alot of times - write code to be read





Type: 



Black box - specification - based -  (sometimes low experience with code base) often written based on the specifications



black - box techniques:

1\. equivalence Partitioning

2\. Boundary value analysis

3\. decision table testing

4\. State transition testing





**1 Equivalence Partitioning:**



&nbsp;	Input Partions:



&nbsp;	similar inputs can be grouped together (positive integers, alphabetic characters)

&nbsp;	any partitions calue can used for testing (often a middle value)

&nbsp;	numbers: zero is a special case that consitute a partition of its own

&nbsp;	input partions (based on input values)

&nbsp;	

example: program that accepts integers between -10000 and 10000

&nbsp;	should be split in valid and non valid partitions:

&nbsp;	valid:

&nbsp;	integer between -10000 and -1 (inclusive)

&nbsp;	for 0

&nbsp;	integer between 1 and 10000 (inclusive)

&nbsp;	non-valid:

&nbsp;	below -10000

&nbsp;	above 10000

&nbsp;	non-integer numbers (edge chase)

&nbsp;	non-numeric characters(edge chase)



&nbsp;	this would translate into 3 "positive" tests(partitions) and 4 "negative" tests (partitions)



Always remember edge chases!



&nbsp;	Output Partitions:



&nbsp;	These are based on outputs!

&nbsp;	Depending on the input, we expect different Outputs. Kinda the same as input partions, find the inputs that give the expected outputs.

&nbsp;	

&nbsp;	



**In class exercise:**



Bank account

&nbsp;	Suppose you have a bank account that offers variable interest rates:



&nbsp;	0.5 per cent for the first 10000 kr credit

&nbsp;	1 per cent for the next 10000 kr

&nbsp;	1.5 per cent for the rest



&nbsp;	If you wanted to check that the bank was handling your account correctly:



&nbsp;	What input partitions might you use?

&nbsp;	

&nbsp;	Valid:

&nbsp;	1. 0 > 10000.000 2. 10000.000 > 20000.000 3.  200000.000 < MAX

&nbsp;	none-Valid:

&nbsp;	1. 0 2. MIN < 0 if it can recieve inputs: 3. non-integer numbers 4. non-numeric characters

&nbsp;	

&nbsp;	

&nbsp;	What test case values could be inferred from said partitions?



**2. Boundary Value Analysis**



&nbsp;	Partitions have boundaries

&nbsp;	errors tend to cluster around boundaries

&nbsp;	mostly bases on greater or lower than and loops

&nbsp;	works well in combination with equivalence partitioning

&nbsp;	

&nbsp;	Use the 3 boundary values approach - find the bounderies and test around them. ex 1 -99 test around 0 , 1 , 2 and 98,99,100

&nbsp;	

&nbsp;	Error testing: try to have the application raise exceptions and errors - if you are using your own errors you need to write tests to accomidate those.

&nbsp;	Parameter testing: Try edge chases in method/function parameters.



**In class exercise:**



&nbsp;	

&nbsp;	A wholesaler sells printer cartridges. The minimum order quantity is 5. There is a 20% discount for orders of 100 or more printer cartridges. You 	have been asked to prepare test cases using various values for the number of printer cartridges ordered.



&nbsp;	Use black-box analysis to identify a comprehensive series of test cases:



&nbsp;	Identify the corresponding equivalence partitions and propose test cases based on them

&nbsp;	

&nbsp;	valid: 1. >= 5 2. >=100 invalid: 3. <5 

&nbsp;	

&nbsp;	Use 3-value boundary value analysis to identify further test cases

&nbsp;	

&nbsp;	test chase: 4,5,6     99,100,101     3,4,5  -> 3,4,5,6,99,100,101

&nbsp;	

&nbsp;	Write down the full resulting list of test cases

&nbsp;	Implement the discount calculation function in code and write the corresponding unit tests in the language and unit test framework of your choice



**In class Exercise:**



&nbsp;	A password field accepts a minimum of 6 characters and a maximum of 10 characters. Define:



&nbsp;	Its corresponding equivalence partitions and test case values:

&nbsp;	valid: 1. 5 >= 10 8          5,6,7  9,10,11   

&nbsp;	non-valid: 

&nbsp;	2. 1 >= 5         2          0,1,2   4,5,6            

'	3. 10 <           542        10,11,12			

&nbsp;	4. 0 		  0	     0

&nbsp;	

&nbsp;	The boundary values and resulting test case values with a 3-boundary value approach

&nbsp;	The final list of test case values

&nbsp;	

&nbsp;	0,1,2,4,5,6,7,8,9,10,11,12,542



**In Class Exercise:**



	You are testing the payment functionality of an e-shop. The system receives a positive amount of purchases in kroner with an accuracy of 1 øre. 	Based on this value, a discount is calculated according to the following rules:



&nbsp;	Amount	Discount

&nbsp;	Up to 300 kr	0%

&nbsp;	Over 300 kr, up to 800 kr	5%

&nbsp;	Over 800 kr	10%

&nbsp;	Use black-box analysis to identify a comprehensive series of test cases:



&nbsp;	Identify the corresponding equivalence partitions and propose test cases based on them

&nbsp;	Use 3-value boundary value analysis to identify further test cases



&nbsp;	valid: 

&nbsp;	1. 1 <=300        50   0%       0,1,2        299,300,301

&nbsp;	2. 300 <= 800     500  5%       300,301,302  799,800,801

&nbsp;	3. 800 <          5000 10%      800,801,802

&nbsp;	non-valid:

&nbsp;	4. 0 	          0    error    0

&nbsp;	5. < 0           -50   error    -2,-1,0

&nbsp;	

&nbsp;	Write down the full resulting list of test cases:



&nbsp;	-50,-2,-1,0,1,2,50,299,300,301,302,500,799,800,801,802,5000

&nbsp;		

&nbsp;	Implement the discount calculation function in code and write the corresponding unit tests in the language and unit test framework of your choice







White box - the developper knows the code and how to test it


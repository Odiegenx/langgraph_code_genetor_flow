Software Development life cycles:



Waterfall Model



lets make the waterfall model work for testing? 

resulted in the the V-model



what about the iterative/Inceremental models?



Interative - you create a little abit of the whole system, and approve upon it over each cycle



Incremental - deliver er "fully" completet part of the system upon each completet cycle.



&nbsp;

You can use the V-model on each user story. 









**Verifikation:**

1. **Unit Testing:** **testing of a single unit**
1. 
**&nbsp;	-** Usually a function or method.

&nbsp;	-  Sometimes called component testing

&nbsp;	- it allows for regression test automation

&nbsp;	- LOOK AT THE INTRODUCTION TO UNIT TESTING SLIDES for more information about different libraries



Instead of Preconditions - Execution - Evaluation / Given When then



Unit tests must be implemented for the business logic of the application



Each unit test should only check one thing:

&nbsp;	- what might be open for discussion

&nbsp;	- Avoid more than one assertion per unit test

&nbsp;	- Avoid branching within a unit test (ex using if)

When a unit test fails, the code must be fixed immediately

if all unit tests pass but the code crashes, a unit test that demonstrates the failure must be written

The goal of unit testing is the enable the sustainable growth of the software project.





The Advantages of Unit Testing:



&nbsp;	- errors are found early

&nbsp;	- 



**2. Integration Testing**

&nbsp;	- Testing of parts the product involving different units

**3. System Testing**

&nbsp;	- simulation of real operation conditions in a live environment

&nbsp;	- Full user paths might be tested instead of:

&nbsp;		- Isolated units

&nbsp;		- Integration between units

&nbsp;	- here we tests what happens the system crashes

&nbsp;	- Types of requirements tested:

&nbsp;		- Functional requirements

&nbsp;			- Functionalities the product must perform

&nbsp;			- possible security requirements

&nbsp;			- Interoperability constraints

&nbsp;		- Non-functional requirements

&nbsp;			- Stress testing

&nbsp;			- Performance

&nbsp;			-  

**Validation:**

**4. Acceptance Testing**

&nbsp;	- it demonstrates the systems conforms to:

&nbsp;		- Customer requirements

&nbsp;		- Operational processes

&nbsp;		- Maintenance processes

&nbsp;	- Usually based on the requirements specification (given by the customeer / PO

&nbsp;	- Independent from other types of testing

&nbsp;	- Mostly executed by the end users (could be PO in a scrum setting)



Maintenance Testing:



Testing changes on a deployed, stable product

&nbsp;	- errors found in production

&nbsp;	- Addition of unplanned features

&nbsp;	- Migrations

&nbsp;	- System retirement

Demands full regression testing

May involve parallel operations (old running til new is approved) 


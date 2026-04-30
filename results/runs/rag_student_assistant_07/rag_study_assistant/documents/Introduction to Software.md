**Hard you can kick, software you can only curse at.**



***Introduction:***



Why do we test - because software fails.





**Why does software fail?:**



Developers makes mistakes



Errors in sprecifications, design, code: bad user Stories.



presure: deadline, complexity of systems, change of technologies



**What does testing do?**



helps examining the code

finding errors

preventing defects / preventing errors from happening



**When is a test good?**



When it finds errors! / breaks the system

Dont write millions of test, but good tests.



**How much should we test?**



Depends on how much time and money we have



***Terminology:***



**Debugging vs Testing:**



**Debugging:**

The developers indentify the cause of bugs or defects in code and correct them.

Correct / fix code.

**Testing:**

Find bugs / you dont always fix the bugs.



**Static testing.** the code is not executed (linting / sonarcube)

**Dynamic testing.** Execution of code with test data.



**Positive vs Negative testing:**



**Happy path vs unhappy path.**



**Positive (happy).** The code is supposed to execute correctly.

**Negative tested (unhappy).** The code is supposed to fail / try to break the code.



***Testing Concepts:***





**Regression testing:**

Does the new code, effect the rest of the system? if it does, a regression has been found.



Test basis

The body of knowledge used as the basis for test analysis and design

•Quality Management= Quality Assurance + Quality Control

•Quality Assurance (QA). Proactive.Making sure that processes are undertaken correctly

•Quality Control (QC). Reactive.Making sure that the desired level of quality is achieved

•Testing. Enforcement of quality control by finding defects in a product





**Verification vs Validation:**



Work product - Intermediate of deliverable of the final product



**Verification:**

writing tests to verify the acceptance criteries are covered '

**Validation:**

The PO approving the product based the acceptance criteries based on the tests (verification).



**General Testing Principles (we will be asked about 4 of them at the exam)**



1. **When we test we can prove bugs exist, but we can never prove they dont exist.**



**2. The main purpose of testing is to find as many defects as possible.**



**3. Defect clustering:**

 	-Defects are not distributed uniformly either in the software or 	 over time.

 	-The Pareto 80-20 rule: 20% of the code can have 80% of the errors.

**4. Tests ear out ( = pesticide paradox)**

 	- tests lose their ability to detect errors over time.

 	- Tests must be regularly reviewed and modified.

 	- with developers experience increasing, reduced testing might be fine.

**5. Testing is context dependent**

 	-Risk is a key aspect

 	-You have to think about what you test and how.

**6. Absence of errors fallacy**

 	- Never assume that a product is error free

 	- Even verified systems might not pass validation

**7. Exhaustive testing is impossible**

**8. Early testing is of the essence:** Reasons:

 	-Many errors have to do with specifications

 	-It is cheaper



Exhaustive Testing is Impossible!


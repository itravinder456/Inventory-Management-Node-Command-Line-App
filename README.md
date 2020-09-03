# Inventory Management-Node Command Line App

Follow the below steps to run app on your system:

---

1.  Move to the project folder "...path/inventory-management-node-command-line-app/src"

2.  run "npm start" or you can go to the subfolder "src" and run "node app".

3.  Test the application with your test cases.
    **_Thats great!_**

Some test cases:

---

1.  Verify if a user will be able to get minimal sale price if all inputs are valid.
    Result: Positive.
    Test case: Input with all valid values including valid passport number
    INPUT: GERMANY:B123AB1234567:gloves:22:mask:10
    OUTPUT: 3910 ':' 90 ':' 100 ':' 80 ':' 48

    INPUT: UK:B123AB1234567:gloves:20:mask:10
    OUTPUT: 2650 ':' 90 ':' 100 ':' 80 ':' 50

    INPUT: UK:B563DF1285567:gloves:31:mask:42
    OUTPUT: 5830 ':' 58 ':' 100 ':' 69 ':' 50

2.  Verifying if a user gives invalid input values.
    Result: Negetive
    Test case: Input with all invalid purchase country
    INPUT: GERMANY123:B123AB1234567:gloves:22:mask:10
    OUTPUT: Invalid input.

    Test case: Input with all invalid item values
    INPUT: GERMANY:B123AB1234567:gloves:22:mask:"abc10"
    OUTPUT: Invalid input.

# Database Implementation Strategy

## LAST UPDATED: 20-10-2024

## [Tables]

    1. Establishment Status 
    2. Industry Type 
    3. Establishment 
    4. Penalty Type 
    5. Penalty 
    6. Compliant Type 
    7. Compliant 
    8. UserType 
    9. UserStatus 
    10. User 
    11. User Review 
    12. Adminstrator 
    13. Supplier 
    14. Retailer 
    15. Factory 
    16. RetailStore 
    17. Inventory 
    18. Review 
    19. Quotation  
    20. Transaction Status 
    21. Purchase Transaction 
    22. Purchase 
    23. Quotation Status 
    24. Purchase Status 
    25. Order 
    26. Analytics 
    27. Product 
    28. ProductStatus 
    29. Log 
    30. Notification Type 
    31. Notification 

## [DependenciesMap]

    ### [NoDependenciesTables] {
        - 1
        - 30
        - 28
        - 23
        - 24
        - 20
        - 9
        - 8
        - 6
        - 4
        - 2
    }

    ### [WithDependenciesTables] {
        - 3 on 2, 1  
        - 10 on 8,9  
        - 15 on 3  
        - AB on 10  
        - AC on 10  
        - 27 on 10  
        - 29 ON 28 AND 10  
        - 13 ON AB AND 3  
        - 14 ON AC AND 3  
        - 25 ON AB AND 26  
        - 24 ON 25  
        - 5 ON 4 AND 12 AND AC  
        - 7 ON 6 AND 12 AND AB AND AC  
        - 11 ON 10 AND 12  
        - 16 ON AB AND AC  
        - 17 ON AB AND AC AND 21  
        - 23 ON 17 AND 25  
        - 20 ON 22 AND AB AND AC AND 17  
        - 19 ON 20 AND 18  
    }

## [ImplementationOrder&Status]

    1. Establishment Status 
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: DONE, 
        - COMPLEX-STATUS: DONE, 
        - REVIEWED: DONE

    2. Notification Type
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: DONE, 
        - COMPLEX-STATUS: DONE, 
        - REVIEWED: DONE
    
    3. ProductStatus
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    4. Purchase Status
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: DONE, 
        - COMPLEX-STATUS: DONE, 
        - REVIEWED: DONE

    5. Quotation Status
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: DONE, 
        - COMPLEX-STATUS: DONE, 
        - REVIEWED: DONE

    6. Transaction Status
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: DONE, 
        - COMPLEX-STATUS: DONE, 
        - REVIEWED: DONE

    7. UserType
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: DONE, 
        - COMPLEX-STATUS: DONE, 
        - REVIEWED: DONE

    8. UserStatus
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: DONE, 
        - COMPLEX-STATUS: DONE, 
        - REVIEWED: DONE

    9. Compliant Type
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: DONE, 
        - COMPLEX-STATUS: DONE, 
        - REVIEWED: DONE

    10. Penalty Type
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: DONE, 
        - COMPLEX-STATUS: DONE, 
        - REVIEWED: DONE

    11. Industry Type
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: DONE, 
        - COMPLEX-STATUS: DONE, 
        - REVIEWED: DONE

    12. Adminstrator
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: DONE, 
        - COMPLEX-STATUS: DONE, 
        - REVIEWED: DONE

    13. Establishment
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: DONE, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    14. User
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    15. Inventory
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    16. Supplier
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    17. Retailer
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    18. Log
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    19. Notification
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    20. Factory
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    21. RetailStore
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    22. Product
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    23. Analytics
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    24. Penalty
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    25. Compliant
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    26. User Review  
        - STATUS: DONE,  
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    27. Review
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    28. Quotation
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    29. Order
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET
 
    30. Purchase
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    31. Purchase Transaction
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

    32. Category
        - STATUS: DONE, 
        - ADJUSTMENTS: DONE, 
        - CRUD-STATUS: NOT YET, 
        - COMPLEX-STATUS: NOT YET, 
        - REVIEWED: NOT YET

## [ImplementationCategories]

    1. TABLE AND INTER-RELATIONS & CRUD FUNCTIONS (GET / UPDATE / CREATE / DELETE) FOR EACH TABLE
    2. COMPLEX FUNCTIONS (CHECK / SUBMIT / GENERATE / VALIDATE)

## [ImplementationARTIFACTS]

    1. SQL FILE FOR EACH TABLE AND ITS CRUD FUNCTIONS COMMENT SEPARATED
    2. SQL FILE FOR COMPLEX FUNCTIONS
    3. SQL FILE FOR DATABASE GENERAL
    4. MANUAL FILE
    5. CONNECTION / PROPERTIES FILE

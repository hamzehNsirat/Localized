# Database Implementation Strategy

## LAST UPDATED: 15-10-2024

$$

[Tables]:
{
    1- Establishment Status
    2- Industry Type
    3- Establishment
    4- Penalty Type
    5- Penalty
    6- Compliant Type
    7- Compliant
    8- UserType
    9- UserStatus
    10- User
    11- User Review
    12-Adminstrator
    AB- Supplier
    AC- Retailer
    13- Factory
    14- RetailStore
    15- Inventory
    16- Review
    17- Quotation
    18- Transaction Status
    19- Purchase Transaction
    20- Purchase
    21- Quotation Status
    22- Purchase Status
    23- Order
    24- Analytics
    25- Product
    26- ProductStatus
    27- Log
    28- Notification Type
    29- Notification
}

[Dependencies Map]: {
    [No Dependencies Tables]: {
        1
        28
        26
        22
        21
        18
        9
        8
        6
        4
        2
        12
    }

    [With Dependencies Tables]: {
        3 on 2, 1
        10 on 8,9
        15 on 3
        AB on 10
        AC on 10
        27 on 10
        29 ON 28 AND 10
        13 ON AB AND 3
        14 ON AC AND 3
        25 ON AB AND 26
        24 ON 25
        5 ON 4 AND 12 AND AC
        7 ON 6 AND 12 AND AB AND AC
        11 ON 10 AND 12
        16 ON AB AND AC
        17 ON AB AND AC AND 21
        23 ON 17 AND 25
        20 ON 22 AND AB AND AC AND 17
        19 ON 20 AND 18
    }

}

[Implementation Order]:
{
    1- Establishment Status
    2- Notification Type
    3- ProductStatus
    4- Purchase Status
    5- Quotation Status
    6- Transaction Status
    7- UserType
    8- UserStatus
    9- Compliant Type
    10- Penalty Type
    11- Industry Type
    12- Adminstrator
    13- Establishment
    14- User
    15- Inventory
    16- Supplier
    17- Retailer
    18- Log
    19- Notification
    20- Factory
    21- RetailStore
    22- Product
    23- Analytics
    24- Penalty
    25- Compliant
    26- User Review
    27- Review
    28- Quotation
    29- Order
    30- Purchase
    31- Purchase Transaction
}

[Implementation Categories]:
{
    1- TABLES AND INTER-RELATIONS
    2- CRUD FUNCTIONS (GET / UPDATE / CREATE / DELETE) FOR EACH TABLE
    3- COMPLEX FUNCTIONS (CHECK / SUBMIT / GENERATE / VALIDATE)
}

[Implementation ARTIFACTS]:
{
    1- SQL FILE FOR DATABASE CREATION AND COMMENT SEPARATED TABLES AND INTER-RELATIONS CREATION
    2- SQL FILE FOR EACH TABLE CRUD FUNCTIONS
    3- SQL FILE FOR COMPLEX FUNCTIONS
    4- MANUAL FILE
    5- CONNECTION / PROPERTIES FILE
}

# TODO Backend
## PRE
* APPLICATION
    - payload:
        - USER:
            FIRST NAME 
            LAST NAME
            USERNAME
            Email
            PASSWORD
            PHONE
        - ESTABLISHMENT:
            ESTABLISHMENT NAME 
            ESTABLISHMENT Email
            ESTABLISHMENT PHONE
            ESTABLISHMENT DESC
            ESTABLISHMENT CMRCL REG NUM
            ESTABLISHMENT CITY
            ESTABLISHMENT STREET 
            ESTABLISHMENT BUILDING NUMBER
            ESTABLISHMENT LOGO

    - actions: 
        - Insert,
        - View, 
        - Update, 
        - Get, 
        - Status
    - todo: 
        - TABLE
        - MODEL
        - Add to Auth Routes
        - add to Auth Controller
        - add to Auth Service


## RETAILER PART

### PART 1 Signup
- service: check user name is already in database
- service: submit APPLICATION

### PART 2 Login
- service: is the most recent application approved, and username/email is in the database
- service: forget password -> send an email with a unique code, listen to the user input new code, compare sent code and entered code 
if matching -> update password from payload if not -> handle error
- service: Actual Login

### PART 3 DASHBOARD Init
- service: fetch user / Retailer data,
- service: get progress bar profile, user id returns percantge of completed data in terms of User / - Supplier-RETAILER
- service: get progress bar establishment, returns percantge of completed data
- service: Insights (postponed)

### PART 4 MARKETPLACE RETAILER
- service: Get all Products Paginated (filtered by RetailStore Categories (retailerId -> EstablishmentId -> IndustryTypes -> Categories - > Products))
- service: Get all Products By IndustryTypes Or Categories (filtered by RetailStore Categories (retailerId -> EstablishmentId -> IndustryTypes -> Categories - > Products))
- service: Search by product Category, product name,factory name (filtered by search term, page size, page index)
- service: gets Supplier Data (supplier id) 
    Establishment Cover
    Establishment Logo
    Establishment name
    Supplier IndustryType
        - service: List Of Supplier Products 10 
                            getSupplierProductsPaginated
        - service: List of Reviews 10
                            getSupplierReviewPaginated
    Supplier Review Count
    Establishment Rating


#### Change Quotation Table and Functions, add Summations, remove Payment IBAN / Bank Account / Name .. etc ####
#### Change Order Table and Functions, add Order Total Price, Remove Quantity

### PART 5 Request QUOTATION
- service: Get Retailer Info and establishment Info (retailerId)
- service: Request QUOTATION -> insert in database returns success / error 
- service: create orders enlisted in quotation
### PART 6 Manage QUOTATION
- service: GetQuotations List by Retailer (retailerId, page sized, page number)
qid, logo supplier, factory name, status
- service: Get Quotation BY ID
    Quotation Details
    List Of Orders with supplier entered values
    other Quotation Fields like:
    SubTotal 
    Total 
- service: Update Status Quotation (Reject)
- service: Update Status Quotation (Accepted)
- service: Purchase (Creates Purchase)

#### Adjust Supplier to have Overall Rating Score ####

### PART 7 REVIEW 
- service: submit Review (supplier,retailerId, Review Object)
- service: Calculate Overall Rating Supplier

### PART 8 COMPLAINTS
- service: Get Complaints by Retailer: (retailerid, page size, page index)
- service: Get Complaint Data by Id
- service: Get Related Quotations for Retailer (Id, Supplier)
- service: Get Complaint Types
- service: Create Complaint

### PART 9 NOTIFICATIONS
- service: get related notifications by retailerId

### PART 10 GENERAL
- service: update user data
- service: update Retailer data
- service: get update RetailStore Data
- service: get policies
- service: logout

## SUPPLIER PART

### PART 1 Signup
- service: check user name is already in database
- service: submit APPLICATION

### PART 2 Login
- service: is the most recent application approved, and username/email is in the database
- service: forget password -> send an email with a unique code, listen to the user input new code, compare sent code and entered code 
if matching -> update password from payload if not -> handle error
- service: Actual Login


### PART 3 DASHBOARD Init
- service: fetch user / supplier data,
- service: get progress bar profile, user id returns percantge of completed data in terms of User / - Supplier-RETAILER
- service: get progress bar establishment, returns percantge of completed data
- service: Insights (postponed)

### PART 4 MARKETPLACE SUPPLIER
- service: Get all Products Paginated (filtered by Factory Categories (supplierId -> EstablishmentId -> IndustryTypes -> Categories - > Products))
- service: Search by product Category, product name,factory name (filtered by search term, page size, page index)

### PART 5 PRODUCTS
- service: Get all Products Paginated (supplierId)
- service: Insert Product
- service: Update Product

### PART 6 Manage QUOTATION
- service: GetQuotations List by Supplier (supplierId, page sized, page number)
qid, logo retailer, retailstore name, status
- service: Get Quotation BY ID
    Quotation Details
    List Of Orders with default values
    other Quotation Fields like:
    total subtotal and shipping price
- service: Update Status Quotation (Reject)
- service: Submit Quotation (changes Quotation Details, sets Total and subTotal)
- service: Update Status Quotation (Completed)

### PART 7 COMPLAINTS
- service: Get Complaints by Supplier: (Supplierid, page size, page index)
- service: Get Complaint Data by Id
- service: Get Related Quotations for Supplier (Id, Supplier)
- service: Get Complaint Types
- service: Create Complaint

### PART 8 NOTIFICATIONS
- service: get related notifications by retailerId

### PART 9 GENERAL
- service: update user data
- service: update Supplier data
- service: update Factory Data + Cover
- service: get policies
- service: logout


## ADMINSTRATOR PART

### PART 1 Signup
- service: check user name is already in database
- service: sign up
### PART 2 Login
- service: forget password -> send an email with a unique code, listen to the user input new code, compare sent code and entered code 
if matching -> update password from payload if not -> handle error
- service: Actual Login
- TO BE DETERMINED
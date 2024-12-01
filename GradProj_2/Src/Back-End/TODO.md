# TODO Backend

## RETAILER PART [COMPLETION PERCENTAGE:20%]


### PART 1 Signup
- service: check user name is already in database
    - payload:
        ```json
                    {
                        "username": "value"
                    }
    
    - expected Response/s:
        - Error
            ```json
                        {
                            "header": {
                                "errorCode": "E0020",
                                "errorDescription": "Missing Data",
                                "statusCode": "E0020",
                                "message": "Username is Mandatory for this Operation"
                            }
                        }

        - Success
            ```json
                        {
                            "header": {
                                "errorCode": "0000",
                                "errorDescription": "SUCCESS",
                                "statusCode": 200,
                                "message": "Operation completed successfully"
                            },
                            "body": {
                                "success": true,
                                "isAvailable": false // or true if available
                            }
                        }
- service: submit APPLICATION
    - payload:
        ```json
                        {
                            "userType": 2,
                            "firstName": "first",
                            "lastName": "last",
                            "userName": "username123",
                            "email": "usr@mail.com",
                            "password": "pass123",
                            "phoneNumber": "0795554443",
                            "establishmentName": "Sharekat al Dajaj",
                            "establishmentContactNumber": "0799998882",
                            "establishmentEmail": "est@mail.com",
                            "establishmentDescription": "",
                            "establishmentCommercialRegistrationNum": 124565,
                            "establishmentCity": "Amman",
                            "establishmentStreet": "Abdali",
                            "establishmentBuildingNum": "B1",
                            "establishmentIndustryType": [
                                1,
                                2,
                                3
                            ],
                            "establishmentLogo": null
                        }
    
    - expected Response/s:
        - Error
            ```json
                        {
                            "header": {
                                "errorCode": "E0019",
                                "errorDescription": "Submit Failure",
                                "statusCode": "E0019",
                                "message": "Submitting an Application has failed"
                            },
                            "body": {
                                "details": {
                                    "success": false,
                                    "error": "Unable to Create Application in Database"
                                }
                            }
                        }

        - Success
            ```json
                        {
                            "header": {
                                "errorCode": "0000",
                                "errorDescription": "SUCCESS",
                                "statusCode": 201,
                                "message": "Operation completed successfully"
                            },
                            "body": {
                                "success": true
                            }
                        }
### PART 2 Login
- service: is the most recent application approved, and username/email is in the database
    - payload:
        ```json
                        {
                            "user": {
                                "userName": "usera7a22",
                                "userEmail": null,
                                "userPassword": "ppopopopop555"
                            }
                        }    
    - expected Response/s:
        - Error
            ```json
                        {
                            "header": {
                                "errorCode": "E0008",
                                "errorDescription": "Operation Failure",
                                "statusCode": "E0008",
                                "message": "Sign in operation has failed."
                            },
                            "body": {
                                "details": {
                                    "success": false,
                                    "error": "No User Found"
                                }
                            }
                        }

        - Success
            ```json
                        {
                            "header": {
                                "errorCode": "0000",
                                "errorDescription": "SUCCESS",
                                "statusCode": 200,
                                "message": "Operation completed successfully"
                            },
                            "body": {
                                "success": true,
                                "error": "Application for this User is still Pending Review"
                            }
                        }

- service: forget password -> send an email with a unique token, listen to the user input new code, compare sent token and entered token 
if matching -> update password from payload if not -> handle error
  - payload(1) (Request Password Reset):
    ```json
                        {
                            "email": "hamzehnussirat99@gmail.com"
                        }
    - expected Response/s:
        - Error
            ```json
                        {
                            "header": {
                                "errorCode": "E0029",
                                "errorDescription": "Missing Data",
                                "statusCode": "E0029",
                                "message": "Email is Mandatory"
                            }
                        }

        - Success
            ```json
                        {
                            "header": {
                                "errorCode": "0000",
                                "errorDescription": "SUCCESS",
                                "statusCode": 200,
                                "message": "Operation completed successfully"
                            },
                            "body": {
                                "success": true
                            }
                        }
  - payload(2) (Actual Password Reset):
    ```json
                        {
                            "resetToken": "f1cecf1a67b27e51285c4fac0b46a2ad17df11d7af747eb3d81d4d542958e30c",
                            "newPassword": "APPROfffssaaVED"
                        }
    - expected Response/s:
        - Error
            ```json
                        {
                            "header": {
                                "errorCode": "E0031",
                                "errorDescription": "Missing Data",
                                "statusCode": "E0031",
                                "message": "newPassword and resetToken are Mandatory"
                            }
                        }
        - Success
            ```json
                        {
                            "header": {
                                "errorCode": "0000",
                                "errorDescription": "SUCCESS",
                                "statusCode": 200,
                                "message": "Operation completed successfully"
                            },
                            "body": {
                                "success": true
                            }
                        }

- service: Actual Login
    - payload:
        ```json
                    {
                        "user": {
                        "userName": "admin00001",
                        "userEmail": null,
                        "userPassword": "APPROfffssaaVED"
                    }
                    }
    - expected Response/s:
        - Error
            ```json
                        {
                            "header": {
                                "errorCode": "E0008",
                                "errorDescription": "Operation Failure",
                                "statusCode": "E0008",
                                "message": "Sign in operation has failed."
                            },
                            "body": {
                                "details": {
                                    "success": false,
                                    "error": "No User Found"
                                }
                            }
                        }

        - Success
            ```json
                        {
                            "header": {
                                "errorCode": "0000",
                                "errorDescription": "SUCCESS",
                                "statusCode": 200,
                                "message": "Operation completed successfully"
                            },
                            "body": {
                                "success": true,
                                "userId": "147",
                                "userType": "1",
                                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNDciLCJ1c2VyVHlwZSI6IjEiLCJ1c2VybmFtZSI6ImFkbWluMDAwMDEiLCJ0b2tlblZlcnNpb24iOjAsImlhdCI6MTczMzA4MDEyNSwiZXhwIjoxNzMzMTY2NTI1fQ.MbkDeEwg14Xv2pRiwSHpIAITu_H7PifYtE87_zkgy5c"
                            }
                        }

### PART 3 DASHBOARD Init
- service: fetch user / Retailer data,

- service: get progress bar profile, user id returns percantage of completed data in terms of User / - Supplier-RETAILER
- service: get progress bar establishment, returns percantage of completed data
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

## SUPPLIER PART  [COMPLETION PERCENTAGE:]

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


## ADMINSTRATOR PART  [COMPLETION PERCENTAGE:]

### PART 1 Signup
- service: check user name is already in database
- service: sign up
### PART 2 Login
- service: forget password -> send an email with a unique code, listen to the user input new code, compare sent code and entered code 
if matching -> update password from payload if not -> handle error
- service: Actual Login
- TO BE DETERMINED
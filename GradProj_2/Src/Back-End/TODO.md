# TODO Backend

## RETAILER PART [COMPLETION PERCENTAGE:50%]


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
- one Call: Get Retailer All Data
   - payload:
        ```json
                        {
                            "userId":168
                        }
    - expected Response/s:
        - Error
            ```json
                        {
                            "header": {
                                "errorCode": "E0034",
                                "errorDescription": "Fetch Failure",
                                "statusCode": "E0034",
                                "message": "Fetching Retailer Details failed"
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
                                "retailerDashboard": {
                                    "userDetails": {
                                        "nationalNumber": null,
                                        "userName": "retailer99301",
                                        "userType": "3",
                                        "userStatus": "1",
                                        "firstName": "retailer",
                                        "middleName": null,
                                        "lastName": "adam",
                                        "dateOfBirth": null,
                                        "userEmail": "retailer00032@mail.com",
                                        "userPhone": "0700002030",
                                        "userAddress": null
                                    },
                                    "retailerDetails": {
                                        "retailerId": "11",
                                        "retailerTaxIdentificationNumber": null,
                                        "retailerBankAccountNumber": null,
                                        "retailerIBAN": null,
                                        "retailerComplianceIndicator": 1,
                                        "retailerComplaintCount": 0
                                    },
                                    "retailStoreDetails": {
                                        "retailStoreId": "3-11"
                                    },
                                    "establishmentDetails": {
                                        "establishmentName": "test",
                                        "establishmentIndustryType": [
                                            "3"
                                        ],
                                        "establishmentStatus": "1",
                                        "establishmentCommercialRegistrationNumber": "44450",
                                        "establishmentRegistrationDate": "2024-01-01T20:00:00.000Z",
                                        "establishmentContactNumber": "0777778485",
                                        "establishmentEmail": "err@gmail.com",
                                        "establishmentWebsite": null,
                                        "establishmentDescription": "Main",
                                        "establishmentType": true,
                                        "establishmentCity": "Amman",
                                        "establishmentStreet": "Abdali",
                                        "establishmentBuildingNumber": "B1",
                                        "establishmentLogo": null,
                                        "establishmentCover": null,
                                        "establishmentComplianceIndicator": 1,
                                        "establishmentComplianceIndicatorDescription": "GOOD"
                                    },
                                    "progressBarUser": {
                                        "percentage": 73
                                    },
                                    "progressBarEstablishment": {
                                        "percentage": 85
                                    },
                                    "insights": "To Be Done"
                                }
                            }
                        }
### PART 4 MARKETPLACE RETAILER
- service: Get all Products Paginated (filtered by RetailStore Categories (retailerId -> EstablishmentId -> IndustryTypes -> Categories - > Products))
   - payload:
        ```json
                        {
                            "retailerId":11,
                            "pageSize":1,
                            "pageIndex":1
                        }
    - expected Response/s:
        - Error
            ```json
                        {
                            "header": {
                                "errorCode": "E0035",
                                "errorDescription": "Missing Data",
                                "statusCode": "E0035",
                                "message": "retailerId, pageSize and pageIndex are Mandatory"
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
                                "marketPlace": {
                                    "productItem": [
                                        {
                                            "id": "2",
                                            "name": "test",
                                            "description": "in_product_description",
                                            "image": null,
                                            "retailPrice": null,
                                            "unitPrice": 45.5,
                                            "wholeSalePrice": null,
                                            "supplier": "2"
                                        }
                                    ]
                                }
                            }
                        }
- service: Get all Products By IndustryTypes Or Categories (filtered by RetailStore Categories (retailerId -> EstablishmentId -> IndustryTypes -> Categories - > Products))
   - payload:
        ```json
                        {
                            "industryList":[1,2],
                            "categoryList":[3],
                            "pageSize": 2,
                            "pageIndex":1    
                        }
    - expected Response/s:
        - Error
            ```json
                        {
                            "header": {
                                "errorCode": "E0036",
                                "errorDescription": "Fetch Failure",
                                "statusCode": "E0036",
                                "message": "Fetching Retailer Marketplace failed"
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
                                "marketPlace": {
                                    "productItem": [
                                        {
                                            "id": "3",
                                            "name": "batata",
                                            "description": "in_product_description",
                                            "image": null,
                                            "retailPrice": 1.2,
                                            "unitPrice": 1,
                                            "wholeSalePrice": 0.8,
                                            "supplier": "1"
                                        },
                                        {
                                            "id": "5",
                                            "name": "batata",
                                            "description": "in_product_description",
                                            "image": null,
                                            "retailPrice": 1.2,
                                            "unitPrice": 1,
                                            "wholeSalePrice": 0.8,
                                            "supplier": "1"
                                        }
                                    ]
                                },
                                "totalRecordsCount": "6"
                            }
                        }

- service: Search by product Category, product name,factory name (filtered by search term, page size, page index)
   - payload:
        ```json
                        {
                            "searchTerm":"batat",
                            "pageSize": 2,
                            "pageIndex":1    
                        }
    - expected Response/s:
        - Error
            ```json
                        {
                            "header": {
                                "errorCode": "E0038",
                                "errorDescription": "Missing Data",
                                "statusCode": "E0038",
                                "message": "searchTerm, pageSize and pageIndex are Mandatory"
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
                                "marketPlace": {
                                    "productItem": [
                                        {
                                            "id": "6",
                                            "name": "batata",
                                            "description": "in_product_description",
                                            "image": null,
                                            "retailPrice": 1.2,
                                            "unitPrice": 1,
                                            "wholeSalePrice": 0.8,
                                            "supplier": "1"
                                        },
                                        {
                                            "id": "5",
                                            "name": "batata",
                                            "description": "in_product_description",
                                            "image": null,
                                            "retailPrice": 1.2,
                                            "unitPrice": 1,
                                            "wholeSalePrice": 0.8,
                                            "supplier": "1"
                                        }
                                    ]
                                },
                                "totalRecordsCount": "4"
                            }
                        }

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
   - payload:
        ```json
                        {
                            "supplierId":1,
                            "pageSize": 1,
                            "pageIndex":1    
                        }
    - expected Response/s:
        - Error
            ```json
                        {
                            "header": {
                                "errorCode": "E0039",
                                "errorDescription": "No Data",
                                "statusCode": "E0039",
                                "message": "Search Yielded No Data"
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
                                "supplierProfile": {
                                    "supplierEstablishmentName": "test",
                                    "supplierEstablishmentLogo": null,
                                    "supplierEstablishmentCover": null,
                                    "supplierIndustryTypes": [
                                        "3"
                                    ],
                                    "products": {
                                        "productItem": [
                                            {
                                                "id": 3,
                                                "name": "batata",
                                                "description": "in_product_description",
                                                "image": null,
                                                "retailPrice": 1.2,
                                                "unitPrice": 1,
                                                "wholeSalePrice": 0.8
                                            }
                                        ]
                                    },
                                    "totalProducts": "4",
                                    "reviews": {
                                        "reviewItem": []
                                    },
                                    "totalReviews": "0",
                                    "reviewCount": "0",
                                    "overallRating": null
                                }
                            }
                        }
### PART 5 Request QUOTATION
- service: Get Retailer Info and establishment Info (retailerId)
already has required data from dashboard get reatiler all details service
- service: Request QUOTATION -> insert in database returns success / error 
- service: create orders enlisted in quotation
   - payload:
        ```json
                        {
                            "retailerId": 1,
                            "supplierId": 1,
                            "retailerEstablishmentName": "Sha",
                            "supplierEstablishmentName": "Aaa",
                            "shippingAddress": "",
                            "billingAddress": "",
                            "quotationDetails": {
                                "detailsItem": [
                                    {
                                        "productId": 1,
                                        "quantity": 4,
                                        "price": 1.5
                                    },
                                    {
                                        "productId": 2,
                                        "quantity": 4,
                                        "price": 1
                                    }
                                ]
                            }
                        }
    - expected Response/s:
        - Error
            ```json
                        {
                            "header": {
                                "errorCode": "E0040",
                                "errorDescription": "Missing Data",
                                "statusCode": "E0040",
                                "message": "supplierId, retailerId, quotationDetails, supplierEstablishmentName, retailerEstablishmentName, shippingAddress are Mandatory"
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

## UTILITIES
- service: Upload Image
    - request
                form-data
                key: image
                Type: file
                Value: image to be uploaded
    - response
    ```json
                {
                    "success": true,
                    "message": "Image uploaded successfully",
                    "imageUrl": "http://localhost:5055/uploads/images/default-1733500510538-241284316.png",
                    "description": "No description provided"
                }
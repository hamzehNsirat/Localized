# TODO Backend

## Project Distribution

- Analytics: Hamzeh
- Admin: Husam
- Integration: Abu Ayyash
- Document: Rafeeq
- Poster / Video: Husam

## RETAILER PART [COMPLETION PERCENTAGE:100%]
### PART 1 Signup
#### service: check user name is already in database
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
#### service: submit APPLICATION
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
#### service: is the most recent application approved, and username/email is in the database
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
#### service: forget password -> send an email with a unique token, listen to the user input new code, compare sent token and entered token 
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
#### service: Actual Login
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
#### service: fetch user / Retailer data,
##### service: get progress bar profile, user id returns percantage of completed data in terms of User / - Supplier-RETAILER
##### service: get progress bar establishment, returns percantage of completed data
##### service: Insights (postponed)
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
#### service: Get all Products Paginated (filtered by RetailStore Categories (retailerId -> EstablishmentId -> IndustryTypes -> Categories - > Products))
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
#### service: Get all Products By IndustryTypes Or Categories (filtered by RetailStore Categories (retailerId -> EstablishmentId -> IndustryTypes -> Categories - > Products))
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
#### service: Search by product Category, product name,factory name (filtered by search term, page size, page index)
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
#### service: gets Supplier Data (supplier id) 
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
#### service: Get Retailer Info and establishment Info (retailerId)
already has required data from dashboard get reatiler all details service
#### service: Request QUOTATION -> insert in database returns success / error 
#### service: create orders enlisted in quotation
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
#### service: GetQuotations List by Retailer (retailerId, page sized, page number)
qid, logo supplier, factory name, status
- payload:
     ```json
                        {
                            "retailerId": 1,
                            "pageSize": 5,
                            "pageIndex": 1
                        }
- expected Response/s:
    - Error
        ```json
                        {
                            "header": {
                                "errorCode": "E0045",
                                "errorDescription": "Missing Data",
                                "statusCode": "E0045",
                                "message": "retailerId, pageSize, pageIndex are Mandatory"
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
                                "quotationsList": {
                                    "quotationItem": [
                                        {
                                            "id": "23",
                                            "logo": null,
                                            "factoryName": "test",
                                            "status": "REQUESTED"
                                        },
                                        {
                                            "id": "22",
                                            "logo": null,
                                            "factoryName": "test",
                                            "status": "REQUESTED"
                                        },
                                        {
                                            "id": "21",
                                            "logo": null,
                                            "factoryName": "test",
                                            "status": "REQUESTED"
                                        },
                                        {
                                            "id": "5",
                                            "logo": null,
                                            "factoryName": "test",
                                            "status": "REQUESTED"
                                        },
                                        {
                                            "id": "4",
                                            "logo": null,
                                            "factoryName": "test",
                                            "status": "REQUESTED"
                                        }
                                    ]
                                }
                            }
                        }
#### service: Get Quotation BY ID
    Quotation Details
    List Of Orders with supplier entered values
    other Quotation Fields like:
    SubTotal 
    Total 
- payload:
    ```json
                        {
                            "quotationId":21
                        }
- expected Response/s:
    - Error
        ```json
                        {
                            "header": {
                                "errorCode": "E0048",
                                "errorDescription": "Fetch Failure",
                                "statusCode": "E0048",
                                "message": "Fetching Quotation Details has Failed"
                            },
                            "body": {
                                "details": {
                                    "success": false,
                                    "error": "Failed to Fetch Quotations"
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
                                "quotationDetails": {
                                    "id": "21",
                                    "requesterId": "1",
                                    "supplierId": "1",
                                    "retailStore": "Sha",
                                    "factory": "Aaa",
                                    "requestDate": "2024-12-06T15:47:00.902Z",
                                    "statusId": "1",
                                    "details": {
                                        "detailsItem": [
                                            {
                                                "price": 1,
                                                "quantity": 4,
                                                "productId": 1
                                            }
                                        ]
                                    },
                                    "attachments": null,
                                    "paymentReferenceNumber": null,
                                    "reconciliationNumber": null,
                                    "latestTransactionID": null,
                                    "shippingCost": null,
                                    "subTotal": null,
                                    "total": null,
                                    "shipToAddress": "",
                                    "billToAddress": "",
                                    "factoryAddress": null,
                                    "hasRelatedComplaints": 0
                                }
                            }
                        }
#### service: Update Status Quotation (Reject)
- payload:
    ```json
                        {
                            "quotationId": 21,
                            "quotationStatusId": 5
                        }
- expected Response/s:
    - Error
        ```json
                        {
                            "header": {
                                "errorCode": "E0050",
                                "errorDescription": "Update Failure",
                                "statusCode": "E0050",
                                "message": "Updating Quotation Status has Failed"
                            },
                            "body": {
                                "details": {
                                    "success": false,
                                    "error": "Failed to Update Quotation Status"
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
                                "success": true
                            }
                        }
#### service: Update Status Quotation (Accepted)
- payload:
     ```json
                        {
                            "quotationId": 21,
                            "quotationStatusId": 3
                        }
- expected Response/s:
    - Error
        ```json
                        {
                            "header": {
                                "errorCode": "E0050",
                                "errorDescription": "Update Failure",
                                "statusCode": "E0050",
                                "message": "Updating Quotation Status has Failed"
                            },
                            "body": {
                                "details": {
                                    "success": false,
                                    "error": "Failed to Update Quotation Status"
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
                                "success": true
                            }
                        }
#### service: Purchase (Creates Purchase)

- payload:
    ```json
                        {
                            "quotationId": 21,
                            "buyerId": 1,
                            "supplierId": 1,
                            "paymentAmount": 2.5
                        }
- expected Response/s:
    - Error
        ```json
                        {
                            "header": {
                                "errorCode": "E0052",
                                "errorDescription": "Creation Failure",
                                "statusCode": "E0052",
                                "message": "Creating Purchase has Failed"
                            },
                            "body": {
                                "details": {
                                    "success": false,
                                    "error": "Failed to Create Transaction Details"
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
                                "success": true
                            }
                        }
### PART 7 REVIEW 
#### service: submit Review (supplier,retailerId, Review Object)
##### service: Calculate Overall Rating Supplier
- payload:
    ```json
                        {
                            "retailerId": 1,
                            "supplierId": 1,
                            "rating":2,
                            "reviewComment":"NA"
                        }
- expected Response/s:
- Error
    ```json
                    {
                        "header": {
                            "errorCode": "E0053",
                            "errorDescription": "Missing Data",
                            "statusCode": "E0053",
                            "message": "supplierId, retailerId, rating and reviewComment are Mandatory"
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
### PART 8 COMPLAINTS

#### service: Get Complaints by Retailer: (retailerid, page size, page index)
- payload:
    ```json
                    {
                        "retailerId":1,
                        "pageSize":5,
                        "pageIndex":1
                    }
- expected Response/s:
    - Error
      ```json
                    {
                        "header": {
                            "errorCode": "E0055",
                            "errorDescription": "Missing Data",
                            "statusCode": "E0055",
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
                            "complaintsList": {
                                "complaintItem": [
                                    {
                                        "id": "23",
                                        "title": "Not Responsive Supplier",
                                        "date": "2024-12-07T14:15:26.193Z",
                                        "status": "CREATED"
                                    },
                                    {
                                        "id": "22",
                                        "title": "Not Responsive Supplier",
                                        "date": "2024-12-07T14:15:25.702Z",
                                        "status": "CREATED"
                                    },
                                    {
                                        "id": "21",
                                        "title": "Not Responsive Supplier",
                                        "date": "2024-12-07T14:15:24.104Z",
                                        "status": "CREATED"
                                    },
                                    {
                                        "id": "18",
                                        "title": "Defective Items Received",
                                        "date": "2024-12-07T14:13:52.695Z",
                                        "status": "CREATED"
                                    },
                                    {
                                        "id": "17",
                                        "title": "Defective Items Received",
                                        "date": "2024-12-07T14:13:18.489Z",
                                        "status": "CREATED"
                                    }
                                ]
                            }
                        }
                    }
#### service: Get Complaint Data by Id
- payload:
    ```json
                    {
                        "complaintId": 23
                    }
- expected Response/s:
    - Error
        ```json
                    {
                        "header": {
                            "errorCode": "E0055",
                            "errorDescription": "Missing Data",
                            "statusCode": "E0055",
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
                            "complaintDetails": {
                                "id": "23",
                                "title": "Not Responsive Supplier",
                                "type": "5",
                                "quotationId": "2",
                                "reviewerId": null,
                                "supplierId": "2",
                                "retailerId": "1",
                                "complaintNotes": "Supplier is not responding to any inquiries regarding sales",
                                "complaintStatus": "RESOLVED",
                                "submitterType": "RETAILER",
                                "creationDate": "2024-12-07T14:15:26.193Z",
                                "resolutionNotes": "DONE",
                                "isResolved": true
                            }
                        }
                    }
#### service: Get Related Quotations for Retailer (Id, Supplier)
- payload:
    ```json
                    {
                        "retailerId":11
                    }
- expected Response/s:
    - Error
      ```json
                    {
                        "header": {
                            "errorCode": "E0059",
                            "errorDescription": "Fetch Failure",
                            "statusCode": "E0059",
                            "message": "Fetching Quotation Actors has Failed"
                        },
                        "body": {
                            "details": {
                                "success": false,
                                "error": "Failed to Fetch Quotation Actors"
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
                            "quotationActors": {
                                "quotationItem": [
                                    {
                                        "quotationId": 2,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    },
                                    {
                                        "quotationId": 4,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    },
                                    {
                                        "quotationId": 5,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    },
                                    {
                                        "quotationId": 6,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    },
                                    {
                                        "quotationId": 7,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    },
                                    {
                                        "quotationId": 8,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    },
                                    {
                                        "quotationId": 9,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    },
                                    {
                                        "quotationId": 10,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    },
                                    {
                                        "quotationId": 11,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    },
                                    {
                                        "quotationId": 12,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    },
                                    {
                                        "quotationId": 14,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    },
                                    {
                                        "quotationId": 21,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    },
                                    {
                                        "quotationId": 22,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    },
                                    {
                                        "quotationId": 23,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    },
                                    {
                                        "quotationId": 25,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    },
                                    {
                                        "quotationId": 26,
                                        "supplierId": "1",
                                        "retailerId": "1"
                                    }
                                ]
                            }
                        }
                    }
#### service: Get Complaint Types
- payload: empty
- expected Response/s:
- Error
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
                "complaintTypes": [
                    {
                        "id": "1",
                        "type": "Payment Defaulted"
                    },
                    {
                        "id": "2",
                        "type": "Order not Complete"
                    },
                    {
                        "id": "3",
                        "type": "Order not Delivered"
                    },
                    {
                        "id": "4",
                        "type": "Defective Cargo"
                    },
                    {
                        "id": "5",
                        "type": "Aftersales Ineffeciency"
                    }
                ]
            }
        }
#### service: Create Complaint
- payload:
    ```json
                {
                    "complaintTitle": "Items Received are not in shape",
                    "complaintTypeId": 4,
                    "supplierId": 1,
                    "retailerId": 1,
                    "complaintNotes": "everything sucks",
                    "quotationId":2
                }
- expected Response/s:
    - Error
      ```json
                    {
                        "header": {
                            "errorCode": "E0062",
                            "errorDescription": "Creation Failure",
                            "statusCode": "E0062",
                            "message": "Creating Complaint has Failed"
                        },
                        "body": {
                            "details": {
                                "success": false,
                                "error": "Failed to Create Complaint"
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
                            "success": true
                        }
                    }
### PART 9 NOTIFICATIONS
#### service: get related notifications by retailerId
- payload:
    ```json
                {
                    "userId": "3",
                    "pageSize": 5,
                    "pageIndex": 1
                }
- expected Response/s:
    - Error
      ```json
                    {
                        "header": {
                            "errorCode": "E0064",
                            "errorDescription": "Fetch Failure",
                            "statusCode": "E0064",
                            "message": "Fetching Retailer Notifications has Failed"
                        },
                        "body": {
                            "details": {
                                "success": false,
                                "error": "Unable to Fetch Notifications for Retailer"
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
                            "notificationList": {
                                "notificationItem": [
                                    {
                                        "id": "13",
                                        "type": "10",
                                        "priority": 1,
                                        "subject": "Profile Updated",
                                        "details": "your profile has been updated!",
                                        "isRead": false,
                                        "creationTime": "2024-12-07T18:01:38.519Z"
                                    },
                                    {
                                        "id": "9",
                                        "type": "7",
                                        "priority": 1,
                                        "subject": "New Complaint Submitted",
                                        "details": "a Complaint has been Submitted regarding this Quotation: 2",
                                        "isRead": false,
                                        "creationTime": "2024-12-07T17:58:22.759Z"
                                    },
                                    {
                                        "id": "7",
                                        "type": "7",
                                        "priority": 1,
                                        "subject": "New Complaint Submitted",
                                        "details": "a Complaint has been Submitted regarding this Quotation: 2",
                                        "isRead": false,
                                        "creationTime": "2024-12-07T17:58:21.971Z"
                                    },
                                    {
                                        "id": "5",
                                        "type": "7",
                                        "priority": 1,
                                        "subject": "New Complaint Submitted",
                                        "details": "a Complaint has been Submitted regarding this Quotation: 2",
                                        "isRead": false,
                                        "creationTime": "2024-12-07T17:58:21.290Z"
                                    },
                                    {
                                        "id": "3",
                                        "type": "7",
                                        "priority": 1,
                                        "subject": "New Complaint Submitted",
                                        "details": "a Complaint has been Submitted regarding this Quotation: 2",
                                        "isRead": false,
                                        "creationTime": "2024-12-07T17:47:00.592Z"
                                    }
                                ]
                            }
                        }
                    }
### PART 10 GENERAL
#### service: update user data
- payload:
    ```json
                {
                    "user": {
                        "userId":140,
                        "nationalNumber": null,
                        "userStatus": 1,
                        "firstName": null,
                        "middleName": "Nihaaa",
                        "lastName": null,
                        "dateOfBirth": null,
                        "userAddress": null,
                        "userEmail": null,
                        "userPassword": null,
                        "isEmailVerified": null,
                        "userPhoneNumber": null,
                        "userImage": null
                    }
                }
- expected Response/s:
- Error
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
#### service: update Retailer data
- payload:
    ```json
                {
                    "retailerId": 1,
                    "retailerUserId": null,
                    "retailerTaxIdentificationNum": 6545645,
                    "retailerBankAccountNum": null,
                    "retailerIban": "JO94CBJO0010000000000131000008"
                }
- expected Response/s:
- Error
    ```json
                {
                    "header": {
                        "errorCode": "E0066",
                        "errorDescription": "Update Failure",
                        "statusCode": "E0066",
                        "message": "Updating Retailer Details has Failed"
                    },
                    "body": {
                        "details": {
                            "success": false,
                            "error": "Failed to Update Retailer Details"
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
                        "success": true
                    }
                }
#### service: get update RetailStore Data
- payload:
    ```json
                    {
                        "retailerId": 1,
                        "establishmentStatus": null,
                        "industryType": null,
                        "establishmentName": null,
                        "commercialRegistrationNum": null,    
                        "establishmentRegistrationDate": "2023-04-04",
                        "contactNumber": null,
                        "establishmentEmail": null,
                        "establishmentWebsite": null,
                        "establishmentDescription": null,
                        "establishmentCity": null,
                        "establishmentStreet": null,
                        "establishmentBuildingNum": null,
                        "establishmentLogo": "http://localhost:5055/uploads/images/default-1733679916980-324055511.png",
                        "establishmentCover": null,
                        "estComplianceIndicator": null,
                        "estComplianceIndicatorDesc": null
                    }
- expected Response/s:
    - Error
      ```json
                    {
                        "header": {
                            "errorCode": "E0067",
                            "errorDescription": "Update Failure",
                            "statusCode": "E0067",
                            "message": "Updating Retailstore Details has Failed"
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
#### service: get policies
front end level
#### service: logout
- payload: NONE
- expected Response/s:
    - Error
        ```json
                {
                    "header": {
                        "errorCode": "TOKEN_EXPIRED",
                        "errorDescription": "Authentication Failure",
                        "statusCode": "TOKEN_EXPIRED",
                        "message": "token is expired."
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
                        "message": "User successfully logged out"
                    }
                }



## SUPPLIER PART  [COMPLETION PERCENTAGE: 85%]

### PART 1 Signup
#### service: check user name is already in database
- payload:
    ```json
                {
                    "username": "supplier091224"
                }
- expected Response/s:
- Error
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
                        "isAvailable": true
                    }
                }
#### service: submit APPLICATION
- payload:
    ```json
                {
                    "userType": 2,
                    "firstName": "sample",
                    "lastName": "supplier",
                    "userName": "supplier091224",
                    "email": "hamnoi9991@gmail.com",
                    "password": "sudo9991",
                    "phoneNumber": "0770606067",
                    "establishmentName": "Smartech",
                    "establishmentContactNumber": "0770707076",
                    "establishmentEmail": "est.supp9991@mail.com",
                    "establishmentDescription": "sells Electronics",
                    "establishmentCommercialRegistrationNum": 878965321,
                    "establishmentCity": "Amman",
                    "establishmentStreet": "Abdali",
                    "establishmentBuildingNum": "C12",
                    "establishmentIndustryType": [
                        2
                    ],
                    "establishmentLogo": "http://localhost:5055/uploads/images/default-1733749653337-468698296.png"
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
#### service: is the most recent application approved, and username/email is in the database
#### service: forget password -> send an email with a unique code, listen to the user input new code, compare sent code and entered code 
if matching -> update password from payload if not -> handle error
- payload:
    ```json
    {
        "email": "hamnoi9991@gmail.com"
    }
- expected Response/s:
- Error
    ```json
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
#### service: Actual Login
- payload:
    ```json
    {
        "user": {
            "userName": "supplier091224",
            "userPassword": "Aff"
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
                    "error": "Invalid Credentials"
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
            "userId": "187",
            "userType": "2",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxODciLCJ1c2VyVHlwZSI6IjIiLCJ1c2VybmFtZSI6InN1cHBsaWVyMDkxMjI1IiwidG9rZW5WZXJzaW9uIjowLCJpYXQiOjE3MzM3NjM3MjksImV4cCI6MTczMzg1MDEyOX0.NTXj9G0NuOe-H76hut9DdoqCM1EI205dEI4RGn09D5I"
        }
    }
### PART 3 DASHBOARD Init
#### service: fetch user / supplier data,
#### service: get progress bar profile, user id returns percantge of completed data in terms of User / - Supplier-RETAILER
#### service: get progress bar establishment, returns percantge of completed data
#### service: Insights (postponed)
- payload:
    ```json
            {
                "userId": 187
            }
- expected Response/s:
    - Error
        ```json
            {
                "header": {
                    "errorCode": "E0069",
                    "errorDescription": "Fetch Failure",
                    "statusCode": "E0069",
                    "message": "Fetching Supplier Details has Failed"
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
                        "supplierDashboard": {
                            "userDetails": {
                                "nationalNumber": null,
                                "userName": "supplier091225",
                                "userType": "2",
                                "userStatus": "1",
                                "firstName": "sample",
                                "middleName": null,
                                "lastName": "supplier",
                                "dateOfBirth": null,
                                "userEmail": "hanoi09991@gmail.com",
                                "userPhone": "0740606067",
                                "userAddress": null,
                                "userImage": null
                            },
                            "supplierDetails": {
                                "supplierId": "9",
                                "supplierTaxIdentificationNumber": null,
                                "supplierBankAccountNumber": null,
                                "supplierIBAN": null,
                                "supplierComplianceIndicator": 1,
                                "supplierComplaintCount": 0
                            },
                            "factoryDetails": {
                                "factoryId": "38-9"
                            },
                            "establishmentDetails": {
                                "establishmentName": "Smartech",
                                "establishmentIndustryType": [
                                    "2"
                                ],
                                "establishmentStatus": "1",
                                "establishmentCommercialRegistrationNumber": "478905321",
                                "establishmentRegistrationDate": null,
                                "establishmentContactNumber": "0770004455",
                                "establishmentEmail": "est.sup9991@mail.com",
                                "establishmentWebsite": null,
                                "establishmentDescription": "sells Electronics",
                                "establishmentType": false,
                                "establishmentCity": "Amman",
                                "establishmentStreet": "Abdali",
                                "establishmentBuildingNumber": "12C",
                                "establishmentLogo": null,
                                "establishmentCover": null,
                                "establishmentComplianceIndicator": 1,
                                "establishmentComplianceIndicatorDescription": "GOOD"
                            },
                            "progressBarUser": {
                                "percentage": 75
                            },
                            "progressBarEstablishment": {
                                "percentage": 85
                            },
                            "insights": "To Be Done"
                        }
                    }
                }
### PART 4 MARKETPLACE SUPPLIER
#### service: Get all Products Paginated (filtered by Factory Categories (supplierId -> EstablishmentId -> IndustryTypes -> Categories - > Products))
- payload:
    ```json
        {
            "supplierId": 9,
            "pageSize": 5,
            "pageIndex": 1
        }
- expected Response/s:
- Error
    ```json
        {
            "header": {
                "errorCode": "E0071",
                "errorDescription": "Fetch Failure",
                "statusCode": "E0071",
                "message": "Fetching Supplier Marketplace has Failed"
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
                            "wholeSalePrice": null
                        },
                        {
                            "id": "4",
                            "name": "batata",
                            "description": "in_product_description",
                            "image": null,
                            "retailPrice": 1.2,
                            "unitPrice": 1,
                            "wholeSalePrice": 0.8
                        }
                    ]
                }
            }
        }
#### service: Search by product Category, product name,factory name (filtered by search term, page size, page index)
- payload:
    ```json
            {
                "searchTerm":"bata",
                "pageSize": 2,
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
                    "totalRecordsCount": "4"
                }
            }
### PART 5 PRODUCTS
#### service: Get all Products Paginated (supplierId)
done; sample to be provided
- payload:
    ```json
        {
            "supplierId": 9,
            "pageSize": 5,
            "pageIndex": 1
        }
- expected Response/s:
- Error
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
                "error": "No Data Found"
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
                "productsList": {
                    "productItem": [
                        {
                            "id": "7",
                            "status": "1",
                            "name": "Sample",
                            "description": "Test Product",
                            "image": "",
                            "retailPrice": 1.2,
                            "unitPrice": 0.8,
                            "wholeSalePrice": 1
                        }
                    ]
                }
            }
        }
#### service: Insert Product
done; sample to be provided
 - payload:
    ```json
            {
                "supplierId": 9,
                "productStatusId": 1,
                "productUnitPrice": 0.8,
                "productWholeSalePrice": 1,
                "productRetailPrice": 1.2,
                "productUnitPriceDiscount": 0,
                "productCategory": 1,
                "productDescription": "Test Product",
                "productImage": "",
                "productName": "Sample2"
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
                    "success": true
                }
            }
- service: Update Product
pending
 - payload:
    ```json
            {
                "productId": 1,
                "productStatusId": 2,
                "productUnitPrice": 3.5,
                "productWholeSalePrice": 1.5,
                "productRetailPrice": 3.5,
                "productUnitPriceDiscount": 0,
                "productCategory": 3,
                "productDescription": null,
                "productImage": null,
                "productName": "new Name"
            }
 - expected Response/s:
    - Error
        ```json
            {
                "header": {
                    "errorCode": "E0076",
                    "errorDescription": "Update Failure",
                    "statusCode": "E0076",
                    "message": "Updating Product has Failed"
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
#### service: GetQuotations List by Supplier (supplierId, page sized, page number)
qid, logo retailer, retailstore name, status
- payload:
    ```json
        {
            "supplierId": 1,
            "pageSize": 5,
            "pageIndex": 1
        }
- expected Response/s:
- Error
    ```json
        {
            "header": {
                "errorCode": "E0077",
                "errorDescription": "Fetch Failure",
                "statusCode": "E0077",
                "message": "Fetching Supplier Quotations has Failed"
            },
            "body": {
                "details": {
                    "success": false,
                    "error": "Failed to Fetch Quotations"
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
                "quotationsList": {
                    "quotationItem": [
                        {
                            "id": "26",
                            "logo": "http://localhost:5055/uploads/images/default-1733679916980-324055511.png",
                            "retailStoreName": "test",
                            "status": "REQUESTED"
                        },
                        {
                            "id": "25",
                            "logo": "http://localhost:5055/uploads/images/default-1733679916980-324055511.png",
                            "retailStoreName": "test",
                            "status": "REQUESTED"
                        },
                        {
                            "id": "23",
                            "logo": "http://localhost:5055/uploads/images/default-1733679916980-324055511.png",
                            "retailStoreName": "test",
                            "status": "REQUESTED"
                        },
                        {
                            "id": "22",
                            "logo": "http://localhost:5055/uploads/images/default-1733679916980-324055511.png",
                            "retailStoreName": "test",
                            "status": "REQUESTED"
                        },
                        {
                            "id": "21",
                            "logo": "http://localhost:5055/uploads/images/default-1733679916980-324055511.png",
                            "retailStoreName": "test",
                            "status": "REJECTED"
                        }
                    ]
                }
            }
        }
#### service: Get Quotation BY ID
    Quotation Details
    List Of Orders with default values
    other Quotation Fields like:
    total subtotal and shipping price
- payload:
    ```json
            {
                "quotationId":21
            }
- expected Response/s:
    - Error
        ```json
        {
            "header": {
                "errorCode": "E0048",
                "errorDescription": "Fetch Failure",
                "statusCode": "E0048",
                "message": "Fetching Quotation Details has Failed"
            },
            "body": {
                "details": {
                    "success": false,
                    "error": "Failed to Fetch Quotations"
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
                "quotationDetails": {
                    "id": "21",
                    "requesterId": "1",
                    "supplierId": "1",
                    "retailStore": "Sha",
                    "factory": "Aaa",
                    "requestDate": "2024-12-06T15:47:00.902Z",
                    "statusId": "5",
                    "details": {
                        "detailsItem": [
                            {
                                "price": 1,
                                "quantity": 4,
                                "productId": 1
                            }
                        ]
                    },
                    "attachments": null,
                    "paymentReferenceNumber": "PST241206f2bcfbb977c8a60cacb",
                    "reconciliationNumber": null,
                    "latestTransactionID": "14",
                    "shippingCost": null,
                    "subTotal": null,
                    "total": null,
                    "shipToAddress": "",
                    "billToAddress": "",
                    "factoryAddress": null,
                    "hasRelatedComplaints": 1
                }
            }
        }
#### service: Update Status Quotation (Reject)
- payload:
    ```json
                        {
                            "quotationId": 21,
                            "quotationStatusId": 5
                        }
- expected Response/s:
    - Error
        ```json
                        {
                            "header": {
                                "errorCode": "E0050",
                                "errorDescription": "Update Failure",
                                "statusCode": "E0050",
                                "message": "Updating Quotation Status has Failed"
                            },
                            "body": {
                                "details": {
                                    "success": false,
                                    "error": "Failed to Update Quotation Status"
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
                                "success": true
                            }
                        }
#### service: Update Status Quotation (Completed)
- payload:
     ```json
                        {
                            "quotationId": 21,
                            "quotationStatusId": 4
                        }
- expected Response/s:
    - Error
        ```json
                        {
                            "header": {
                                "errorCode": "E0050",
                                "errorDescription": "Update Failure",
                                "statusCode": "E0050",
                                "message": "Updating Quotation Status has Failed"
                            },
                            "body": {
                                "details": {
                                    "success": false,
                                    "error": "Failed to Update Quotation Status"
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
                                "success": true
                            }
                        }
#### service: Submit Quotation (changes Quotation Details, sets Total and subTotal)
- payload:
     ```json
            {
                "quotationId": 35,
                "details": {
                    "detailsItem": [
                        {
                            "productId": 1,
                            "quantity": 4,
                            "price": 1.5,
                            "orderId": "30"
                        },
                        {
                            "productId": 2,
                            "quantity": 4,
                            "price": 1,
                            "orderId": "29"
                        }
                    ]
                },
                "quotationAttachments": null,
                "shippingCost": 10,
                "subTotal": 2.5,
                "total": 12.5
            }
- expected Response/s:
    - Error
        ```json
                        {
                            "header": {
                                "errorCode": "E0078",
                                "errorDescription": "Update Failure",
                                "statusCode": "E0078",
                                "message": "Updating Quotation Details has Failed"
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
### PART 7 COMPLAINTS
#### service: Get Complaints by Supplier: (Supplierid, page size, page index) 
- payload:
     ```json
                        {
                            "supplierId":1,
                            "pageSize":5,
                            "pageIndex":1
                        }
- expected Response/s:
    - Error
        ```json
                        {
                            "header": {
                                "errorCode": "E0080",
                                "errorDescription": "Fetch Failure",
                                "statusCode": "E0080",
                                "message": "Fetching Complaints for Supplier has Failed"
                            },
                            "body": {
                                "details": {
                                    "success": false,
                                    "error": "Failed to Fetch Complaints"
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
                                "complaintsList": {
                                    "complaintItem": [
                                        {
                                            "id": "32",
                                            "title": "Items Received are not in shape",
                                            "date": "2024-12-07T17:58:22.754Z",
                                            "status": "CREATED"
                                        },
                                        {
                                            "id": "31",
                                            "title": "Items Received are not in shape",
                                            "date": "2024-12-07T17:58:21.966Z",
                                            "status": "CREATED"
                                        },
                                        {
                                            "id": "30",
                                            "title": "Items Received are not in shape",
                                            "date": "2024-12-07T17:58:21.276Z",
                                            "status": "CREATED"
                                        },
                                        {
                                            "id": "29",
                                            "title": "Items Received are not in shape",
                                            "date": "2024-12-07T17:47:00.580Z",
                                            "status": "CREATED"
                                        },
                                        {
                                            "id": "28",
                                            "title": "Items Received are not in shape",
                                            "date": "2024-12-07T17:44:07.375Z",
                                            "status": "CREATED"
                                        }
                                    ]
                                }
                            }
                        }
#### service: Get Complaint Data by Id
- payload:
     ```json
                        {
                            "complaintId": 32
                        }
- expected Response/s:
    - Error
        ```json
                        {
                            "header": {
                                "errorCode": "E0058",
                                "errorDescription": "Fetch Failure",
                                "statusCode": "E0058",
                                "message": "Fetching Complaint Details has Failed"
                            },
                            "body": {
                                "details": {
                                    "success": false,
                                    "error": "Failed to Fetch Complaint Details"
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
                                "complaintDetails": {
                                    "id": "32",
                                    "title": "Items Received are not in shape",
                                    "type": "4",
                                    "quotationId": "2",
                                    "reviewerId": null,
                                    "supplierId": "1",
                                    "retailerId": "1",
                                    "complaintNotes": "everything sucks",
                                    "complaintStatus": "CREATED",
                                    "submitterType": "RETAILER",
                                    "creationDate": "2024-12-07T17:58:22.754Z",
                                    "resolutionNotes": null,
                                    "isResolved": false
                                }
                            }
                        }
#### service: Get Related Quotations for Supplier (Id, Supplier)
- payload:
     ```json
                        {
                            "supplierId":1
                        }
- expected Response/s:
    - Error
        ```json
                        {
                            "header": {
                                "errorCode": "E0059",
                                "errorDescription": "Fetch Failure",
                                "statusCode": "E0059",
                                "message": "Fetching Quotation Actors has Failed"
                            },
                            "body": {
                                "details": {
                                    "success": false,
                                    "error": "Failed to Fetch Quotation Actors"
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
                                "quotationActors": {
                                    "quotationItem": [
                                        {
                                            "quotationId": 2,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 4,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 5,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 6,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 7,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 8,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 9,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 10,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 11,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 12,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 14,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 21,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 22,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 23,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 25,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 26,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        },
                                        {
                                            "quotationId": 35,
                                            "supplierId": "1",
                                            "retailerId": "1"
                                        }
                                    ]
                                }
                            }
                        }
#### service: Get Complaint Types
- payload: empty
- expected Response/s:
    - Error
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
                    "complaintTypes": [
                        {
                            "id": "1",
                            "type": "Payment Defaulted"
                        },
                        {
                            "id": "2",
                            "type": "Order not Complete"
                        },
                        {
                            "id": "3",
                            "type": "Order not Delivered"
                        },
                        {
                            "id": "4",
                            "type": "Defective Cargo"
                        },
                        {
                            "id": "5",
                            "type": "Aftersales Ineffeciency"
                        }
                    ]
                }
            }
#### service: Create Complaint
- payload:
    ```json
                    {
                        "complaintTitle": "Items Received are not in shape",
                        "complaintTypeId": 4,
                        "supplierId": 1,
                        "retailerId": 1,
                        "complaintNotes": "everything sucks",
                        "quotationId":2
                    }
- expected Response/s:
    - Error
      ```json
                    {
                        "header": {
                            "errorCode": "E0062",
                            "errorDescription": "Creation Failure",
                            "statusCode": "E0062",
                            "message": "Creating Complaint has Failed"
                        },
                        "body": {
                            "details": {
                                "success": false,
                                "error": "Failed to Create Complaint"
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
                            "success": true
                        }
                    }
### PART 8 NOTIFICATIONS
#### service: get related notifications by supplierId
- payload
    ```json
    {
        "userId": "2",
        "pageSize": 5,
        "pageIndex": 1
    }
- Expected Response
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
            "notificationList": {
                "notificationItem": [
                    {
                        "id": "30",
                        "type": "7",
                        "priority": 1,
                        "subject": "New Complaint Submitted",
                        "details": "a Complaint has been Submitted regarding this Quotation: 2",
                        "isRead": false,
                        "creationTime": "2024-12-11T13:27:51.824Z"
                    },
                    {
                        "id": "28",
                        "type": "9",
                        "priority": 1,
                        "subject": "Quotation has been Submitted By Supplier",
                        "details": "Quotation with ID: 35 has been Submitted by Supplier, Click to view Details",
                        "isRead": false,
                        "creationTime": "2024-12-11T12:54:14.992Z"
                    },
                    {
                        "id": "27",
                        "type": "9",
                        "priority": 1,
                        "subject": "Quotation has been Submitted By Supplier",
                        "details": "Quotation with ID: 35 has been Submitted by Supplier, Click to view Details",
                        "isRead": false,
                        "creationTime": "2024-12-11T12:43:49.293Z"
                    },
                    {
                        "id": "25",
                        "type": "8",
                        "priority": 2,
                        "subject": "Quotation has been Submitted By Supplier",
                        "details": "Quotation with ID: 35 has been Submitted by Supplier, Click to view Details",
                        "isRead": false,
                        "creationTime": "2024-12-11T12:42:30.846Z"
                    },
                    {
                        "id": "10",
                        "type": "7",
                        "priority": 1,
                        "subject": "New Complaint Submitted",
                        "details": "a Complaint has been Submitted regarding this Quotation: 2",
                        "isRead": false,
                        "creationTime": "2024-12-07T17:58:22.761Z"
                    }
                ]
            }
        }
    }
### PART 9 GENERAL
- service: update user data
done
- service: update Supplier data
pending
- service: update Factory Data + Cover
pending
- service: get policies
frontend level
- service: logout
done

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
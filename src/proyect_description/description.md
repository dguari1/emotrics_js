# Emotrics+
Prepared by: Diego L. Guarin

Emotrics+ is an AI-based software for facial analysis from photographs. Emotrics+ employs Facial Alignment algorithms to estimate the position of key facial landmarks in photographs of subjects performing different facial expressions, and uses these positions to assess facial function. 

Methods and results provided by Emotrics+ are based on peer-reviewed research studies, demonstrating that facial function can be evaluated from photographs, and that the measures provided by Emotrics+ agree with clinical assessments.
<!-- <details> -->
<summary> Examples of research studies describing and validating Emotrics+ </summary>

- Malka, R., Miller, M., Guarin, D., Fullerton, Z., Hadlock, T., & Banks, C. (2021). Reliability between in-person and still photograph assessment of facial function in facial paralysis using the eFACE facial grading system. Facial Plastic Surgery & Aesthetic Medicine, 23(5), 344-349.
- Miller, M. Q., Hadlock, T. A., Fortier, E., & Guarin, D. L. (2021). The Auto-eFACE: machine learning–enhanced program yields automated facial palsy assessment tool. Plastic and Reconstructive Surgery, 147(2), 467-474.
- Guarin, D. L., Yunusova, Y., Taati, B., Dusseldorp, J. R., Mohan, S., Tavares, J., ... & Jowett, N. (2020). Toward an automatic system for computer-aided assessment in facial palsy. Facial Plastic Surgery & Aesthetic Medicine, 22(1), 42-49.
- Guarin, D. L., Dusseldorp, J., Hadlock, T. A., & Jowett, N. (2018). A machine learning approach for automated facial measurements in facial palsy. JAMA facial plastic surgery, 20(4), 335-337.
<!-- </details> -->
<br>

Emotrics+ is currently distributed as a stand alone Windows program. The software's backend was written in ```Python``` and the UI was built using ```PyQt```. 
The objective of this statement of work is to describe the requirements (musts) to transform Emotrics+ into a web app that can be used by anyone with an internet connection. This document also describes additional features (wants) that would turn Emotrics+ into a more functional application with broader impact. 


We expect the final product to be a responsive, easy-to-use, and accurate web application that would make Emotrics+ **the** tool to assess facial function from photographs. 

## Statement of Work
Next, I will describe the different components that should be built as part of the development of the tool. This description will be based on the user's perspective, that is, I will try to provide a description from the user's perspective. 

#### Users:
Emotrics+ will have to type of users 
1. User -> someone using Emotrics+ to process their data and store results
2. Administrator (admin) -> Manager of Emotrics+ that has access to users data (UserID, name, institution), Code (source code), and models. The admin should be able to update the code source (and compile it to release a new version of Emotrics+) and the models. 

#### Components:
Emotrics+ will have the following main components:
1. UI -> User interface that takes care of all the user interactions, data upload (photographs), and displaying results
2. Users Database -> Database containing users information. The information that will be collected from users is:
   * UserID
   * Name
   * Institution
   * Last Access
```This database is accessible by the admin```
 
 3. Patients Database -> Database containing information stored by each user. The information to be stored are mostly ```[int]``` variables containing results from the analysis. The users can retrieve information from this database based on queries with keywords related to *PatientID* and *date*.
```This database is accessible by the each user only.```
4. Custom Metrics Database -> Database containing information regarding custom facial metrics designed by each user.
   ```This database is accessible by the each user only.```
5. Processing algorithms ->  ```Python``` code used to process each image and estimate results. The code will be hosted as a AWS Lambda Function and triggered based on requests by the UI.

6. ML models database ->  Machine Learning (ML) models used to process the images uploaded by users.

#### Tasks:
1. [want] Design and implement log-in page and connect it with authentication service. (AWS Cognito)
2. [want] Design and implement users database that the admin can access to verify number of active users
3. [want] Design and implement Patients Database and link the information stored in the database with each user (restricted access to each user only)
4. [must] Design and implement UI based on current implementation (available here: https://www.dropbox.com/s/cd2b636xe2hro00/Emotrics%2B%202-22-22.zip?dl=0)
5. [want] Implement new features in UI, including development of custom metrics based on landmarks
6. [must] Design, implement, and deploy AWS Lambda functions to process images (localize face in images -> find landmarks in face -> compute metrics based on landmarks). These functions must be independent as they can be triggered by different events. ML models are stored in a database that can be accessed by Lambda Function. 
7. [must] Connect AWS Lambda functions with UI so the functions can be triggered. 


#### User Stories

##### User processes one image
|Step|Description|Assumption|
|--|--|--|
|1. | User Opens Emotrics+ website | Welcome page is available | 
|2. | User login | Log in page exist and can retrieve data from authentication service |
|3. | User selects 'Process one Facial Expression' | - Page with multiple selections is available, - User is able to select one of the options   |  
|4. | User uploads one Image | User is able to select one image from the computer and upload it to Emotrics+| 
|5. | User provides additional information | User is able to provide additional information such as patient ID, expression (from a list), and reference side (left or right)| 
|6.a | Image is processed by AWS Lambda Function | AWS Lambda Functions are available and can be triggered from the UI | 
|6.b | User uploads landmarks and landmarks are processed by AWS Lambda Function | User is able to select a landmarks file from the computer and upload it to Emotrics+, AWS Lambda Functions are available and can be triggered from the UI | 
|7. | Results from AWS Lambda Function (facial landmarks and measurements) are received by UI | AWS Lambda Functions are able to process image and calculate facial metrics based on Facial Landmarks, Expression, and reference side  | 
|8. | User visualizes and modify Facial landmarks | Interactive page exists that presents image+landmarks and allows users to modify landmarks with  mouse clicks | 
|9. | User save changes to facial landmarks  | AWS Lambda Functions are available and can be triggered after user saves new landmarks positions | 
|10. | User visualizes facial measurements  | a table presenting facial metrics is available and can be accessed by the user | 
|11. | User visualizes facial scores  | a graphical display presenting facial scores is available and can be accessed by the user | 
|11. | User saves results  | a database to store patients results is available and users can save results (landmarks, measurements, scores) in the database  | 


##### User processes two images
|Step|Description|Assumption|
|--|--|--|
|1. | User Opens Emotrics+ website | Welcome page is available | 
|2. | User login | Log in page exist and can retrieve data from authentication service |
|3. | User selects 'Process two Facial Expressions' | - Page with multiple selections is available, - User is able to select one of the options   |  
|4. | User uploads two images | User is able to select two image from the computer and upload them to Emotrics+| 
|5. | User provides additional information | User is able to provide additional information such as patient ID, expressions (from a list), and reference side (left or right)| 
|6.a | Images are processed by AWS Lambda Function | AWS Lambda Functions are available and can be triggered from the UI | 
|6.b | User uploads landmarks and landmarks are processed by AWS Lambda Function | User is able to select a landmarks file from the computer and upload it to Emotrics+, AWS Lambda Functions are available and can be triggered from the UI | 
|7. | Results from AWS Lambda Function (facial landmarks and measurements) are received by UI | AWS Lambda Functions are able to process image and calculate facial metrics based on Facial Landmarks, Expression, and reference side  | 
|8. | User visualizes and modify Facial landmarks | Interactive page exists that presents image+landmarks and allows users to modify landmarks with  mouse clicks | 
|9. | User saves changes to facial landmarks  | AWS Lambda Functions are available and can be triggered after user saves new landmarks positions | 
|10. | User visualizes facial measurements  | a table presenting facial metrics is available and can be accessed by the user | 
|11. | User visualizes facial scores  | a graphical display presenting facial scores is available and can be accessed by the user | 
|11. | User saves results  | a database to store patients results is available and users can save results (landmarks, measurements, scores) in the database  | 
 
##### User processes seven images
|Step|Description|Assumption|
|--|--|--|
|1. | User Opens Emotrics+ website | Welcome page is available | 
|2. | User login | Log in page exist and can retrieve data from authentication service |
|3. | User selects 'Process two Facial Expressions' | - Page with multiple selections is available, - User is able to select one of the options   |  
|4. | User uploads seven Images | User is able to select two image from the computer and upload them to Emotrics+| 
|5. | User provides additional information | User is able to provide additional information such as patient ID, expressions (from a list), and reference side (left or right)| 
|6.a | Images are processed by AWS Lambda Function | AWS Lambda Functions are available and can be triggered from the UI | 
|6.b | User uploads landmarks and landmarks are processed by AWS Lambda Function | User is able to select a landmarks file from the computer and upload it to Emotrics+, AWS Lambda Functions are available and can be triggered from the UI | 
|7. | Results from AWS Lambda Function (facial landmarks and measurements) are received by UI | AWS Lambda Functions are able to process image and calculate facial metrics based on Facial Landmarks, Expression, and reference side  | 
|8. | User visualizes and modify Facial landmarks | Interactive page exists that presents image+landmarks and allows users to modify landmarks with  mouse clicks | 
|9. | User saves changes to facial landmarks  | AWS Lambda Functions are available and can be triggered after user saves new landmarks positions | 
|10. | User visualizes facial measurements  | a table presenting facial metrics is available and can be accessed by the user | 
|11. | User visualizes facial scores  | a graphical display presenting facial scores is available and can be accessed by the user | 
|11. | User saves results  | a database to store patients results is available and users can save results (landmarks, measurements, scores) in the database  | 

##### User Visualizes Results Stored in Database
|Step|Description|Assumption|
|--|--|--|
|1. | User Opens Emotrics+ website | Welcome page is available | 
|2. | User login | Log in page exist and can retrieve data from authentication service |
|3. | User selects 'View Previous Results' | - Page with multiple selections is available, - User is able to select one of the options   |  
|4. | User search database with Patient ID | A database storing patient information and results is available. The database can be queried based on patient ID and date| 
|5. | User selects results from a one Patient ID based on date | Information from the database can be retrieved| 
|6. | User visualizes facial measurements  | a table presenting facial metrics is available and can be accessed by the user | 
|7. | User visualizes facial scores  | a graphical display presenting facial scores is available and can be accessed by the user | 





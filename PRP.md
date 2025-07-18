Product Requirements Prompt (PRP)
Title: Azure SPA with Public Form Submission to Dataverse via DevOps
1. 🧭 Objective
Build a responsive Single Page Application (SPA) hosted in Azure that allows public users to submit a form, with the data securely written to Microsoft Dataverse. The app must support CI/CD via Azure DevOps and apply context engineering to ensure maintainability, traceability, and AI-assisted development.
2. 🧱 Functional Requirements
Feature	Description
Public Form Access	Allow unauthenticated users to submit a form (e.g. feedback, contact, registration).
Secure Submission	Use backend services (Power Automate or Azure Function) to validate and write data to Dataverse.
Frontend	React-based SPA with pages: Home, Contact, Blog, Form. Responsive layout with sticky header and footer.
All pages must be created with the solution
All pages will have the same header and footer (including new pages)
Use this file as a reference: https://dev.azure.com/MurphysLawDev/_git/Murphys%20Law?path=/index.html&version=GBmain
Dataverse Integration	Form data is written to a custom Dataverse table.
DevOps Integration	Source code hosted in Azure DevOps. CI/CD pipeline for build and deployment.
Context Engineering	Use structured metadata, reusable flows, and documented schemas to support AI tooling.
3. 🛠️ Technical Stack
•	Frontend: React, HTML5, CSS3
•	Backend: Power Automate or Azure Function (Node.js or C#)
•	Dataverse: Custom table with fields for name, email, message, timestamp
•	DevOps: Azure DevOps repo, YAML pipeline, environment variables
•	Hosting: Azure Static Web Apps or Azure App Service
4. 🔐 Security & Access
User Type | Access Level
-----------|--------------
Public | Can submit form data
Backend | Validates and writes to Dataverse securely
•	Use Managed Identity or service principal for backend access
•	Validate form inputs to prevent spam or injection
•	Store secrets in Azure Key Vault or environment variables
5. 📦 Deliverables
•	Git repo with SPA source code and pipeline YAML
•	Power Automate flow `.zip` or Azure Function deployment package
•	Dataverse schema export
•	README with setup instructions and context documentation
6. 🧠 Context Engineering Notes
•	Include a `context/` folder in the repo with:
•	  - `examples/`: sample form submissions
•	  - `rules/`: validation logic and naming conventions
•	  - `prompts/`: Copilot or AI usage examples
•	Use consistent naming across frontend, backend, and Dataverse
•	Document all flows and schemas in markdown for AI readability

7. 🧠 Design requirements
•	

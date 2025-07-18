# 365 Evergreen - Azure Web Application

A modern, responsive website for 365 Evergreen, a Microsoft 365 & Power Platform consultancy based in Australia. This application showcases the company's services and expertise in helping businesses unlock productivity through Microsoft technologies.

## Features

- **Modern Design**: Clean, professional interface built with Tailwind CSS
- **Responsive Layout**: Mobile-first design that works on all devices
- **Azure Static Web Apps**: Deployed using Azure Static Web Apps for optimal performance
- **Application Insights**: Integrated monitoring and analytics
- **Secure**: Uses Azure Key Vault for secure configuration management

## Architecture

This application uses the following Azure services:

- **Azure Static Web Apps**: Hosting for the static website
- **Application Insights**: Application performance monitoring
- **Log Analytics Workspace**: Centralized logging
- **Azure Key Vault**: Secure storage for configuration secrets

## Getting Started

### Prerequisites

- Azure CLI (`az`)
- Azure Developer CLI (`azd`)
- An Azure subscription

### Installation

1. Clone this repository
2. Navigate to the project directory
3. Run `azd init` to initialize the project
4. Run `azd up` to provision resources and deploy

### Development

The website is built using:
- HTML5 with semantic markup
- Tailwind CSS for styling
- Vanilla JavaScript for interactivity
- Modern responsive design principles

### Deployment

This project uses Azure Developer CLI (azd) for deployment:

```bash
# Initialize the project
azd init

# Deploy to Azure
azd up

# View application logs
azd logs

# Clean up resources
azd down
```

## Project Structure

```
├── index.html          # Main website file
├── azure.yaml          # Azure Developer CLI configuration
├── infra/              # Infrastructure as Code
│   ├── main.bicep      # Main Bicep template
│   └── main.parameters.json # Parameters file
└── README.md           # This file
```

## Services Offered

365 Evergreen specializes in:

- Microsoft 365 implementation and optimization
- Power Platform development and automation
- Digital transformation consulting
- Training and support services
- Custom business solutions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For more information about 365 Evergreen services, visit our website or contact us directly.
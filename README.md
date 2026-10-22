# AI-Powered Workplace Productivity Assistant

## Project Overview

The **AI-Powered Workplace Productivity Assistant** is a responsive web
application designed to help users organise work, get assistance with
workplace questions, and research information more efficiently. It uses
a clean, professional black-and-white dashboard that works across
desktop and mobile screens.

The application focuses on three productivity tools: an interactive AI
chatbot, an AI task planner, and an AI research assistant.

## Features Implemented

-   **Dashboard:** Central workspace with navigation to the main
    productivity tools.
-   **AI Chatbot:** Interface for entering workplace prompts and viewing
    assistant responses.
-   **AI Task Planner:** Helps organise tasks and create daily or weekly
    schedules using task details, deadlines, priorities, and available
    time.
-   **AI Research Assistant:** Supports summarising user-provided text
    and presenting key findings, insights, and recommendations.
-   **Responsive UI:** Layout adapts to desktop and mobile screen sizes.
-   **Responsible AI notice:** Reminds users that AI-generated
    information may be inaccurate and should be reviewed.

> **Implementation note:** The availability of genuine AI-generated
> responses depends on a working AI model integration and its
> configuration. Only describe a feature as fully implemented after
> testing it in the running application. If a tool uses sample or demo
> responses, label it clearly as demo mode.

## Technologies and Tools Used

-   **Lovable:** AI-assisted application building and UI development.
-   **Markdown:** Project documentation.
-   **GitHub:** Source-code hosting and version control.
-   **Frontend framework and styling:** Use the framework and styling
    tools present in the generated project; check the project files
    (such as `package.json`) for exact versions and dependencies.
-   **AI integration:** A supported AI model or managed integration, if
    configured for the project.

## Setup Instructions

### Prerequisites

-   A GitHub account and access to this repository.
-   The runtime and package manager required by the generated project
    (for example, Node.js and npm if it is a JavaScript project).
-   AI provider access and configuration, if the application uses a real
    AI service.

### Run Locally

1.  Clone the repository:

    ``` bash
    git clone <YOUR_REPOSITORY_URL>
    ```

2.  Change into the project directory:

    ``` bash
    cd <YOUR_PROJECT_DIRECTORY>
    ```

3.  Install dependencies using the package manager for the project. For
    an npm-based project:

    ``` bash
    npm install
    ```

4.  Configure any required AI integration according to the provider's
    documentation. Do not commit API keys or other secrets to GitHub.
    Use secure environment configuration supported by the project and
    deployment platform.

5.  Start the development server using the script defined in the
    project's `package.json`. For many Vite-based projects, the command
    is:

    ``` bash
    npm run dev
    ```

6.  Open the local URL shown in the terminal and test the dashboard and
    each productivity tool.

> The exact commands may differ depending on the framework Lovable
> generated. Check `package.json` and the project's setup notes before
> running commands.

## Responsible AI and Privacy

-   AI-generated responses can be inaccurate or incomplete; review them
    before relying on them.
-   Do not submit confidential workplace information or personal data
    unless the service has been approved for that use.
-   Never expose secret API keys in frontend code or commit them to the
    repository.
-   Do not claim that external research was performed unless the
    application actually accessed external sources.

## Project Scope

This project includes the AI Chatbot, AI Task Planner / Scheduler, and
AI Research Assistant. A custom backend, database, authentication
system, email generator, and meeting-notes summariser are outside the
intended scope unless added separately.

## License

No license has been specified. Add a `LICENSE` file if you want to
define how others may use, modify, and distribute this project.

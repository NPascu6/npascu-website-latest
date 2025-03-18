export const MavXCard = () => {
    return <div className="shadow-xl p-3 m-2 card">
        <h2 className="text-xl font-semibold">Senior Software Engineer (Full Stack)</h2>
        <p className="">MAVERIX Securities AG - Zurich, Switzerland</p>
        <p className="">On site</p>
        <ul className="list-disc ml-6 mt-4">
            <li>Building and maintaining micros-services for internal data management.</li>
            <li>
                Building and maintaining .Net: C# and F# components.
            </li>
            <li>Maintaining internal grpc communication.</li>
            <li>Building and maintaining UI components created for dedicated Vue front end application.</li>
            <li>Building and maintaining inter-service communication using Fake poling, Marten and Kafka.</li>
            <li>Created tools for importing and exporting data from csv.</li>
            <li>Building and maintaining data migration, alteration and enhancements using sql scripts.</li>
            <li>Managing release process and deployment process.</li>
        </ul>
        <p className="mt-4">
            <strong>Technology Stack:</strong> .NET 9, C#, F#, SQL, Postgres, Marten, GRPC, Nuxt and Vue.js.
        </p>
        <p>
            <strong>Workflow:</strong> Clickup for Task tracking, working in a kanban / priority approach with dedicated engineers per department.
        </p>
        <p>
            <strong>CI/CD:</strong> Gitlab, Nomad, Neko, Keysore Vault for secret and env manangement.
        </p>
    </div>
}

export const FintamaCard = () => {
    return (
        <div className="shadow-xl p-3 m-2 card">
            <h2 className="text-xl font-semibold">Senior Software Developer</h2>
            <p className="">Fintama AG - Zurich, Switzerland</p>
            <p className="">External to Bank Julius Bar</p>
            <ul className="list-disc ml-6 mt-4">
                <li>Building and maintaining minimal api's in JAVA.</li>
                <li>Building and maintaining UI features in React 17.</li>
                <li>
                    Building and maintaining UI npm internal component library for JB
                    using Rollup for bundling and Storybook for presentation.
                </li>
                <li>Migrating Material UI 5 to 6.</li>
                <li>
                    Refactoring react-query, rxjs, and epic middleware (all in one
                    project) to use simple Redux-thunk API calls.
                </li>
                <li>Refactored routing for internal components to be lazy loaded.</li>
                <li>
                    Negotiated DTO interface between Front-End components and Back-End
                    components.
                </li>
                <li>
                    Set up inter IFrame component communication for callbacks between
                    components.
                </li>
            </ul>
            <p className="mt-4">
                <strong>Technology Stack:</strong> React 17, 18, Material UI 4, 5, 6,
                rxjs, react-query, redux, epic middleware, Rollup, npm, Storybook.
            </p>
            <p>
                <strong>Sprint:</strong> Jira, Two-week iterations. Part of a team of 14
                working on two major backoffice components.
            </p>
            <p>
                <strong>CI/CD:</strong> Octopus, Bitbucket, Internal npm registry.
            </p>
            <p>
                <strong>Back End:</strong> Java, also React apps are compiled within
                java.jar to communicate between IFrame components.
            </p>
        </div>
    );
};

export const CovarioCard = () => {
    return (
        <div className=" shadow-xl p-3 m-2 card">
            <h2 className="text-xl font-semibold">
                Team Lead / Senior Software Developer
            </h2>
            <p className="">Covario AG - Zug, Switzerland</p>
            <ul className="list-disc ml-6 mt-4">
                <li>Building and maintaining UI features using React.js.</li>
                <li>
                    Building and maintaining UI connections to SignalR live data feed.
                </li>
                <li>
                    Documenting and analyzing UI technical requirements for Online Trading
                    Platform.
                </li>
                <li>
                    Responsible for creating and coordinating tickets regarding UI
                    features.
                </li>
                <li>
                    Creating and maintaining an administrative portal to manage parts of
                    the business logic individually.
                </li>
                <li>Creating and maintaining internal UI tools.</li>
                <li>
                    Understanding business requirements, investigating, and tackling
                    business challenges that the real-time data feed produces for
                    front-end applications.
                </li>
                <li>
                    Translating Crypto Venues API and translating it to the internal
                    middle office structure.
                </li>
                <li>
                    Creating and maintaining a semi-automated order settlement process.
                </li>
                <li>
                    Merging and deploying test and production versions of the web
                    applications.
                </li>
                <li>
                    Building and maintaining an Openfin trading app. (Openfin is something
                    like Electron on which the container is based).
                </li>
            </ul>
            <p className="mt-4">
                <strong>Technology Stack:</strong> .Net Core, React 17, 18, Material UI
                5, 6. Rxjs, Redux-Thunk, C#, SignalR, AgGrid, Material UI, Openfin.
            </p>
            <p>
                <strong>DevOps:</strong> Docker, Kubernetes.
            </p>
            <p>
                <strong>CI/CD:</strong> Gitlab (used for ticketing and SCRUM board
                management).
            </p>
        </div>
    );
};

export const AmarisCard = () => {
    return (
        <div className="shadow-xl p-3 m-2 card">
            <h2 className="text-xl font-semibold">
                Information Technology Consultant / Full Stack Developer
            </h2>
            <p className="">Amaris Consulting - Zurich, Switzerland</p>
            <ul className="list-disc ml-6 mt-4">
                <li>
                    Development of .NET Core API with CRUD features, for the purpose of
                    getting and sending data to an SQL Server, using Entity Framework Code
                    First with Repository design pattern.
                </li>
                <li>
                    Development of CRUD features (front-end), using Vue JS, with Vuetify
                    as a reusable component-based progressive web application.
                </li>
                <li>Creating and editing storyboards, tasks in Azure DevOps.</li>
                <li>
                    Creating and editing releases of the .NET Core application using Azure
                    DevOps.
                </li>
                <li>
                    Consulting the Client in the process of preparing the data needed for
                    the application.
                </li>
                <li>
                    Consulting the Client on building the connections between data models
                    within the business.
                </li>
                <li>
                    Designing and maintaining data upload feature from CSV to SQL
                    database.
                </li>
                <li>
                    Implementing UX features such as change tracking and state reset.
                </li>
                <li>
                    Implementing and maintaining custom JS components for UX purposes.
                </li>
                <li>
                    Creating a demo of implemented changes within a Sprint, to the client.
                </li>
            </ul>
            <p className="mt-4">
                <strong>Technology Stack:</strong> .Net 5, Vue 2, Vuetify, Vuex.
            </p>
        </div>
    );
};

export const CognizantCard = () => {
    return (
        <div className=" shadow-xl p-3 m-2 card">
            <h2 className="text-xl font-semibold">Software Developer</h2>
            <p className="">Cognizant Softvision - Cluj Napoca, Romania</p>
            <ul className="list-disc ml-6 mt-4">
                <li>TDD with focus on business layer Unit Tests.</li>
                <li>Creating and maintaining API features.</li>
                <li>Creating and maintaining UI features.</li>
                <li>SQL database development and maintenance.</li>
                <li>
                    .NET Framework, MVC with Unit of Work and Repository Design Pattern.
                </li>
                <li>Windows Services for updating and maintaining data consistency.</li>
                <li>Vue.js as JavaScript framework.</li>
                <li>Cross-platform, mobile, and web development.</li>
                <li>
                    Creating and maintaining UI / UX features in React Native as a proof
                    of concept in migrating React web app code into React Native mobile
                    app.
                </li>
                <li>
                    Controlling a unified Redux flow within two different apps with the
                    same store base.
                </li>
            </ul>
            <p className="mt-4">
                <strong>Technology Stack:</strong> React 16, .Net 5, Vue 1, 2, Redux,
                React-Native with Redux-Saga.
                <br/>
                <strong>Node.js as server-side technology.</strong>
            </p>
        </div>
    );
};

export const BoschCard = () => {
    return (
        <div className=" shadow-xl p-3 m-2 card">
            <h2 className="text-xl font-semibold">Software Development Engineer</h2>
            <p className="text-sm ">
                Bosch Automotive Service Solutions, LLC - Cluj Napoca, Romania
            </p>
            <ul className="text-sm mt-2">
                <span className="font-semibold">Responsibilities:</span>
                <ul className="list-disc ml-8">
                    <li>
                        Tool Development: Full Stack Web Applications using the .Net
                        Framework. C#, MVC, VueJS and React, and refactoring Vanilla JS or
                        jQuery code.
                    </li>
                    <li>
                        Handling deployment and release of new versions of .NET-based web
                        applications.
                    </li>
                    <li>
                        Data visualization and management, web-based software, implemented
                        and maintained using React and Node.js.
                    </li>
                    <li>
                        SQL Database and Web Service Development, Windows Server management,
                        handling of deployments and releases.
                    </li>
                    <li>
                        JIRA Setup and Configuration for Software Development Cycle.
                        Creating and maintaining the agile environment.
                    </li>
                    <li>
                        Creating and customizing tools for other software developers to
                        simplify and improve the speed of developing embedded or model-based
                        software.
                    </li>
                </ul>
            </ul>
        </div>
    );
};

export const DVSECard = () => {
    return (
        <div className=" shadow-xl p-3 m-2 card">
            <h2 className="text-xl font-semibold">Web Developer</h2>
            <p className="text-sm ">DVSE GmbH - Targu Mures, Romania</p>
            <div className="text-sm mt-2">
                <span className="font-semibold">Responsibilities:</span>
                <ul className="list-disc ml-8">
                    <li>
                        Bug fixing and feature development for Web-Based Applications.
                    </li>
                    <li>CSS and JS refactoring.</li>
                    <li>
                        Creating and maintaining features within the .NET MVC framework,
                        using Entity Framework and Knockout.js, and basic Angular.js
                        features.
                    </li>
                    <li>
                        Implementing and maintaining new features with React.js and Redux,
                        following the MVC/MVVM design pattern on back-end services.
                    </li>
                </ul>
            </div>
        </div>
    );
};

export const ItSupportTechnicianCard = () => {
    return (
        <div className=" shadow-xl p-3 m-2 card">
            <h2 className="text-xl font-semibold">IT Support Technician</h2>
            <p className="text-sm ">
                New Vision Technologies Inc. - Targu Mures, Romania
            </p>
            <div className="text-sm mt-2">
                <span className="font-semibold">Responsibilities:</span>
                <ul className="list-disc ml-8">
                    <li>
                        Basic troubleshooting of applications and personalizing them to the
                        specifications of the client.
                    </li>
                    <li>
                        Setting up and maintaining personal applications for specific users,
                        including AutoCAD, Photoshop, Canon photography, and Microsoft
                        Office applications.
                    </li>
                    <li>Administrating Active Directory and Exchange servers.</li>
                    <li>Basic website administration.</li>
                    <li>Troubleshooting and fixing networking issues.</li>
                    <li>
                        Scripting for generating and deleting new users (self-implemented).
                    </li>
                    <li>
                        Basic DevOps for deploying and maintaining simple web applications.
                    </li>
                    <li>Administrating 3COM phones.</li>
                </ul>
            </div>
        </div>
    );
};

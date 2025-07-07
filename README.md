# Application mobile SwAppart

This repo contains the mobile app from the SwAppart project.

It has been developped and tested with android devices. IOS devices should be supported with react native but hasn't been tested.

## Requirements

- yarn
- an android device or emulator

## Usage

1. Install the dependencies with `yarn install`
2. Start the expo server with `yarn start`
   > There is multiple ways to start the server, check the package.json for more information.

## Contributing

To contribute to the project, create a new branch with the name of the feature and make a pull request to the `main` branch when the work is done.

### Linting and Type Checking

To ensure code quality, the project uses ESLint and TypeScript for linting and type checking.

You can run then using `yarn lint` and `yarn typecheck`.

A pre-commit hook has been configured in order to verify the linting/formatting and the typing of the project. \
To set it up, run `yarn install` and `yarn prepare` to cnfigure the repo and the pre-commit hook.

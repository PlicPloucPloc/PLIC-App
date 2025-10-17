# Application mobile SwAppart

This repo contains the mobile app from the SwAppart project.

It has been developped and tested with android devices. IOS devices should be supported with react native but hasn't been tested.

## Requirements

- yarn
- an android device or emulator
- expo go sdk 50

## Usage

1. Install the dependencies with `yarn install`
2. Copy the `.env` template file to `.env.local` and fill the variables
  > EXPO_PUBLIC_API_URL should point to the backend gateway. \
  > EXPO_PUBLIC_S3_URL should point to the S3 bucket used to store images.

  > IMPORTANT: The ip address used in the variables should not be localhost, use your machine's local network ip address instead. \
  > You machine and your device should be on the same network.
3. Start the expo server with `yarn start`
   > There is multiple ways to start the server, check the package.json for more information.

## Contributing

To contribute to the project, create a new branch with the name of the feature and make a pull request to the `main` branch when the work is done.

### Linting and Type Checking

To ensure code quality, the project uses ESLint and TypeScript for linting and type checking.

You can run then manually using `yarn lint` and `yarn typecheck`.

# SwAppart Mobile App

The **SwAppart Mobile App** is part of the SwAppart project — a platform designed to simplify student to find their apartment.

This project is the frontend of the **PLIC** project from the MTI major at EPITA.

This React Native app (built with Expo) allows users to find an apartment, view locations on maps, and communicate with other users seamlessly.

> Developed primarily for Android devices. iOS support is expected via React Native but hasn’t been tested yet.

## Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Available Scripts](#available-scripts)

## Requirements

Before running the app, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/)
- An **Android** device or emulator
- Optional: **iOS simulator** (for testing iOS compatibility)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ellmos/PLIC-App.git
   cd PLIC-App
   ```

2. Install dependencies:
   ```bash
    yarn install
    ```

3. Configure the environment\
    See the [Configuration](#configuration) section below.

4. Start the app\
    See the [Running the App](#running-the-app) section below.

# Configuration

1. Install the dependencies with `yarn install`
2. Copy the `.env` template file to `.env.localdev` and fill the variables
  > EXPO_PUBLIC_API_URL should point to the backend gateway. \
   EXPO_PUBLIC_S3_URL should point to the S3 bucket used to store images.
  > > IMPORTANT: The ip address used in the variables should not be localhost, use your machine's local network ip address instead. \
  You machine and your device should be on the same network.

  > EXPO_PUBLIC_GOOGLE_API_KEY a google map api key with the following APIs enabled:
  > > - Geocoding
  > > - Maps SDK for Android
  > > - Places API (New)


3. Start the expo server with `yarn start:localdev`
   > There is multiple ways to start the server, check the package.json for more information.


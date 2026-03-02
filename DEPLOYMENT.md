# Deployment Instructions for Telegram HR Bot on Render

This document provides detailed instructions for deploying the Telegram HR Bot on the Render platform.

## Pre-requisites

1. **Render Account**: Ensure you have a Render account. If you don't have one, sign up at [Render](https://render.com).
2. **Bot Token**: Obtain your Telegram bot token from [BotFather](https://t.me/botfather).
3. **Git Repository**: Your bot code should be hosted in a Git repository.

## Steps to Deploy

### Step 1: Create a New Web Service on Render

1. Log in to your Render account.
2. Click on the **New** button and select **Web Service**.
3. Connect your GitHub account if you haven't already.
4. Select the repository where your Telegram HR bot is hosted.

### Step 2: Configure the Web Service

1. **Name**: Provide a name for your web service.
2. **Environment**: Select `Node` (or the appropriate environment for your bot).
3. **Branch**: Choose the branch that contains your bot code (commonly `main`).
4. **Build Command**: If your bot uses Node.js, you can typically use `npm install`.
5. **Start Command**: Use `npm start` or the appropriate command to run your bot.
6. **Instance Type**: Choose the instance type based on your expected load.

### Step 3: Set Environment Variables

1. Locate the **Environment** tab in your service settings.
2. Add a new variable for your bot token:
   - **Key**: `TELEGRAM_BOT_TOKEN`
   - **Value**: Paste your bot token here.
3. You can add any other required environment variables in the same way.

### Step 4: Deploy the Bot

1. After configuration, click **Create Web Service** to initiate deployment.
2. Render will automatically build and deploy your service based on the configurations you have set.
3. Monitor the logs in the dashboard for any errors during the build or deployment process.

### Step 5: Testing

1. After deployment is complete, test your bot by sending a message to it in Telegram.
2. Ensure all functionalities are working as expected.

### Additional Notes
- Ensure your bot code is structured properly to handle environment variables.
- Refer to Render's documentation for troubleshooting any deployment issues.

## Conclusion

You have successfully deployed your Telegram HR Bot on the Render platform!
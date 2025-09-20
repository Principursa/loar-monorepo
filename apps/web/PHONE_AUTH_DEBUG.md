# Phone Authentication Debug Guide

## Current Issue
Phone authentication is not working despite using a US phone number.

## Debugging Steps

### 1. Check Console Output
Look for these debug messages in the browser console:
- `🧪 CDP Configuration Test:` - Shows if environment variables are loaded
- `📱 SMS Authentication Config:` - Shows SMS configuration
- `📱 Phone Authentication Details:` - Shows phone number details when user exists
- `🔐 Authentication Method Debug:` - Shows authentication method details

### 2. Verify Phone Number Format
Your US phone number should be in format: `+1XXXXXXXXXX`
- Must start with `+1`
- Must be 12 digits total (including country code)
- Example: `+15551234567`

### 3. Check CDP Project Settings
In your Coinbase CDP dashboard:
1. Go to your project: `8c87112e-15eb-41d7-8f7f-258e3a4f0c80`
2. Check if SMS authentication is enabled
3. Verify the project is configured for US phone numbers
4. Check if there are any rate limits or restrictions

### 4. Test Authentication Flow
1. Click the CDP Auth Button
2. Select "SMS" option
3. Enter your US phone number with +1 prefix
4. Check console for any error messages
5. Look for SMS delivery

### 5. Common Issues
- **Phone number format**: Must be `+1XXXXXXXXXX`
- **Project settings**: SMS might not be enabled in CDP dashboard
- **Rate limits**: Too many attempts might block SMS
- **Network issues**: SMS delivery might be delayed

### 6. Debug Commands
Click the "Debug" button in the UI to see detailed state information.

## Next Steps
1. Try phone authentication again
2. Check console for new debug messages
3. Verify phone number format
4. Check CDP project settings in dashboard

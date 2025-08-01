#!/bin/bash

# Endpoint URL
API_URL="http://localhost:3000/api/wallet/transfer"

# Prompt for JWT token
read -p "Enter your JWT token: " TOKEN

# Prompt for recipient's account number
read -p "Enter recipient account number: " RECIPIENT_ACCOUNT

# Prompt for amount (optional default = 1000)
read -p "Enter amount to transfer (default: 1000): " AMOUNT
AMOUNT=${AMOUNT:-1000}  # Default if blank

# Send transfer request
curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"recipientAccount\": \"$RECIPIENT_ACCOUNT\",
    \"amount\": $AMOUNT
  }" | jq


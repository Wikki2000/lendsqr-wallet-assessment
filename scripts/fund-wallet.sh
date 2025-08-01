#!/bin/bash

# Endpoint URL
API_URL="http://localhost:3000/api/wallet/fund"

# Prompt user for JWT token
read -p "Enter your JWT token: " TOKEN

# Prompt for funding amount (optional default = 5000)
read -p "Enter amount to fund (default: 5000): " AMOUNT

read -p "Enter your IdempotencyKey: " IDEMPOTENCY_KEY

AMOUNT=${AMOUNT:-5000}  # Use entered amount or default

# Send the request
curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": $AMOUNT,
    \"idempotencyKey\": $IDEMPOTENCY_KEY
  }" | jq

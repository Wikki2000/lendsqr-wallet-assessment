#!/bin/bash

API_URL="http://localhost:3000/api/wallet/withdraw"

read -p "Enter your JWT token: " TOKEN
read -p "Enter amount to withdraw: " AMOUNT
read -p "Enter unique idempotency key: " IDEMPOTENCY_KEY

curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": $AMOUNT,
    \"idempotencyKey\": \"$IDEMPOTENCY_KEY\"
  }" | jq


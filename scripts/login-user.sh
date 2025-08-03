#!/bin/bash

API_URL="http://localhost:3000/api/account/login"

curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
  "password": "12345aA@",
  "userName": "wikki",
}' | jq


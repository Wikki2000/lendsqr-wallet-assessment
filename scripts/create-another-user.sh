#!/bin/bash

# Script to create a test user via API

API_URL="http://localhost:3000/api/users"

# Sample user data (modify as needed)
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "abigail",
    "password": "12345aA@",
    "firstName": "Moses",
    "lastName": "Doe",
    "email": "moses.doe@example.com",
    "phone": "+2348012345678"
  }' | jq

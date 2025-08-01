#!/bin/bash

# Script to create a test user via API

API_URL="http://localhost:3000/api/users"

# Sample user data (modify as needed)
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "wikki",
    "password": "12345aA@",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+2348012345678"
  }' | jq

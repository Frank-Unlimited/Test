#!/bin/sh

# Create env-config.js with runtime environment variables
cat <<EOF > /usr/share/nginx/html/env-config.js
window.ENV = {
  GEMINI_API_KEY: "${GEMINI_API_KEY}"
};
EOF

# Start nginx
exec nginx -g 'daemon off;'

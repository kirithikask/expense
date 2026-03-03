$envContent = "MONGO_URI=mongodb+srv://kirithika:Kiru@123@cluster0.wvtthjq.mongodb.net/?appName=Cluster0`nJWT_SECRET=your_jwt_secret_key_here"
Set-Content -Path ".env" -Value $envContent
Write-Host "Updated .env file:"
Get-Content ".env"


@echo off
echo Testing Docker build...
echo.
echo Make sure Docker Desktop is running!
echo.

docker build -t bloom-app:test .

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build successful!
    echo.
    echo To run the container:
    echo docker run -p 8080:80 -e GEMINI_API_KEY=your_api_key_here bloom-app:test
    echo.
    echo Then open http://localhost:8080
) else (
    echo.
    echo ❌ Build failed! Check the error messages above.
)

pause

@echo off
echo Transpiling TypeScript to JavaScript...
tsc index.test.ts

if %errorlevel% neq 0 (
  echo Error: TypeScript compilation failed
  exit /b %errorlevel%
)

echo Executing JavaScript...
node index.test.js

if %errorlevel% neq 0 (
  echo Error: JavaScript execution failed
  exit /b %errorlevel%
)

echo All tests passed successfully
exit /b 0

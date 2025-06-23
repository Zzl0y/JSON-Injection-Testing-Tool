# JSON Injection Testing Tool 🔧
## Console-based tool for testing JSON injection vulnerabilities

 * Usage: Run in browser console on target domain or use as bookmarklet
 * Target: Applications that process JSON data without proper validation
 * DISCLAIMER: This tool is for authorized penetration testing and educational 
 * purposes only. Use only on systems you own or have explicit permission to test.

## Usage Instructions 📖
### Method 1: Browser Console

```javascript
// Copy entire script to browser console, then run:
JSONInjectionTester.quickTest('https://test.lab/', 'data');
```

### Method 2: Custom Configuration

```javascript
const tester = new JSONInjectionTester({
    TARGET_URL: 'https://test.lab/api/endpoint',
    VULNERABLE_PARAM: 'jsonData',
    PAYLOAD_DELAY: 2000
});
tester.runTests();
```

### Method 3: Bookmarklet

```javascript
javascript:(function(){/* Paste minified version here */})();
```

## Key Features ⭐

    Multi-vector testing: Tests 7 different JSON injection techniques
    Multiple delivery methods: PostMessage, forms, WebSocket attempts
    Detailed logging: Complete test results and recommendations
    Configurable: Easy to adapt for different targets and parameters
    Professional output: Structured results with remediation advice


## Test Coverage 🎯

    JSON Structure Manipulation
    Code Execution via eval()
    Prototype Pollution
    Function Constructor Injection
    Promise Chain Bypass
    Unicode Escape Processing
    Nested Object Manipulation

Important Notes ⚠️

    Authorization Required: Only use on systems you own or have permission to test
    Educational Purpose: Designed for learning and authorized penetration testing
    Cross-Origin: May have limitations due to browser security policies
    Manual Verification: Always manually verify results for accurate assessment


